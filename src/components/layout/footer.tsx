import Link from "next/link";
import { companyInfo } from "@/data/company";
import { MapPin, Phone, Mail, Printer } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">{companyInfo.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {companyInfo.mission}
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">ارتباط با ما</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 shrink-0" />
                <span>{companyInfo.contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href={`tel:${companyInfo.contact.phone.replace(/-/g, "")}`}>
                  {companyInfo.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Printer className="h-4 w-4 shrink-0" />
                <span>{companyInfo.contact.fax}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${companyInfo.contact.email}`}>
                  {companyInfo.contact.email}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">لینک‌های مفید</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/fa" className="hover:underline">
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link href="/fa/products" className="hover:underline">
                  محصولات
                </Link>
              </li>
              <li>
                <Link href="/fa/articles" className="hover:underline">
                  دانشنامه
                </Link>
              </li>
              <li>
                <Link href="/fa/contact-us" className="hover:underline">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">موقعیت ما</h3>
            <div className="h-40 w-full overflow-hidden rounded-lg bg-gray-200 relative group">
                {/* Placeholder for Map - Avoid external iframe in sandbox if blocked, but using a static representation or link */}
                <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                  <div className="absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500 text-xs">
                     <span className="flex flex-col items-center">
                        <MapPin className="h-8 w-8 text-red-600 mb-2" />
                        مشاهده در OpenStreetMap
                     </span>
                  </div>
                </a>
            </div>
            <div className="mt-4 flex gap-4">
                 {/* Socials Placeholders */}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© ۲۰۲۴ تمام حقوق برای شرکت پرتو ارتباط صبا محفوظ هست.</p>
        </div>
      </div>
    </footer>
  );
}
