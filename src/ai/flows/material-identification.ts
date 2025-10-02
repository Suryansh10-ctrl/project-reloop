'use server';
/**
 * @fileOverview Identifies the material of an uploaded item using AI.
 *
 * - identifyMaterial - A function that identifies the material of an item.
 * - IdentifyMaterialInput - The input type for the identifyMaterial function.
 * - IdentifyMaterialOutput - The return type for the identifyMaterial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyMaterialInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z
    .string()
    .optional()
    .describe('The user provided description of the item.'),
});
export type IdentifyMaterialInput = z.infer<typeof IdentifyMaterialInputSchema>;

const IdentifyMaterialOutputSchema = z.object({
  material: z.string().describe('The identified material of the item.'),
  confidence: z
    .number()
    .optional()
    .describe('The confidence level of the material identification.'),
});
export type IdentifyMaterialOutput = z.infer<typeof IdentifyMaterialOutputSchema>;

export async function identifyMaterial(input: IdentifyMaterialInput): Promise<IdentifyMaterialOutput> {
  return identifyMaterialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyMaterialPrompt',
  input: {schema: IdentifyMaterialInputSchema},
  output: {schema: IdentifyMaterialOutputSchema},
  prompt: `You are an AI assistant that identifies the material of an item from a photo and a description.

  Analyze the following photo and description to determine the material of the item.

  Description: {{{description}}}
  Photo: {{media url=photoDataUri}}

  Material:`, // The output schema description is automatically added to the prompt.
});

const identifyMaterialFlow = ai.defineFlow(
  {
    name: 'identifyMaterialFlow',
    inputSchema: IdentifyMaterialInputSchema,
    outputSchema: IdentifyMaterialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
