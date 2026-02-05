import { z } from 'zod';

export const GenerateMetadataFromScratchInputSchema = z.object({
  websiteDescription: z
    .string()
    .describe('A description of the website to generate metadata for.'),
});
export type GenerateMetadataFromScratchInput = z.infer<
  typeof GenerateMetadataFromScratchInputSchema
>;

export const GenerateMetadataFromScratchOutputSchema = z.object({
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

export const OptimizeMetadataInputSchema = z.object({
  titleTag: z.string().describe('The existing title tag to optimize.'),
  metaDescription: z
    .string()
    .describe('The existing meta description to optimize.'),
  keywords: z.string().describe('The existing keywords to optimize.'),
});
export type OptimizeMetadataInput = z.infer<typeof OptimizeMetadataInputSchema>;

export const OptimizeMetadataOutputSchema = z.object({
  optimizedTitleTag: z.string().describe('The optimized title tag.'),
  optimizedMetaDescription: z
    .string()
    .describe('The optimized meta description.'),
  optimizedKeywords: z.string().describe('The optimized keywords.'),
});
export type OptimizeMetadataOutput = z.infer<typeof OptimizeMetadataOutputSchema>;


export const RateSeoInputSchema = z.object({
  title: z.string().describe('The title tag of the webpage.'),
  description: z.string().describe('The meta description of the webpage.'),
  keywords: z.string().optional().describe('The keywords for the webpage.'),
});
export type RateSeoInput = z.infer<typeof RateSeoInputSchema>;

export const RateSeoOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('The SEO score from 0 to 100.'),
  rating: z
    .string()
    .describe('A one-word rating like "Excellent", "Good", "Average", "Poor".'),
  feedback: z.string().describe('Actionable feedback to improve the SEO score.'),
});
export type RateSeoOutput = z.infer<typeof RateSeoOutputSchema>;
