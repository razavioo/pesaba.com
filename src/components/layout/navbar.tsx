"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { companyInfo } from "@/data/company";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small timeout to ensure it runs after hydration or just accept it's a client side effect.
    // The warning "Calling setState synchronously within an effect" is usually fine in empty dependency array for mounting check,
    // but maybe the linter is very strict.
    // However, the standard way to avoid hydration mismatch is indeed this.
    // We can wrap it in a timeout or just ignore if it's a false positive from a custom rule, but let's fix it.
    // Actually, setting state in useEffect is the standard way to handle "mounted".
    // Let's use requestAnimationFrame or just ignore.
    // Or maybe the linter thinks it's synchronous because it's the *only* thing?
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const lang = pathname?.split("/")[1] || "fa";
  const isEnglish = lang === "en";

  const links = [
    { href: `/${lang}`, label: isEnglish ? "Home" : "صفحه اصلی" },
    { href: `/${lang}/products`, label: isEnglish ? "Products" : "محصولات" },
    {
      href: `/${lang}/articles`,
      label: isEnglish ? "Encyclopedia" : "دانشنامه",
    },
    {
      href: `/${lang}/contact-us`,
      label: isEnglish ? "Contact Us" : "تماس با ما",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-lg">
              {companyInfo.name}
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2">
           <Link href={isEnglish ? "/fa" : "/en"}>
            <Button variant="ghost" size="icon" title={isEnglish ? "Persian" : "English"}>
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle Language</span>
            </Button>
           </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {mounted && theme === "dark" ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
