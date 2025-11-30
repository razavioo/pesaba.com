import { articles } from "@/data/articles";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

export function generateStaticParams() {
  return [{ lang: "fa" }, { lang: "en" }];
}

export default async function ArticlesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFa = lang === "fa";

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {isFa ? "دانشنامه" : "Encyclopedia"}
        </h1>
        <p className="text-muted-foreground">
          {isFa
            ? "مقالات تخصصی در حوزه مخابرات و امنیت شبکه"
            : "Technical articles in telecommunications and network security"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} className="flex flex-col hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="leading-snug text-lg">{article.title}</CardTitle>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Calendar className="mr-1 h-3 w-3 ml-1" />
                <span>{article.date}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-4">
                {article.summary}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/${lang}/articles/${article.id}`} className="w-full">
                <Button variant="ghost" className="w-full justify-between group">
                  {isFa ? "مطالعه مقاله" : "Read Article"}
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
