'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { products, users } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowLeft, ShoppingCart, Frown, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const product = products.find((p) => p.id === id);
  const maker = product ? users.find((u) => u.id === product.makerId) : null;

  const handleBuyNow = () => {
    toast({
      title: "Thank you for your purchase!",
      description: `${product?.name} is on its way.`,
    });
  }

  if (!product) {
    return (
      <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
        <Frown className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold font-headline">Product Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          Sorry, we couldn&apos;t find the product you were looking for.
        </p>
        <Button asChild className="mt-6">
          <Link href="/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:px-6">
       <div className="mb-8">
        <Button variant="outline" asChild>
            <Link href="/marketplace">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Marketplace
            </Link>
        </Button>
       </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square w-full">
            <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover rounded-lg shadow-lg"
            data-ai-hint={product.imageHint}
            />
        </div>
        <div className="flex flex-col justify-center">
          <Badge variant="outline" className="w-fit mb-2">{product.material}</Badge>
          <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-primary mb-4">₹{product.price.toFixed(2)}</p>

          <Card className="bg-secondary/20 border-border/50 mb-6">
            <CardContent className="p-4">
                <p className="text-muted-foreground">{product.story}</p>
            </CardContent>
          </Card>
          
          {maker && (
             <Link href="#" className="group">
                <Card className="mb-6 transition-all group-hover:shadow-md">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar className="h-14 w-14">
                        <AvatarImage src={maker.avatarUrl} alt={maker.name} />
                        <AvatarFallback>{maker.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg font-headline">Made by {maker.name}</CardTitle>
                            <CardDescription className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                                {maker.rating}
                            </CardDescription>
                        </div>
                    </CardHeader>
                </Card>
             </Link>
          )}

           <div className="flex items-center text-sm text-green-700 dark:text-green-400 mb-6">
                <Leaf className="mr-2 h-5 w-5" />
                <span>Diverted <strong>{product.wasteDiverted}kg</strong> of waste from landfill.</span>
            </div>

          <Button size="lg" onClick={handleBuyNow}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
