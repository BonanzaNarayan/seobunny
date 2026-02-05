'use server';

/**
 * @fileOverview An AI agent that generates SEO metadata from scratch based on a website description.
 * - generateMetadataFromScratch - A function that generates metadata.
 * - GenerateMetadataFromScratchInput - The input type.
 * - GenerateMetadataFromScratchOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMetadataFromScratchInputSchema = z.object({
  websiteDescription: z
    .string()
    .describe('A description of the website to generate metadata for.'),
});
export type GenerateMetadataFromScratchInput = z.infer<
  typeof GenerateMetadataFromScratchInputSchema
>;

const GenerateMetadataFromScratchOutputSchema = z.object({
  titleTag: z.string().describe('The generated title tag.'),
  metaDescription: z.string().describe('The generated meta description.'),
  keywords: z.string().describe('A comma-separated list of relevant keywords.'),
  ogTitle: z.string().describe('The generated Open Graph title.'),
  ogDescription: z.string().describe('The generated Open Graph description.'),
  twitterTitle: z.string().describe('The generated Twitter title.'),
  twitterDescription: z.string().describe('The generated Twitter description.'),
});
export type GenerateMetadataFromScratchOutput = z.infer<
  typeof GenerateMetadataFromScratchOutputSchema
>;

export async function generateMetadataFromScratch(
  input: GenerateMetadataFromScratchInput
): Promise<GenerateMetadataFromScratchOutput> {
  return generateMetadataFromScratchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMetadataFromScratchPrompt',
  input: {schema: GenerateMetadataFromScratchInputSchema},
  output: {schema: GenerateMetadataFromScratchOutputSchema},
  prompt: `You are an SEO expert. Based on the following website description, please generate the following metadata:
  - A compelling title tag.
  - A concise and engaging meta description.
  - A comma-separated list of relevant keywords.
  - An Open Graph title (should be similar to the title tag).
  - An Open Graph description (should be similar to the meta description).
  - A Twitter title (should be similar to the title tag).
  - A Twitter description (should be similar to the meta description).

  Website Description: {{{websiteDescription}}}
  `,
});

const generateMetadataFromScratchFlow = ai.defineFlow(
  {
    name: 'generateMetadataFromScratchFlow',
    inputSchema: GenerateMetadataFromScratchInputSchema,
    outputSchema: GenerateMetadataFromScratchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
