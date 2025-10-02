"use server";

import { identifyMaterial } from "@/ai/flows/material-identification";
import { suggestUpcyclingIdeas } from "@/ai/flows/upcycling-idea-generator";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
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

const signUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  userType: z.enum(['Giver', 'Maker', 'Buyer']),
});

export async function signUpAction(prevState: any, formData: FormData) {
  const validatedFields = signUpSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: "Invalid form data." };
  }
  
  const { email, password, firstName, lastName, userType } = validatedFields.data;
  const { auth, firestore } = getSdks(initializeFirebase().firebaseApp);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    await setDoc(doc(firestore, "users", user.uid), {
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

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function signInAction(prevState: any, formData: FormData) {
  const validatedFields = signInSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, error: "Invalid email or password." };
  }

  const { auth } = getSdks(initializeFirebase().firebaseApp);
  const { email, password } = validatedFields.data;
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    revalidatePath('/');
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signOutAction() {
    const { auth } = getSdks(initializeFirebase().firebaseApp);
    await signOut(auth);
    revalidatePath('/');
    redirect('/login');
}
