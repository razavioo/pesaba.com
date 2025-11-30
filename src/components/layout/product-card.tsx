import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ProductCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lang: string;
}

export function ProductCard({
  id,
  title,
  subtitle,
  description,
  lang,
}: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-baseline">
            <span>{title}</span>
            <span className="text-sm font-normal text-muted-foreground">{subtitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/${lang}/products/${id}`} className="w-full">
          <Button variant="outline" className="w-full group">
            مشاهده جزئیات
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
