"use client";

import Image from "next/image";
import { materials as initialMaterials, users as initialUsers, User } from "@/lib/placeholder-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageSquareQuote } from "lucide-react";
import IdeaButton from "./idea-button";
import { useEffect, useState } from "react";
import { Material } from "@/lib/placeholder-data";
import { useUser } from "@/firebase";


export default function MakersFeedPage() {
  const [materials, setMaterials] = useState(initialMaterials);
  const [users, setUsers] = useState(initialUsers);
  const { user } = useUser();

  useEffect(() => {
    // Check for new listing data in sessionStorage
    const newListingJSON = sessionStorage.getItem('newListing');
    
    if (newListingJSON && user) {
      const newListing = JSON.parse(newListingJSON);
      
      // We only want to process it once, so we remove it after reading.
      sessionStorage.removeItem('newListing');

      if (newListing.material && newListing.photoDataUri) {
        const newMaterial: Material = {
          id: `mat-${Date.now()}`,
          name: newListing.material,
          description: newListing.description || `A new listing for ${newListing.material}.`,
          imageUrl: newListing.photoDataUri,
          imageHint: "new material",
          giverId: user.uid,
          location: "Your Location",
          status: newListing.listingType === 'free' ? 'Free' : newListing.listingType === 'sale' ? 'For Sale' : 'For Customization',
          price: newListing.listingType === 'sale' ? parseFloat(newListing.price) : undefined,
          customizationRequest: newListing.customizationRequest,
        };

        // Add to the top of the feed and prevent duplicates
        setMaterials(prevMaterials => {
          if (prevMaterials.find(m => m.imageUrl === newMaterial.imageUrl)) {
            return prevMaterials;
          }
          return [newMaterial, ...prevMaterials]
        });

        // Add current user to users list if not already present
        setUsers(prevUsers => {
          if (prevUsers.find(u => u.id === user.uid)) {
            return prevUsers;
          }
          const newUser: User = {
            id: user.uid,
            name: user.displayName || 'New User',
            email: user.email || '',
            avatarUrl: user.photoURL || '',
            impactScore: 0,
            bio: '',
            type: 'Giver',
            rating: 0
          };
          return [...prevUsers, newUser];
        });
      }
    }
  }, [user]);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
            Local Materials Feed
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
            Find treasures in your neighborhood. All listings are within a 10km radius.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {materials.map((material) => {
            const giver = users.find((user) => user.id === material.giverId);
            return (
              <Card key={material.id} className="flex flex-col overflow-hidden shadow-sm transition-all hover:shadow-lg">
                <CardHeader className="p-0">
                  <Image
                    src={material.imageUrl}
                    alt={material.name}
                    width={400}
                    height={300}
                    className="aspect-[4/3] w-full object-cover"
                    data-ai-hint={material.imageHint}
                  />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl mb-2">{material.name}</CardTitle>
                    <Badge variant={material.status === 'Free' ? 'default' : 'secondary'} className={material.status === 'Free' ? 'bg-primary/80' : ''}>
                      {material.status === 'For Sale' && material.price ? `₹${material.price}` : material.status}
                    </Badge>
                  </div>
                  
                  {material.status === 'For Customization' && material.customizationRequest ? (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm font-semibold text-accent-foreground flex items-center gap-2">
                        <MessageSquareQuote className="h-4 w-4 flex-shrink-0" />
                        Customization Idea:
                      </p>
                      <p className="text-sm text-muted-foreground italic">"{material.customizationRequest}"</p>
                    </div>
                  ) : (
                    <CardDescription className="line-clamp-2">{material.description}</CardDescription>
                  )}

                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-col items-start gap-4">
                  <div className="flex justify-between w-full items-center">
                    {giver && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={giver.avatarUrl} alt={giver.name} />
                            <AvatarFallback>{giver.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{giver.name}</span>
                        </div>
                    )}
                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{material.location}</span>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <IdeaButton 
                        materialName={material.name} 
                        customizationRequest={material.customizationRequest} 
                        giver={giver}
                    />
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
