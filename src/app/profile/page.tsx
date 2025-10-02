
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products, users, Material } from "@/lib/placeholder-data";
import { Leaf, Star, Trophy } from "lucide-react";

export default function ProfilePage() {
    // Let's assume user-1 is the logged in user
    const user = users[0];
    const userProducts = products.filter(p => p.makerId === user.id);
    const [givenItems, setGivenItems] = useState<Material[]>([]);
    const searchParams = useSearchParams();

    useEffect(() => {
        const material = searchParams.get("material");
        const description = searchParams.get("description");
        const photoDataUri = searchParams.get("photoDataUri");
        const listingType = searchParams.get("listingType");

        if (material && photoDataUri && listingType === 'free') {
            const newGivenItem: Material = {
                id: `mat-${Date.now()}`,
                name: material,
                description: description || `A new listing for ${material}.`,
                imageUrl: photoDataUri,
                imageHint: "new material",
                giverId: user.id,
                location: "Your Location", // Placeholder
                status: 'Free',
            };

            setGivenItems(prevItems => {
                if (prevItems.find(item => item.imageUrl === newGivenItem.imageUrl)) {
                    return prevItems;
                }
                return [newGivenItem, ...prevItems];
            });
        }
    }, [searchParams, user.id]);

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <Card className="w-full max-w-4xl mx-auto shadow-lg">
                <CardHeader className="relative h-48 bg-primary/10 flex items-end p-6">
                     <div className="flex items-end gap-6">
                        <Avatar className="w-32 h-32 border-4 border-background">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <span>@{user.name.toLowerCase().replace(' ', '')}</span>
                                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/> {user.rating}</span>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
                    <p className="text-muted-foreground mb-6">{user.bio}</p>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-headline">
                                <Leaf className="text-primary"/>
                                Your Impact Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <p className="text-4xl font-bold text-primary">{user.impactScore} kg</p>
                                <p className="text-sm text-muted-foreground">of waste diverted from landfills</p>
                            </div>
                            <Progress value={user.impactScore} max={50} className="h-3"/>
                            <p className="text-xs text-muted-foreground text-center">You're on your way to becoming an Eco-Champion! Next goal: 50kg.</p>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="creations" className="mt-8">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="creations">Creations</TabsTrigger>
                            <TabsTrigger value="listings">Given Items</TabsTrigger>
                            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                        </TabsList>
                        <TabsContent value="creations" className="mt-6">
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {userProducts.map(product => (
                                     <Card key={product.id} className="overflow-hidden">
                                        <Image src={product.imageUrl} alt={product.name} width={300} height={200} className="w-full aspect-video object-cover"/>
                                        <div className="p-4">
                                            <h4 className="font-bold">{product.name}</h4>
                                            <p className="text-sm text-primary">${product.price}</p>
                                        </div>
                                     </Card>
                                ))}
                           </div>
                        </TabsContent>
                        <TabsContent value="listings" className="mt-6">
                            {givenItems.length === 0 ? (
                                <div className="text-center py-16">
                                    <p className="text-muted-foreground">You haven't listed any items to give away yet.</p>
                                    <Button asChild className="mt-4"><Link href="/give">Give an Item</Link></Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {givenItems.map(item => (
                                        <Card key={item.id} className="overflow-hidden">
                                            <Image src={item.imageUrl} alt={item.name} width={300} height={200} className="w-full aspect-video object-cover" />
                                            <div className="p-4">
                                                <h4 className="font-bold">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">{item.status}</p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="leaderboard" className="mt-6 text-center py-16">
                            <Trophy className="mx-auto h-12 w-12 text-yellow-500 mb-4"/>
                            <h3 className="text-xl font-bold font-headline">Coming Soon!</h3>
                            <p className="text-muted-foreground">Compete with others to see who can make the biggest impact.</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
