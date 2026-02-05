'use server';

/**
 * @fileOverview An AI agent that optimizes existing metadata for SEO performance.
 *
 * - optimizeMetadata - A function that optimizes the given metadata.
 */

import {ai} from '@/ai/genkit';
import {
  OptimizeMetadataInputSchema,
  type OptimizeMetadataInput,
  OptimizeMetadataOutputSchema,
  type OptimizeMetadataOutput,
} from '@/ai/schemas';

export async function optimizeMetadata(
  input: OptimizeMetadataInput
): Promise<OptimizeMetadataOutput> {
  return optimizeMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeMetadataPrompt',
  input: {schema: OptimizeMetadataInputSchema},
  output: {schema: OptimizeMetadataOutputSchema},
  prompt: `You are an SEO expert tasked with optimizing existing metadata for improved search engine rankings.

  Please rewrite the following metadata to be more clear, compelling, and keyword-rich.

  Title Tag: {{{titleTag}}}
  Meta Description: {{{metaDescription}}}
  Keywords: {{{keywords}}}
`,
});

const optimizeMetadataFlow = ai.defineFlow(
  {
    name: 'optimizeMetadataFlow',
    inputSchema: OptimizeMetadataInputSchema,
    outputSchema: OptimizeMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI failed to generate optimized metadata. Please try again.");
    }
    return output;
  }
);
