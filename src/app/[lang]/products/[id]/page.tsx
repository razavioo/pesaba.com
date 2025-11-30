import { products } from "@/data/products";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Phone, CheckCircle2 } from "lucide-react";
import { companyInfo } from "@/data/company";

export function generateStaticParams() {
  const params = [];
  for (const lang of ["fa", "en"]) {
    for (const product of products) {
      params.push({ lang, id: product.id });
    }
  }
  return params;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { id, lang } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const isFa = lang === "fa";

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link
          href={`/${lang}/products`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          {isFa ? "بازگشت به محصولات" : "Back to Products"}
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {product.title}
            </h1>
            <h2 className="text-xl text-muted-foreground">{product.subtitle}</h2>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="whitespace-pre-line leading-relaxed text-justify">
              {product.fullDescription}
            </div>
          </div>

           {/* Technical Specs Placeholder if implied in description */}
           {product.fullDescription.includes("مشخصات فنی") && (
             <div className="mt-8 rounded-lg border bg-muted/30 p-6">
                <h3 className="text-lg font-semibold mb-4">مشخصات برجسته</h3>
                 {/* Since we don't have structured specs for all, we rely on the text content in fullDescription.
                     If we parsed it, we would render a list here. 
                     For now, the fullDescription contains the specs text.
                 */}
                 <p className="text-sm text-muted-foreground">برای مشاهده جزئیات کامل فنی لطفا با بخش فروش تماس بگیرید.</p>
             </div>
           )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="font-semibold mb-4">{isFa ? "اطلاعات خرید" : "Purchase Info"}</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">{isFa ? "موجود (تولید سفارشی)" : "Available (Custom Order)"}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    {isFa ? "برای استعلام قیمت و مشاوره فنی با ما تماس بگیرید." : "Contact us for price inquiry and technical consultation."}
                </p>
                <a href={`tel:${companyInfo.contact.phone.replace(/-/g, "")}`} className="block w-full">
                    <Button className="w-full gap-2">
                        <Phone className="h-4 w-4" />
                        {companyInfo.contact.phone}
                    </Button>
                </a>
            </div>
          </div>

           <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="font-semibold mb-2">{isFa ? "دسته‌بندی" : "Category"}</h3>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    {product.category}
                </span>
           </div>
        </div>
      </div>
    </div>
  );
}
