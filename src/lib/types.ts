import type { GenerateMetadataFromScratchOutput, RateSeoOutput } from "@/ai/schemas";

export interface AnalysisResult {
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
  ogType: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  canonical: string | null;
  robots: string | null;
  // Basic structured data as a string for display
  structuredData: string | null; 
  rating?: RateSeoOutput;
}

export interface AnalysisState {
  data?: AnalysisResult;
  error?: string;
}

export interface GenerateState {
  data?: {
    metadata: GenerateMetadataFromScratchOutput;
    rating: RateSeoOutput;
  };
  error?: string;
}
