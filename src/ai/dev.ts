'use client';
import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-existing-metadata.ts';
import '@/ai/flows/generate-metadata-from-scratch.ts';
import '@/ai/flows/rate-seo-flow.ts';
