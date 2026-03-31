import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Leaf, Heart, Sparkles, MapPin, Trees } from "lucide-react";

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("About");

  return (
    <>
      {/* Page header */}
      <section className="bg-primary/5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {t("storyTitle")}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t("storyText1")}
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t("storyText2")}
              </p>
            </div>
            {/* Placeholder image */}
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-primary/10">
              <Trees className="h-20 w-20 text-primary/40" />
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-card py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Placeholder image */}
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-primary/10 lg:order-first">
              <MapPin className="h-20 w-20 text-primary/40" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {t("locationTitle")}
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {t("locationText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {t("valuesTitle")}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <ValueCard
              icon={<Leaf className="h-8 w-8" />}
              title={t("value1Title")}
              description={t("value1Description")}
            />
            <ValueCard
              icon={<Heart className="h-8 w-8" />}
              title={t("value2Title")}
              description={t("value2Description")}
            />
            <ValueCard
              icon={<Sparkles className="h-8 w-8" />}
              title={t("value3Title")}
              description={t("value3Description")}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
