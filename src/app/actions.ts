"use server";

import { identifyMaterial } from "@/ai/flows/material-identification";
import { suggestUpcyclingIdeas } from "@/ai/flows/upcycling-idea-generator";
import { doc, setDoc } from "firebase/firestore";
import { getSdks, initializeFirebase } from "@/firebase";
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
      result: null,
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
    
    const listingData = {
        material: validatedFields.data.material,
        description: validatedFields.data.description,
        photoDataUri: validatedFields.data.photoDataUri,
        listingType: validatedFields.data.listingType,
    };
    
    return { ...prevState, error: null, listingCreated: true, material: validatedFields.data.material, listingData };
}

const createUserSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  userType: z.enum(['Giver', 'Maker', 'Buyer']),
});

export async function createUserAction(data: z.infer<typeof createUserSchema>) {
  const validatedFields = createUserSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid form data." };
  }
  
  const { userId, email, firstName, lastName, userType } = validatedFields.data;
  
  // HACK: This is still technically calling a client-side function from the server
  // but since it's just getting the initialized instance it works.
  // A better solution would involve a dedicated admin SDK setup for server actions.
  const { firestore } = getSdks(initializeFirebase().firebaseApp);

  try {
    await setDoc(doc(firestore, "users", userId), {
      email,
      firstName,
      lastName,
      userType,
      impactScore: 0,
    });
    
    revalidatePath('/');
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


export async function signOutAction() {
    // This is now just a placeholder. The actual sign-out happens on the client.
    // We can use this to revalidate paths if needed after client-side sign-out.
    revalidatePath('/');
    redirect('/login');
}
