import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { products, users } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function MarketplacePage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
            Upcycled Marketplace
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
            Discover one-of-a-kind items with a story, beautifully crafted from reclaimed materials.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => {
            const maker = users.find((user) => user.id === product.makerId);
            return (
              <Card key={product.id} className="group relative flex flex-col overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-lg">
                <CardHeader className="p-0">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                      data-ai-hint={product.imageHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <Badge variant="outline">{product.material}</Badge>
                  <h3 className="mt-2 text-lg font-headline text-foreground">{product.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.story}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex-col items-start">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      {maker && (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={maker.avatarUrl} alt={maker.name} />
                            <AvatarFallback>{maker.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{maker.name}</span>
                            <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs ml-1">{maker.rating}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
                    <Button asChild variant="secondary" size="sm">
                      <Link href="#">
                        View Product <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
