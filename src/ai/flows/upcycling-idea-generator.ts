'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting upcycling ideas for specific materials.
 *
 * It includes:
 * - `suggestUpcyclingIdeas`: A function to generate upcycling ideas based on a material description.
 * - `SuggestUpcyclingIdeasInput`: The input type for the suggestUpcyclingIdeas function.
 * - `SuggestUpcyclingIdeasOutput`: The output type for the suggestUpcyclingIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUpcyclingIdeasInputSchema = z.object({
  materialDescription: z
    .string()
    .describe(
      'A description of the material for which upcycling ideas are needed.'
    ),
  customizationRequest: z.string().optional().describe('A user\'s specific request for customization.'),
});
export type SuggestUpcyclingIdeasInput = z.infer<
  typeof SuggestUpcyclingIdeasInputSchema
>;

const SuggestUpcyclingIdeasOutputSchema = z.object({
  upcyclingIdeas: z
    .array(z.string())
    .describe('A list of creative upcycling ideas for the material.'),
});
export type SuggestUpcyclingIdeasOutput = z.infer<
  typeof SuggestUpcyclingIdeasOutputSchema
>;

export async function suggestUpcyclingIdeas(
  input: SuggestUpcyclingIdeasInput
): Promise<SuggestUpcyclingIdeasOutput> {
  return suggestUpcyclingIdeasFlow(input);
}

const suggestUpcyclingIdeasPrompt = ai.definePrompt({
  name: 'suggestUpcyclingIdeasPrompt',
  input: {schema: SuggestUpcyclingIdeasInputSchema},
  output: {schema: SuggestUpcyclingIdeasOutputSchema},
  prompt: `You are a creative upcycling expert. Given a description of a waste material, and an optional user request, you will generate a list of creative upcycling ideas. Return at least three ideas.

Material Description: {{{materialDescription}}}
{{#if customizationRequest}}
User's Customization Request: {{{customizationRequest}}}
{{/if}}
`,
});

const suggestUpcyclingIdeasFlow = ai.defineFlow(
  {
    name: 'suggestUpcyclingIdeasFlow',
    inputSchema: SuggestUpcyclingIdeasInputSchema,
    outputSchema: SuggestUpcyclingIdeasOutputSchema,
  },
  async input => {
    const {output} = await suggestUpcyclingIdeasPrompt(input);
    return output!;
  }
);
