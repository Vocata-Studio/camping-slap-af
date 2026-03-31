import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const t = useTranslations("Footer");
  const tHeader = useTranslations("Header");

  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-lg font-bold text-primary">
              Camping Slap Af
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              {t("quickLinks")}
            </h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {tHeader("about")}
              </Link>
              <Link
                href="/accommodation"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {tHeader("accommodation")}
              </Link>
              <Link
                href="/activities"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {tHeader("activities")}
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {tHeader("contact")}
              </Link>
            </nav>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              {t("contactInfo")}
            </h4>
            <div className="mt-3 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                {t("address")}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                {t("phone")}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                {t("email")}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
