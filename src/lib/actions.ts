'use server';

import { z } from 'zod';
import { optimizeMetadata } from '@/ai/flows/optimize-existing-metadata';
import { generateMetadataFromScratch } from '@/ai/flows/generate-metadata-from-scratch';
import { rateSeo } from '@/ai/flows/rate-seo-flow';
import { parseMetadata } from '@/lib/metadata-utils';
import type { AnalysisState, GenerateState } from '@/lib/types';
import type { GenerateMetadataFromScratchInput, OptimizeMetadataInput } from '@/ai/schemas';

const UrlSchema = z.string().url({ message: 'Please enter a valid URL.' });

export async function analyzeUrl(
  prevState: AnalysisState,
  formData: FormData
): Promise<AnalysisState> {
  const url = formData.get('url');

  try {
    const validatedUrl = UrlSchema.parse(url);
    
    let fullUrl = validatedUrl;
    if (!fullUrl.startsWith('http')) {
      fullUrl = `https://${fullUrl}`;
    }

    const response = await fetch(fullUrl, {
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
  const optimizedResult = await optimizeMetadata(input);
  const rating = await rateSeo({
    title: optimizedResult.optimizedTitleTag,
    description: optimizedResult.optimizedMetaDescription,
    keywords: optimizedResult.optimizedKeywords,
  });
  return { optimizedResult, rating };
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

    const metadata = await generateMetadataFromScratch(input);
    const rating = await rateSeo({
      title: metadata.titleTag,
      description: metadata.metaDescription,
      keywords: metadata.keywords,
    });
    return { data: { metadata, rating } };
  } catch(e) {
    console.error(e);
    if (e instanceof Error) {
        return { error: e.message };
    }
    return { error: 'Failed to generate metadata. Please try again.' };
  }
}
