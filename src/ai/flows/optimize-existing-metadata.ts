'use server';

/**
 * @fileOverview An AI agent that optimizes existing metadata for SEO performance.
 *
 * - optimizeMetadata - A function that optimizes the given metadata.
 * - OptimizeMetadataInput - The input type for the optimizeMetadata function.
 * - OptimizeMetadataOutput - The return type for the optimizeMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeMetadataInputSchema = z.object({
  titleTag: z.string().describe('The existing title tag to optimize.'),
  metaDescription: z
    .string()
    .describe('The existing meta description to optimize.'),
  keywords: z.string().describe('The existing keywords to optimize.'),
});
export type OptimizeMetadataInput = z.infer<typeof OptimizeMetadataInputSchema>;

const OptimizeMetadataOutputSchema = z.object({
  optimizedTitleTag: z.string().describe('The optimized title tag.'),
  optimizedMetaDescription: z
    .string()
    .describe('The optimized meta description.'),
  optimizedKeywords: z.string().describe('The optimized keywords.'),
});
export type OptimizeMetadataOutput = z.infer<typeof OptimizeMetadataOutputSchema>;

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

  Provide the optimized metadata in the following format:
  {
    "optimizedTitleTag": "Optimized title tag",
    "optimizedMetaDescription": "Optimized meta description",
    "optimizedKeywords": "Optimized keywords"
  }`,
});

const optimizeMetadataFlow = ai.defineFlow(
  {
    name: 'optimizeMetadataFlow',
    inputSchema: OptimizeMetadataInputSchema,
    outputSchema: OptimizeMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
