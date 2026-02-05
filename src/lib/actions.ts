'use server';

import { z } from 'zod';
import { optimizeMetadata, type OptimizeMetadataInput } from '@/ai/flows/optimize-existing-metadata';
import { parseMetadata } from '@/lib/metadata-utils';
import type { AnalysisState, AnalysisResult } from '@/lib/types';

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
): Promise<ReturnType<typeof optimizeMetadata>> {
  // Add validation here if needed
  return await optimizeMetadata(input);
}
