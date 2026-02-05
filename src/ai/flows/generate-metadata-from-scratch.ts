'use server';

/**
 * @fileOverview An AI agent that generates SEO metadata from scratch based on a website description.
 * - generateMetadataFromScratch - A function that generates metadata.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateMetadataFromScratchInputSchema,
  type GenerateMetadataFromScratchInput,
  GenerateMetadataFromScratchOutputSchema,
  type GenerateMetadataFromScratchOutput,
} from '@/ai/schemas';

export async function generateMetadataFromScratch(
  input: GenerateMetadataFromScratchInput
): Promise<GenerateMetadataFromScratchOutput> {
  return generateMetadataFromScratchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMetadataFromScratchPrompt',
  input: {schema: GenerateMetadataFromScratchInputSchema},
  output: {schema: GenerateMetadataFromScratchOutputSchema},
  prompt: `You are an SEO expert. Generate comprehensive SEO metadata based on the provided website description.

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
    if (!output) {
      throw new Error("The AI failed to generate metadata. Please try again.");
    }
    return output;
  }
);
