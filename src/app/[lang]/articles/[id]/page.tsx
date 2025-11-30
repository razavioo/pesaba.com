import { articles } from "@/data/articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export function generateStaticParams() {
  const params = [];
  for (const lang of ["fa", "en"]) {
    for (const article of articles) {
      params.push({ lang, id: article.id });
    }
  }
  return params;
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { id, lang } = await params;
  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  const isFa = lang === "fa";

  return (
    <div className="container py-10 max-w-4xl">
       <div className="mb-8">
        <Link
          href={`/${lang}/articles`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
          {isFa ? "بازگشت به مقالات" : "Back to Articles"}
        </Link>
      </div>

      <article className="prose prose-slate dark:prose-invert max-w-none lg:prose-lg">
        <h1>{article.title}</h1>
        <div className="flex items-center text-sm text-muted-foreground not-prose mb-8">
            <Calendar className="mr-2 h-4 w-4 ml-2" />
            <span>{article.date}</span>
        </div>
        
        {/* Render HTML content safely since it comes from our internal data file */}
        <div 
            dangerouslySetInnerHTML={{ __html: article.content }} 
            className="text-justify leading-loose"
        />
      </article>
    </div>
  );
}
