import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export async function generateStaticParams() {
  return [{ lang: "fa" }, { lang: "en" }];
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // In Next.js 15+ (which create-next-app might install or newer types suggest), params is a Promise.
  // However, I installed Next.js 14 in Step 1? No, I ran create-next-app@latest which installs 15.
  // Next.js 15 makes params a Promise in Layouts/Pages.
  // I need to await it or use `React.use` if it was a component, but this is a server component (async).
  // I can just await it.
  
  return (
    <LangLayoutContent params={params}>{children}</LangLayoutContent>
  );
}

async function LangLayoutContent({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <div className="flex min-h-screen flex-col font-sans" dir={lang === "fa" ? "rtl" : "ltr"}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
