import { products, productCategories } from "@/data/products";
import { ProductCard } from "@/components/layout/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return [{ lang: "fa" }, { lang: "en" }];
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ cat?: string }>;
}) {
  const { lang } = await params;
  const isFa = lang === "fa";
  
  // In a static export, searchParams might not be available at build time for filtering logic if we want purely static.
  // However, we can render all and filter client-side or just render all.
  // Given the requirement for "cat=UUID" URLs, we should ideally handle this.
  // For static export, query params are not part of the route.
  // We will display all products and add a client-side filter or simple links.
  // The user asked for "URL fidelity". If the user visits ?cat=..., the page loads.
  // We will display the filter sidebar.

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {isFa ? "محصولات" : "Products"}
        </h1>
        <p className="text-muted-foreground">
          {isFa
            ? "تجهیزات و راهکارهای مخابراتی و امنیتی"
            : "Telecommunication and security solutions"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
            <div className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold mb-4">{isFa ? "دسته‌بندی‌ها" : "Categories"}</h3>
                <div className="flex flex-col space-y-2">
                    <Link href={`/${lang}/products`}>
                        <Button variant="ghost" className="w-full justify-start font-normal">
                            {isFa ? "همه موارد" : "All Items"}
                        </Button>
                    </Link>
                    {productCategories.map((cat) => (
                        <Link key={cat.id} href={`/${lang}/products?cat=${cat.id}`}>
                             <Button variant="ghost" className={cn("w-full justify-start font-normal text-muted-foreground")}>
                                {cat.name}
                             </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        subtitle={product.subtitle}
                        description={product.description}
                        lang={lang}
                    />
                ))}
             </div>
        </div>
      </div>
    </div>
  );
}
