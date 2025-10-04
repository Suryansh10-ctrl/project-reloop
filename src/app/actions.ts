"use server";

import { identifyMaterial } from "@/ai/flows/material-identification";
import { suggestUpcyclingIdeas } from "@/ai/flows/upcycling-idea-generator";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


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
        result: null,
        error: "Invalid input. Please upload a photo.",
      };
    }
    
    if (!validatedFields.data.photoDataUri) {
        return {
            ...prevState,
            result: null,
            error: "Please upload a photo.",
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
      result: null,
      error: "Failed to identify material. Please try again.",
    };
  }
}

export async function getUpcyclingIdeasAction(material: string, customizationRequest?: string) {
    try {
        if (!material) {
            return { ideas: [], error: 'Material description is required.' };
        }
        const result = await suggestUpcyclingIdeas({ materialDescription: material, customizationRequest });
        return { ideas: result.upcyclingIdeas, error: null };
    } catch (error) {
        console.error(error);
        return { ideas: [], error: 'Failed to generate ideas. Please try again.' };
    }
}

const createListingSchema = z.object({
  listingType: z.string(),
});

export async function createListingAction(formData: FormData) {
    const validatedFields = createListingSchema.safeParse({
        listingType: formData.get('listingType'),
    });

    if (!validatedFields.success) {
        // This case should ideally be handled client-side
        // but as a fallback, we can redirect to a safe page.
        redirect('/give');
    }
    
    const { listingType } = validatedFields.data;
    
    // The redirect function works by throwing an error, so it should not be in a try/catch block
    // and it will stop the execution of this action.
    if (listingType === 'free') {
        redirect('/profile');
    } else if (listingType === 'sale') {
        redirect('/marketplace');
    } else { // 'customize' or other types
        redirect('/makers/feed');
    }
}

// This action is now a placeholder as user creation is handled on the client.
// It can be repurposed for other server-side user logic if needed.
export async function createUserAction(data: any) {
  // Server-side validation can still happen here if desired.
  console.log("User data received on server:", data);
  return { success: true, error: null };
}

export async function signOutAction() {
    // This is now just a placeholder. The actual sign-out happens on the client.
    revalidatePath('/');
    redirect('/login');
}
