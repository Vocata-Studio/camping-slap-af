/**
 * Generate the studio schemas (schemas/<name>.json) and seed content
 * (content/<name>.json) for the editable page texts in src/lib/prose-spec.ts.
 *
 * The seed holds each text's current value from /messages, so seeding the CMS
 * changes nothing on the live site. Run after editing the spec:
 *
 *   npm run cms:prose          # writes schemas/ + content/
 *   npm run cms:deploy         # pushes the schemas
 *   npm run cms:seed -- --dry-run
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_LANGS,
  LANG_LABEL,
  PROSE_TYPES,
  SUFFIX,
  type GroupSpec,
  type Lang,
  type ListSpec,
  type Ref,
  type TextSpec,
  type TypeSpec,
} from "../src/lib/prose-spec.ts";

const root = join(import.meta.dirname, "..");
const messages: Record<string, Record<string, Record<string, string>>> = {};
for (const l of ["da", "en", "nl", "de"]) {
  messages[l] = JSON.parse(readFileSync(join(root, "messages", `${l}.json`), "utf8"));
}

/** Same lookup as t(): the language, then English; a missing text is "". */
function msg(lang: Lang, ref: Ref): string {
  const [ns, key] = ref.split(".");
  const v = messages[lang]?.[ns]?.[key] ?? messages.en?.[ns]?.[key];
  if (v === undefined) throw new Error(`Missing message ${ref} (${lang})`);
  return v;
}

/* ---- schema --------------------------------------------------------- */

type Field = Record<string, unknown>;

function langFields(name: string, title: string, long: boolean | undefined, langs: Lang[], description?: string): Field[] {
  return langs.map((l, i) => ({
    name: `${name}${SUFFIX[l]}`,
    type: long ? "text" : "string",
    title: `${title} (${LANG_LABEL[l]})`,
    ...(i === 0 && description ? { description } : {}),
  }));
}

function textFields(texts: Record<string, TextSpec> | undefined, langs: Lang[]): Field[] {
  return Object.entries(texts ?? {}).flatMap(([name, s]) => langFields(name, s.title, s.long, langs, s.description));
}

function listField(name: string, s: ListSpec, langs: Lang[]): Field {
  const fields = Object.entries(s.fields).flatMap(([f, fs]) => langFields(f, fs.title, fs.long, langs));
  if (s.keys) {
    fields.push({
      name: "noegle",
      type: "string",
      title: "Intern reference (rør ikke)",
      description: "Bestemmer ikonet. Lad den være som den er; nye punkter skal ikke have en.",
    });
  }
  return {
    name,
    type: "array",
    title: s.title,
    ...(s.description ? { description: s.description } : {}),
    of: { name: "punkt", type: "object", title: s.itemTitle, fields },
  };
}

function listFields(lists: Record<string, ListSpec> | undefined, langs: Lang[]): Field[] {
  return Object.entries(lists ?? {}).map(([name, s]) => listField(name, s, langs));
}

function groupField(name: string, g: GroupSpec, langs: Lang[]): Field {
  return {
    name,
    type: "object",
    title: g.title,
    ...(g.description ? { description: g.description } : {}),
    fields: [...textFields(g.texts, langs), ...listFields(g.lists, langs)],
  };
}

function schema(t: TypeSpec) {
  const langs = t.langs ?? DEFAULT_LANGS;
  return {
    name: t.name,
    title: t.title,
    singleton: true,
    preview: { path: t.preview },
    fields: [
      ...(t.extra?.fields ?? []),
      ...Object.entries(t.groups ?? {}).map(([name, g]) => groupField(name, g, langs)),
      ...textFields(t.texts, langs),
      ...listFields(t.lists, langs),
    ],
  };
}

/* ---- seed ----------------------------------------------------------- */

type Data = Record<string, unknown>;

function seedTexts(texts: Record<string, TextSpec> | undefined, langs: Lang[]): Data {
  const out: Data = {};
  for (const [name, s] of Object.entries(texts ?? {})) {
    for (const l of langs) out[`${name}${SUFFIX[l]}`] = msg(l, s.ref);
  }
  return out;
}

function seedLists(lists: Record<string, ListSpec> | undefined, langs: Lang[]): Data {
  const out: Data = {};
  for (const [name, s] of Object.entries(lists ?? {})) {
    // Rows whose texts are empty in every language aren't shown on the site,
    // so they're left out instead of appearing as blank entries in the studio.
    out[name] = s.rows.flatMap((row, i) => {
      const item: Data = {};
      for (const [f, ref] of Object.entries(row)) {
        for (const l of langs) item[`${f}${SUFFIX[l]}`] = msg(l, ref);
      }
      if (Object.values(item).every((v) => v === "")) return [];
      if (s.keys) item.noegle = s.keys[i];
      return [item];
    });
  }
  return out;
}

function seed(t: TypeSpec) {
  const langs = t.langs ?? DEFAULT_LANGS;
  const data: Data = { ...(t.extra?.seed ?? {}) };
  for (const [name, g] of Object.entries(t.groups ?? {})) {
    data[name] = { ...seedTexts(g.texts, langs), ...seedLists(g.lists, langs) };
  }
  Object.assign(data, seedTexts(t.texts, langs), seedLists(t.lists, langs));
  return { data };
}

for (const t of PROSE_TYPES) {
  writeFileSync(join(root, "schemas", `${t.name}.json`), JSON.stringify(schema(t), null, 2) + "\n");
  writeFileSync(join(root, "content", `${t.name}.json`), JSON.stringify(seed(t), null, 2) + "\n");
  console.log(`✓ ${t.name}`);
}
