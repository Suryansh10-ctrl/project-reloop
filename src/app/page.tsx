'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Gift,
  Handshake,
  Heart,
  Recycle,
  ShoppingBag,
  Store,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { products, users, materials } from '@/lib/placeholder-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
             <h1 className="text-4xl font-headline font-bold tracking-tight text-primary sm:text-5xl md:text-6xl flex flex-col sm:flex-row justify-center items-center gap-x-4">
                <motion.span
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="whitespace-nowrap"
                >
                  Reloop:
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="whitespace-nowrap"
                >
                  Waste to Wonder
                </motion.span>
              </h1>
              <motion.p
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.5 }}
                className="max-w-[600px] text-muted-foreground md:text-xl mx-auto"
              >
                Turn your unwanted items into treasures. Connect with local
                artisans, discover unique upcycled products, and make a positive
                impact.
              </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col gap-2 min-[400px]:flex-row justify-center"
            >
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/marketplace">
                  Find Treasures <ShoppingBag className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/give">
                  Give Waste <Recycle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">
              How It Works
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A simple process for Givers, Makers, and Buyers to create a circular economy.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <Gift className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-headline">For Givers</h3>
              <p className="text-sm text-muted-foreground">
                Upload your unused items. Our AI identifies the material, and you choose to donate, sell, or get it customized.
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <Store className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-headline">For Makers</h3>
              <p className="text-sm text-muted-foreground">
                Find local materials for your next project. Use our AI Idea Button for inspiration and sell your creations in your own store.
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <Heart className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-bold font-headline">For Buyers</h3>
              <p className="text-sm text-muted-foreground">
                Shop for unique, sustainable products with a story. Know the impact of your purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">
              Featured Products
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover wonders crafted from waste by our talented makers.
            </p>
          </div>
          <div className="mx-auto grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => {
              const maker = users.find((u) => u.id === product.makerId);
              return (
                <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="aspect-[4/3] w-full object-cover"
                      data-ai-hint={product.imageHint}
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold font-headline">{product.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      {maker && (
                        <>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={maker.avatarUrl} alt={maker.name} />
                            <AvatarFallback>{maker.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{maker.name}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.story}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</span>
                       <Button variant="ghost" size="sm" asChild>
                        <Link href={`/marketplace/${product.id}`}>
                          View <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center">
            <Button asChild>
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">Our Impact</div>
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl md:text-5xl">Join the Upcycling Revolution</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Every item you give, make, or buy contributes to a more sustainable world. Together, we're diverting tons of waste from landfills.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="grid gap-1">
              <h3 className="text-4xl font-bold text-primary">
                {materials.length + products.length}+
              </h3>
              <p className="text-sm font-medium text-muted-foreground">Items Relooped</p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-4xl font-bold text-primary">
                {users.length}+
              </h3>
              <p className="text-sm font-medium text-muted-foreground">Community Members</p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-4xl font-bold text-primary">
                {(products.reduce((acc, p) => acc + p.wasteDiverted, 0)).toFixed(1)}kg
              </h3>
              <p className="text-sm font-medium text-muted-foreground">Waste Diverted</p>
            </div>
          </div>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/profile">
              Start Your Impact Journey <Handshake className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
