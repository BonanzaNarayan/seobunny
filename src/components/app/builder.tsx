'use client';

import { useActionState, useRef } from 'react';
import { Bot } from 'lucide-react';
import { generateMetadataFromScratchAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MetadataDisplay } from './metadata-display';
import type { GenerateState } from '@/lib/types';
import { ResultSkeleton } from './result-skeletons';
import type { AnalysisResult } from '@/lib/types';
import { CardContent, CardFooter } from '../ui/card';

const initialState: GenerateState = {};

export function Builder() {
  const [state, formAction, isPending] = useActionState(generateMetadataFromScratchAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const generatedDataAsAnalysisResult: AnalysisResult | null = state.data ? {
    title: state.data.titleTag,
    description: state.data.metaDescription,
    keywords: state.data.keywords,
    ogTitle: state.data.ogTitle,
    ogDescription: state.data.ogDescription,
    twitterTitle: state.data.twitterTitle,
    twitterDescription: state.data.twitterDescription,
    ogImage: null,
    ogUrl: null,
    ogType: null,
    twitterCard: 'summary_large_image',
    twitterImage: null,
    canonical: null,
    robots: null,
    structuredData: null,
  } : null;

  return (
    <div>
        <form ref={formRef} action={formAction}>
            <CardContent className="p-6">
                <div className="grid w-full gap-2">
                    <Textarea
                        name="description"
                        placeholder="e.g., An e-commerce store that sells hand-made pottery."
                        className="min-h-[120px] text-base"
                        required
                    />
                     <p className="text-sm text-muted-foreground">
                        Provide a clear description of your webpage. The more detail you give, the better the metadata will be.
                    </p>
                </div>
                {state?.error && (
                    <Alert variant="destructive" className="mt-4">
                    <Bot className="h-4 w-4" />
                    <AlertTitle>Generation Failed</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 border-t">
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Generating...' : 'Generate with AI'}
                </Button>
            </CardFooter>
        </form>

      <div className="p-6">
        {isPending && <ResultSkeleton />}
        {!isPending && generatedDataAsAnalysisResult && (
            <MetadataDisplay analysisResult={generatedDataAsAnalysisResult} />
        )}
      </div>
    </div>
  );
}
