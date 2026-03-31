import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { MapPin, Phone, Mail, Map } from "lucide-react";

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Contact");

  return (
    <>
      {/* Page header */}
      <section className="bg-primary/5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact info */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {t("infoTitle")}
              </h2>
              <div className="mt-6 flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {t("address")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t("phone")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t("email")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form placeholder */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {t("formTitle")}
              </h2>
              <div className="mt-6 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
                <p className="text-sm text-muted-foreground">
                  {t("formComingSoon")}
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      {t("nameLabel")}
                    </label>
                    <div className="mt-1 h-10 rounded-md border border-input bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      {t("emailLabel")}
                    </label>
                    <div className="mt-1 h-10 rounded-md border border-input bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      {t("messageLabel")}
                    </label>
                    <div className="mt-1 h-24 rounded-md border border-input bg-background" />
                  </div>
                  <button
                    disabled
                    className="inline-flex items-center rounded-lg bg-primary/50 px-5 py-2.5 text-sm font-semibold text-primary-foreground cursor-not-allowed"
                  >
                    {t("sendButton")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {t("mapTitle")}
          </h2>
          <div className="mt-6 flex aspect-[16/7] items-center justify-center rounded-2xl bg-primary/10">
            <Map className="h-16 w-16 text-primary/40" />
          </div>
        </div>
      </section>
    </>
  );
}
