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

  const validatedUrl = UrlSchema.safeParse(url);
  if (!validatedUrl.success) {
    return { error: validatedUrl.error.errors[0].message };
  }

  let fullUrl = validatedUrl.data;
  if (!fullUrl.startsWith('http')) {
    fullUrl = `https://${fullUrl}`;
  }

  try {
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
    if (e instanceof Error && e.message.includes('invalid URL')) {
        return { error: 'Invalid URL format. Please check and try again.' };
    }
    return { error: 'Could not connect to the URL. Please check the address and your connection.' };
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

  if (!websiteDescription || typeof websiteDescription !== 'string' || websiteDescription.trim().length < 10) {
    return { error: 'Please provide a more detailed description (at least 10 characters).' };
  }
  
  const input: GenerateMetadataFromScratchInput = { websiteDescription };

  try {
    const metadata = await generateMetadataFromScratch(input);
    const rating = await rateSeo({
      title: metadata.titleTag,
      description: metadata.metaDescription,
      keywords: metadata.keywords,
    });
    return { data: { metadata, rating } };
  } catch(e) {
    console.error(e);
    return { error: 'Failed to generate metadata. Please try again.' };
  }
}
