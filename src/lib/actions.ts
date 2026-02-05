'use server';

import { z } from 'zod';
import { rateSeo } from '@/ai/flows/rate-seo-flow';
import { parseMetadata } from '@/lib/metadata-utils';
import type { AnalysisState, GenerateState } from '@/lib/types';
import type { GenerateMetadataFromScratchInput, GenerateAndRateMetadataOutput, OptimizeMetadataInput, OptimizeAndRateMetadataOutput } from '@/ai/schemas';
import { generateAndRateMetadata } from '@/ai/flows/generate-and-rate-metadata';
import { optimizeAndRateMetadata } from '@/ai/flows/optimize-and-rate-metadata';

const UrlSchema = z.string().url({ message: 'Please enter a valid URL.' });

export async function analyzeUrl(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  const url = formData.get('url');

  try {
    if (!url || typeof url !== 'string') {
        return { error: 'Please enter a valid URL.' };
    }

    let fullUrl = url;
    if (!/^(https?:\/\/)/i.test(fullUrl)) {
      fullUrl = `https://${fullUrl}`;
    }

    const validatedUrl = UrlSchema.parse(fullUrl);
    
    const response = await fetch(validatedUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
    });

    if (!response.ok) {
      return { error: `Failed to fetch URL. Status: ${response.status}` };
    }

    const html = await response.text();
    const metadata = parseMetadata(html);

    if (metadata.title && metadata.description) {
      const rating = await rateSeo({
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords || '',
      });
      return { data: { ...metadata, rating } };
    }
    
    return { data: metadata };
  } catch (e) {
    console.error(e);
    if (e instanceof z.ZodError) {
        return { error: e.errors[0].message };
    }
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: 'An unexpected error occurred during analysis.' };
  }
}

export async function optimizeMetadataAction(
  input: OptimizeMetadataInput
) {
  try {
    const result: OptimizeAndRateMetadataOutput = await optimizeAndRateMetadata(input);
    
    const optimizedResult = {
      optimizedTitleTag: result.optimizedTitleTag,
      optimizedMetaDescription: result.optimizedMetaDescription,
      optimizedKeywords: result.optimizedKeywords,
    };

    const rating = {
      score: result.score,
      rating: result.rating,
      feedback: result.feedback,
    };
    
    return { optimizedResult, rating };
  } catch (e) {
    console.error("Optimization failed in action", e);
    if (e instanceof Error) {
        throw new Error(e.message);
    }
    throw new Error('An unexpected error occurred during optimization.');
  }
}


export async function generateMetadataFromScratchAction(
  prevState: GenerateState,
  formData: FormData
): Promise<GenerateState> {
  const websiteDescription = formData.get('description');

  try {
    if (!websiteDescription || typeof websiteDescription !== 'string' || websiteDescription.trim().length < 10) {
      throw new Error('Please provide a more detailed description (at least 10 characters).');
    }
    
    const input: GenerateMetadataFromScratchInput = { websiteDescription };

    const result: GenerateAndRateMetadataOutput = await generateAndRateMetadata(input);

    const metadata = {
        titleTag: result.titleTag,
        metaDescription: result.metaDescription,
        keywords: result.keywords,
        ogTitle: result.ogTitle,
        ogDescription: result.ogDescription,
        twitterTitle: result.twitterTitle,
        twitterDescription: result.twitterDescription,
    };
    const rating = {
        score: result.score,
        rating: result.rating,
        feedback: result.feedback,
    };

    return { data: { metadata, rating } };
  } catch(e) {
    console.error(e);
    if (e instanceof Error) {
        return { error: e.message };
    }
    return { error: 'Failed to generate metadata. Please try again.' };
  }
}
