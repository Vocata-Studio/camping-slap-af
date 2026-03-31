"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/accommodation", key: "accommodation" },
  { href: "/booking", key: "booking" },
  { href: "/activities", key: "activities" },
  { href: "/contact", key: "contact" },
  { href: "/gallery", key: "gallery" },
] as const;

export function Header() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold text-primary">
            Camping Slap Af
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        {/* Right side: language switcher + mobile toggle */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-foreground/70 hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-border/50 bg-background px-4 pb-4 pt-2 lg:hidden">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
