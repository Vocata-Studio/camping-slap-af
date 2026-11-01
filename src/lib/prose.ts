/**
 * Editable page texts (Vocata CMS), resolved per page language.
 *
 * Which CMS field holds which text lives in ./prose-spec.ts. The rules that
 * keep the live site from changing or going blank:
 *
 *  - A language stored in the CMS (da, en, nl; house rules also de) shows its
 *    CMS value. A blank field, or an unreachable CMS, shows the built-in text
 *    from /messages instead.
 *  - Every other language keeps its own built-in translation for as long as
 *    the Danish and English texts are unchanged. Once the editor changes one
 *    of them, that language shows the (new) English text, so no page ever
 *    shows an outdated translation.
 *  - A list that is missing or has no filled-in entries shows the built-in
 *    entries. A blank field in an entry falls back to English, then Danish,
 *    then Dutch.
 */
import { t } from "../i18n/utils";
import type { Locale } from "../i18n/utils";
import {
  DEFAULT_LANGS,
  SUFFIX,
  type GroupSpec,
  type Lang,
  type ListSpec,
  type Ref,
  type TextSpec,
  type TypeSpec,
} from "./prose-spec";
import { fetchSingleton, memo } from "./vocata";

type Obj = Record<string, unknown>;

export type Item<F extends string = string> = Record<F, string> & { noegle?: string };

type TextsOf<S> = S extends { texts: infer T } ? { [K in keyof T]: string } : unknown;
type ListsOf<S> = S extends { lists: infer L }
  ? { [K in keyof L]: L[K] extends { fields: infer F } ? Item<Extract<keyof F, string>>[] : never }
  : unknown;
type GroupsOf<S> = S extends { groups: infer G } ? { [K in keyof G]: TextsOf<G[K]> & ListsOf<G[K]> } : unknown;

/** A type's texts (string), lists (entries) and groups, ready to render. */
export type Resolved<S> = TextsOf<S> & ListsOf<S> & GroupsOf<S>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** The built-in text of a ref in a locale; "" when the message is missing. */
function builtIn(locale: Locale, ref: Ref): string {
  const [ns, key] = ref.split(".");
  const v = t(locale, ns, key);
  return v === key ? "" : v;
}

/* ---- texts ---------------------------------------------------------- */

const textIn = (lang: Lang, cms: Obj, name: string, s: TextSpec) =>
  str(cms[`${name}${SUFFIX[lang]}`]) || builtIn(lang, s.ref);

const textEdited = (lang: Lang, cms: Obj, name: string, s: TextSpec) =>
  textIn(lang, cms, name, s) !== builtIn(lang, s.ref);

/* ---- lists ---------------------------------------------------------- */

/** The editor's entries with at least one filled-in text, or null. */
function cmsEntries(cms: Obj, name: string, s: ListSpec, langs: Lang[]): Obj[] | null {
  const raw = cms[name];
  if (!Array.isArray(raw)) return null;
  const fields = Object.keys(s.fields);
  const entries = raw.filter(
    (e): e is Obj => isObj(e) && fields.some((f) => langs.some((l) => str(e[`${f}${SUFFIX[l]}`]) !== "")),
  );
  return entries.length > 0 ? entries : null;
}

/** The built-in entries in a locale, minus any whose message is missing. */
function builtInEntries(locale: Locale, s: ListSpec): Item[] {
  return s.rows.flatMap((row, i) => {
    const item: Item = {};
    for (const [f, ref] of Object.entries(row)) {
      item[f] = builtIn(locale, ref);
      if (item[f] === "") return [];
    }
    if (s.keys) item.noegle = s.keys[i];
    return [item];
  });
}

const FALLBACK_ORDER: Lang[] = ["en", "da", "nl"];

function listIn(lang: Lang, cms: Obj, name: string, s: ListSpec, langs: Lang[]): Item[] {
  const entries = cmsEntries(cms, name, s, langs);
  if (!entries) return builtInEntries(lang, s);
  const order = [lang, ...FALLBACK_ORDER.filter((l) => l !== lang && langs.includes(l))];
  return entries.map((e) => {
    const item: Item = {};
    for (const f of Object.keys(s.fields)) {
      item[f] = order.map((l) => str(e[`${f}${SUFFIX[l]}`])).find((v) => v !== "") ?? "";
    }
    const key = str(e.noegle);
    if (key) item.noegle = key;
    return item;
  });
}

