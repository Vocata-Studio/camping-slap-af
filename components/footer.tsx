import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");
  const tHeader = useTranslations("Header");

  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="font-heading text-lg font-bold text-primary">
              Camping Slap Af
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              {t("quickLinks")}
            </h4>
            <nav className="mt-3 flex flex-col gap-2">
              {(["about", "accommodation", "activities", "contact"] as const).map((key) => (
                <Link
                  key={key}
                  href={`/${key}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {tHeader(key)}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              {t("contactInfo")}
            </h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <p>{t("address")}</p>
              <p>{t("phone")}</p>
              <p>{t("email")}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
