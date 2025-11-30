import Link from "next/link";
import { Button } from "@/components/ui/button";
import { companyInfo } from "@/data/company";
import { ArrowLeft, Shield, Radio, Server, Database, Activity, CheckCircle2, Users, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function generateStaticParams() {
  return [{ lang: "fa" }, { lang: "en" }];
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const isFa = lang === "fa";

  return (
    <div className="flex flex-col gap-16 pb-10">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-slate-900 to-slate-800 py-24 md:py-32 lg:py-40 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-sm font-medium text-slate-300 backdrop-blur-sm">
                <Shield className="mr-2 h-4 w-4" />
                <span>One-Way Ticket to Security</span>
            </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {companyInfo.name}
          </h1>
          <p className="max-w-[700px] text-lg text-slate-300 md:text-xl">
             چالش شما آغاز حرکت ماست
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href={`/${lang}/products`}>
              <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-none">
                {isFa ? "مشاهده محصولات" : "View Products"}
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/${lang}/contact-us`}>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white">
                {isFa ? "تماس با ما" : "Contact Us"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
                 <h2 className="text-3xl font-bold tracking-tight mb-4">درباره ما</h2>
                 <p className="text-muted-foreground text-lg leading-relaxed text-justify">
                    {companyInfo.mission}
                 </p>
            </div>
             <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-6 shadow-sm">
                     <Briefcase className="h-8 w-8 mb-2 text-primary" />
                     <div className="text-3xl font-bold">{companyInfo.stats.products}</div>
                     <div className="text-sm text-muted-foreground">محصولات</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-6 shadow-sm">
                     <Activity className="h-8 w-8 mb-2 text-primary" />
                     <div className="text-3xl font-bold">{companyInfo.stats.services}</div>
                     <div className="text-sm text-muted-foreground">خدمات</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-6 shadow-sm">
                     <Users className="h-8 w-8 mb-2 text-primary" />
                     <div className="text-3xl font-bold">{companyInfo.stats.customers}</div>
                     <div className="text-sm text-muted-foreground">مشتریان</div>
                </div>
            </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">خدمات ما</h2>
            <p className="text-muted-foreground mt-2">راهکارهای جامع در حوزه‌های مختلف</p>
         </div>
         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
                { title: "امنیت", icon: Shield, desc: "راهکارهای جامع سخت‌افزاری و نرم‌افزاری بومی، دیوار آتش، رمزکننده و ..." },
                { title: "فرکانس رادیویی", icon: Radio, desc: "طراحی و ساخت آنتن، فیلتر، تقویت‌کننده و تجهیزات رادیویی" },
                { title: "انتقال داده", icon: Server, desc: "طراحی و ساخت مدم‌های مخابراتی تا سرعت 10G" },
                { title: "فناوری اطلاعات", icon: Database, desc: "طراحی و ساخت سرور، سوئیچ و کارت‌های پردازشی خاص، راه‌اندازی سامانه‌های داده‌های کلان" },
                { title: "پایش", icon: Activity, desc: "تجهیزات و نرم‌افزارهای جمع‌آوری و تحلیل داده برای صنایع مختلف" },
            ].map((service, i) => (
                <Card key={i} className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <service.icon className="h-10 w-10 text-primary mb-2" />
                        <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{service.desc}</p>
                    </CardContent>
                </Card>
            ))}
         </div>
      </section>

       {/* Why Us Section */}
       <section className="bg-muted/50 py-16">
        <div className="container">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight">چرا پرتو ارتباط صبا؟</h2>
             </div>
             <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 text-center">
                {[
                    "تأمین مستقیم قطعات",
                    "فناوری روز",
                    "قیمت رقابتی",
                    "آموزش و پشتیبانی مستمر",
                    "تمرکز بر رضایت مشتری"
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <span className="font-medium">{item}</span>
                    </div>
                ))}
             </div>
        </div>
       </section>
    </div>
  );
}
