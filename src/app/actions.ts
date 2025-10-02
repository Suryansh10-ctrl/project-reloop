"use server";

import { identifyMaterial } from "@/ai/flows/material-identification";
import { suggestUpcyclingIdeas } from "@/ai/flows/upcycling-idea-generator";
import { z } from "zod";

const identifyMaterialSchema = z.object({
  photoDataUri: z.string(),
  description: z.string().optional(),
});

export async function identifyMaterialAction(prevState: any, formData: FormData) {
  try {
    const validatedFields = identifyMaterialSchema.safeParse({
      photoDataUri: formData.get("photoDataUri"),
      description: formData.get("description"),
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        error: "Invalid input.",
      };
    }

    const result = await identifyMaterial(validatedFields.data);

    return {
      ...prevState,
      result,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      ...prevState,
      error: "Failed to identify material. Please try again.",
    };
  }
}

export async function getUpcyclingIdeasAction(material: string) {
    try {
        if (!material) {
            return { ideas: [], error: 'Material description is required.' };
        }
        const result = await suggestUpcyclingIdeas({ materialDescription: material });
        return { ideas: result.upcyclingIdeas, error: null };
    } catch (error) {
        console.error(error);
        return { ideas: [], error: 'Failed to generate ideas. Please try again.' };
    }
}

const createListingSchema = z.object({
  material: z.string(),
  description: z.string().optional(),
  photoDataUri: z.string(),
  listingType: z.string(),
});

export async function createListingAction(prevState: any, formData: FormData) {
    const validatedFields = createListingSchema.safeParse({
        material: formData.get('material'),
        description: formData.get('description'),
        photoDataUri: formData.get('photoDataUri'),
        listingType: formData.get('listingType'),
    });

    if (!validatedFields.success) {
        return {
            ...prevState,
            error: "Invalid data for listing.",
            listingCreated: false,
        };
    }

    // Simulate a short delay to mimic database operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { ...prevState, error: null, listingCreated: true, material: validatedFields.data.material };
}
