'use server';

import { z } from 'zod';
import { parseMetadata } from '@/lib/metadata-utils';
import type { AnalysisState } from '@/lib/types';

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
