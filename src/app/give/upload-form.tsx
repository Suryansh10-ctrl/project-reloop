"use client";

import { useState, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { identifyMaterialAction, createListingAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, UploadCloud, IndianRupee } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialIdentifyState = {
  result: null,
  error: null,
};

function IdentifySubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Identifying...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Identify Material
        </>
      )}
    </Button>
  );
}

function ListingSubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} className="w-full mt-4">
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Completing...
          </>
        ) : (
          "Complete Listing"
        )}
      </Button>
    );
  }

export default function UploadForm() {
  const [identifyState, identifyAction] = useActionState(identifyMaterialAction, initialIdentifyState);
  
  const [preview, setPreview] = useState<string | null>(null);
  const [listingType, setListingType] = useState("free");
  const [price, setPrice] = useState("");
  const [customizationRequest, setCustomizationRequest] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataUriInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        if (dataUriInputRef.current) {
          dataUriInputRef.current.value = result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (formData: FormData) => {
    const listingData = {
        material: formData.get('material'),
        description: formData.get('description'),
        photoDataUri: formData.get('photoDataUri'),
        listingType: formData.get('listingType'),
        price: formData.get('price'),
        customizationRequest: formData.get('customizationRequest'),
    };
    sessionStorage.setItem('newListing', JSON.stringify(listingData));
    
    // We are calling the action directly, not via useActionState here.
    // The form element's action prop will handle the submission.
  };

  return (
    <>
      {!identifyState.result && (
        <Card className="shadow-lg">
          <form action={identifyAction}>
            <input type="hidden" name="photoDataUri" ref={dataUriInputRef} />
            <CardHeader>
              <CardTitle>List an Item</CardTitle>
              <CardDescription>Upload a photo and we'll help with the rest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="photo">Item Photo</Label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-1 text-center">
                    {preview ? (
                      <Image src={preview} alt="Preview" width={200} height={200} className="mx-auto h-32 w-32 object-contain rounded-md" />
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div className="flex text-sm text-muted-foreground">
                          <p className="pl-1">Click to upload or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
                <Input
                  id="photo"
                  name="photo"
                  type="file"
                  className="sr-only"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  ref={descriptionRef}
                  placeholder="e.g., 'An old blue denim jacket, size L'"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <IdentifySubmitButton />
               {identifyState.error && (
                <Alert variant="destructive" className="mt-4 w-full">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{identifyState.error}</AlertDescription>
                </Alert>
              )}
            </CardFooter>
          </form>
        </Card>
      )}

      {identifyState.result && (
        <Alert variant="default" className="w-full bg-primary/10 border-primary/20 mt-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle className="font-headline text-lg text-primary">Material Identified!</AlertTitle>
          <AlertDescription asChild>
             <form action={createListingAction} onSubmit={(e) => handleFormSubmit(new FormData(e.currentTarget))} className="space-y-4">
                <input type="hidden" name="material" value={identifyState.result.material} />
                <input type="hidden" name="photoDataUri" value={preview || ''} />
                <input type="hidden" name="description" value={descriptionRef.current?.value || ''} />

                <p>
                We believe your item is made of: <Badge className="text-base ml-2">{identifyState.result.material}</Badge>
                </p>
                <div className="space-y-2">
                    <Label>How do you want to list this item?</Label>
                    <RadioGroup name="listingType" value={listingType} onValueChange={setListingType} className="flex flex-col sm:flex-row gap-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="free" id="r1" />
                            <Label htmlFor="r1">Give for Free</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sale" id="r2" />
                            <Label htmlFor="r2">Sell Item</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="customize" id="r3" />
                            <Label htmlFor="r3">Find an Artisan to Customize</Label>
                        </div>
                    </RadioGroup>
                </div>
                 {listingType === 'sale' && (
                    <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                placeholder="Enter your price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="pl-8"
                            />
                        </div>
                    </div>
                )}
                 {listingType === 'customize' && (
                    <div className="space-y-2">
                        <Label htmlFor="customizationRequest">What do you want to make?</Label>
                        <Textarea
                            id="customizationRequest"
                            name="customizationRequest"
                            placeholder="e.g., 'Turn this into a tote bag' or 'I want a modern-looking plant stand'"
                            value={customizationRequest}
                            onChange={(e) => setCustomizationRequest(e.target.value)}
                            required
                            className="min-h-[100px]"
                        />
                    </div>
                 )}
                <ListingSubmitButton />
            </form>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
