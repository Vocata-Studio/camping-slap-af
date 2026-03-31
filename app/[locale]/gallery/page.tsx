import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Camera } from "lucide-react";

export default function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("Gallery");

  const images = [
    { key: "image1Alt", aspect: "aspect-[4/3]" },
    { key: "image2Alt", aspect: "aspect-square" },
    { key: "image3Alt", aspect: "aspect-[4/3]" },
    { key: "image4Alt", aspect: "aspect-square" },
    { key: "image5Alt", aspect: "aspect-square" },
    { key: "image6Alt", aspect: "aspect-[4/3]" },
    { key: "image7Alt", aspect: "aspect-[4/3]" },
    { key: "image8Alt", aspect: "aspect-square" },
  ] as const;

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

      {/* Photo grid */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {images.map((img) => (
              <div
                key={img.key}
                className={`mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm ${img.aspect}`}
              >
                <div className="flex h-full w-full items-center justify-center bg-primary/10">
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-primary/30" />
                    <p className="mt-2 px-4 text-xs text-primary/40">
                      {t(img.key)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("comingSoon")}
          </p>
        </div>
      </section>
    </>
  );
}
