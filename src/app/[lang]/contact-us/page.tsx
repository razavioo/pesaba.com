"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { companyInfo } from "@/data/company";
import { MapPin, Phone, Mail, Printer, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Note: generateStaticParams cannot be used in a "use client" component.
// Since this page is static and depends on [lang], we need to handle it.
// However, the [lang] layout already generates the params.
// But Next.js typically requires leaf nodes to be buildable.
// In app router, if the parent layout has generateStaticParams, the children usually don't need it explicitly unless they have their own dynamic segments.
// Here [lang] is handled by parent. contact-us is static path.
// The error was because I exported generateStaticParams from a "use client" file.
// I will remove generateStaticParams from here. It should be fine as it inherits params from layout?
// No, actually, for static export, if I don't define generateStaticParams here, Next.js needs to know all paths.
// Since [lang] is dynamic, and contact-us is a child, Next.js knows /fa/contact-us from the parent layout's params?
// Yes, usually.
// If not, I can make a separate wrapper or just accept that "use client" pages are leaf nodes.
// Let's try removing it.

// "use client" component cannot be async. But we need to unwrap params if Next.js 15.
// However, in client components, params is passed as a prop, but currently Next.js 15 treats it as a Promise even in client components?
// According to Next.js 15 upgrade guide: "params and searchParams props in Layouts, Pages, Routes, and GenerateMetadata are now Promises."
// BUT for client components, it's complicated.
// "If you are accessing params in a Client Component, you should use React.use(params)."
// Since I am on Next 15.1, I should use `use(params)`.

import { use } from "react";

export default function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const isFa = lang === "fa";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(isFa ? "پیام شما ارسال شد" : "Message sent");
    setIsSubmitting(false);
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isFa ? "تماس با ما" : "Contact Us"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {isFa
            ? "برای دریافت مشاوره، استعلام قیمت و یا طرح هرگونه سوال با ما در ارتباط باشید."
            : "Get in touch with us for consultation, price inquiries, or any questions."}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Contact Form */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {isFa ? "فرم تماس" : "Contact Form"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      {isFa ? "نام" : "Name"}
                    </label>
                    <Input id="firstName" placeholder="" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      {isFa ? "نام خانوادگی" : "Family Name"}
                    </label>
                    <Input id="lastName" placeholder="" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    {isFa ? "شماره تلفن" : "Phone Number"}
                  </label>
                  <Input id="phone" type="tel" placeholder="" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {isFa ? "متن پیام" : "Message"}
                  </label>
                  <Textarea
                    id="message"
                    placeholder=""
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                     "..."
                  ) : (
                    <>
                      {isFa ? "ارسال پیام" : "Send Message"}
                      <Send className="mr-2 h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-6">
              {isFa ? "اطلاعات تماس" : "Contact Information"}
            </h2>
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{isFa ? "آدرس" : "Address"}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {companyInfo.contact.address}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isFa ? "کد پستی:" : "Postal Code:"} {companyInfo.contact.postalCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{isFa ? "تلفن" : "Phone"}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                     <a href={`tel:${companyInfo.contact.phone.replace(/-/g, "")}`} className="hover:text-primary transition-colors">
                        {companyInfo.contact.phone}
                     </a>
                  </p>
                </div>
              </div>

               <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                  <Printer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{isFa ? "دورنگار" : "Fax"}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {companyInfo.contact.fax}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-background">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{isFa ? "ایمیل" : "Email"}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    <a href={`mailto:${companyInfo.contact.email}`} className="hover:text-primary transition-colors">
                        {companyInfo.contact.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="h-[300px] w-full rounded-xl border bg-muted overflow-hidden relative group">
             {/* Static Placeholder to represent the map exactly as requested in "Enterprise" style without API key issues */}
             <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-700">
                    <div className="text-center">
                        <MapPin className="h-12 w-12 text-red-600 mx-auto mb-2 animate-bounce" />
                        <span className="text-sm text-muted-foreground font-medium">مشاهده موقعیت روی نقشه</span>
                    </div>
                 </div>
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
