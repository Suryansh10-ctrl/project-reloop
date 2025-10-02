"use client";

import { useState, useRef, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Image from "next/image";
import { identifyMaterialAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, UploadCloud } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const initialState = {
  result: null,
  error: null,
};

function SubmitButton() {
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

export default function UploadForm() {
  const [formState, formAction] = useFormState(identifyMaterialAction, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataUriInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        if (dataUriInputRef.current) {
          dataUriInputRef.current.value = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFormAction = (formData: FormData) => {
    startTransition(() => {
        formAction(formData);
    });
  }

  return (
    <Card className="shadow-lg">
      <form action={handleFormAction}>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="e.g., 'An old blue denim jacket, size L'"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <SubmitButton />
          {formState.error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          )}

          {formState.result && (
            <Alert variant="default" className="w-full bg-primary/10 border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertTitle className="font-headline text-lg text-primary">Material Identified!</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>
                  We believe your item is made of: <Badge className="text-base ml-2">{formState.result.material}</Badge>
                </p>
                <div className="space-y-2">
                    <Label>How do you want to list this item?</Label>
                    <RadioGroup defaultValue="free" className="flex flex-col sm:flex-row gap-4 pt-2">
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
                <Button className="w-full mt-4">Complete Listing</Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </form>
    </Card>
  );
}