/** Whether the list differs from the built-in one in any of `check`. */
function listEdited(check: Lang[], cms: Obj, name: string, s: ListSpec, langs: Lang[]): boolean {
  if (!cmsEntries(cms, name, s, langs)) return false;
  const project = (items: Item[]) =>
    JSON.stringify(items.map((it) => [...Object.keys(s.fields).map((f) => it[f]), it.noegle ?? ""]));
  return check.some(
    (lang) => project(listIn(lang, cms, name, s, langs)) !== project(builtInEntries(lang, s)),
  );
}

/* ---- whole types ---------------------------------------------------- */

type Part = Pick<GroupSpec, "texts" | "lists">;

function partIn(lang: Lang, cms: Obj, p: Part, langs: Lang[]): Obj {
  const out: Obj = {};
  for (const [name, s] of Object.entries(p.texts ?? {})) out[name] = textIn(lang, cms, name, s);
  for (const [name, s] of Object.entries(p.lists ?? {})) out[name] = listIn(lang, cms, name, s, langs);
  return out;
}

function partEdited(check: Lang[], cms: Obj, p: Part, langs: Lang[]): boolean {
  return (
    Object.entries(p.texts ?? {}).some(([name, s]) => check.some((l) => textEdited(l, cms, name, s))) ||
    Object.entries(p.lists ?? {}).some(([name, s]) => listEdited(check, cms, name, s, langs))
  );
}

/** One text or list per locale: CMS language, or built-in/English for the rest. */
function partFor(locale: Locale, cms: Obj, p: Part, langs: Lang[]): Obj {
  if ((langs as string[]).includes(locale)) return partIn(locale as Lang, cms, p, langs);
  const out: Obj = {};
  for (const [name, s] of Object.entries(p.texts ?? {})) {
    const one = { texts: { [name]: s } };
    out[name] = partEdited(["da", "en"], cms, one, langs) ? textIn("en", cms, name, s) : builtIn(locale, s.ref);
  }
  for (const [name, s] of Object.entries(p.lists ?? {})) {
    out[name] = listEdited(["da", "en"], cms, name, s, langs)
      ? listIn("en", cms, name, s, langs)
      : builtInEntries(locale, s);
  }
  return out;
}

function walk(spec: TypeSpec, doc: Obj, part: (cms: Obj, p: Part) => Obj): Obj {
  const out: Obj = {};
  for (const [name, g] of Object.entries(spec.groups ?? {})) {
    out[name] = part(isObj(doc[name]) ? doc[name] : {}, g);
  }
  return Object.assign(out, part(doc, spec));
}

/** A type's texts for a page language (see the rules at the top). */
export function prose<S extends TypeSpec>(locale: Locale, doc: Obj, spec: S): Resolved<S> {
  const langs = spec.langs ?? DEFAULT_LANGS;
  return walk(spec, doc, (cms, p) => partFor(locale, cms, p, langs)) as Resolved<S>;
}

/** A type's texts in one of its CMS languages. */
export function proseIn<S extends TypeSpec>(lang: Lang, doc: Obj, spec: S): Resolved<S> {
  const langs = spec.langs ?? DEFAULT_LANGS;
  return walk(spec, doc, (cms, p) => partIn(lang, cms, p, langs)) as Resolved<S>;
}

/** Whether any text of the type differs from the built-in text in `langs`. */
export function proseEdited(doc: Obj, spec: TypeSpec, check: Lang[]): boolean {
  const langs = spec.langs ?? DEFAULT_LANGS;
  const out: boolean[] = [];
  walk(spec, doc, (cms, p) => {
    out.push(partEdited(check, cms, p, langs));
    return {};
  });
  return out.some(Boolean);
}

/** The type's CMS document for this request ({} when missing or unreachable). */
export function getProseDoc(locals: App.Locals, spec: TypeSpec): Promise<Obj> {
  return memo(locals, `prose:${spec.name}`, async () => {
    const data = await fetchSingleton<Obj>(spec.name, locals.preview);
    return isObj(data) ? data : {};
  });
}

/** Fetch + resolve in one step. */
export async function getProse<S extends TypeSpec>(
  locals: App.Locals,
  locale: Locale,
  spec: S,
): Promise<Resolved<S>> {
  return prose(locale, await getProseDoc(locals, spec), spec);
}
