'use server';

/**
 * @fileOverview An AI agent that optimizes existing metadata for SEO and provides a rating.
 *
 * - optimizeAndRateMetadata - A function that optimizes and rates the given metadata.
 */

import {ai} from '@/ai/genkit';
import {
  OptimizeMetadataInputSchema,
  type OptimizeMetadataInput,
  OptimizeAndRateMetadataOutputSchema,
  type OptimizeAndRateMetadataOutput,
} from '@/ai/schemas';

export async function optimizeAndRateMetadata(
  input: OptimizeMetadataInput
): Promise<OptimizeAndRateMetadataOutput> {
  return optimizeAndRateMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeAndRateMetadataPrompt',
  input: {schema: OptimizeMetadataInputSchema},
  output: {schema: OptimizeAndRateMetadataOutputSchema},
  prompt: `You are an SEO expert. 
  1. Optimize the following metadata for improved search engine rankings.
  2. Then, analyze the newly optimized metadata and provide an SEO score, a one-word rating, and concise, actionable feedback for improvement.

  Existing Metadata to Optimize:
  Title Tag: {{{titleTag}}}
  Meta Description: {{{metaDescription}}}
  Keywords: {{{keywords}}}
`,
});

const optimizeAndRateMetadataFlow = ai.defineFlow(
  {
    name: 'optimizeAndRateMetadataFlow',
    inputSchema: OptimizeMetadataInputSchema,
    outputSchema: OptimizeAndRateMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI failed to optimize and rate the metadata. Please try again.");
    }
    return output;
  }
);
