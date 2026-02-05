'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Link, AlertCircle } from 'lucide-react';
import { analyzeUrl, optimizeMetadataAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MetadataDisplay } from './metadata-display';
import type { AnalysisState } from '@/lib/types';
import { ResultSkeleton } from './result-skeletons';
import type { OptimizeMetadataOutput } from '@/ai/flows/optimize-existing-metadata';
import { CardContent, CardFooter } from '../ui/card';

const initialState: AnalysisState = {};

export function Analyzer() {
  const [state, formAction] = useActionState(analyzeUrl, initialState);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setPending(false);
  }, [state]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    formAction(formData);
  };

  const handleOptimize = async (input: { title: string, description: string, keywords: string }): Promise<OptimizeMetadataOutput | undefined> => {
    try {
        const result = await optimizeMetadataAction({
            titleTag: input.title,
            metaDescription: input.description,
            keywords: input.keywords,
        });
        return result;
    } catch(e) {
        console.error("Optimization failed", e);
        // Optionally show a toast notification for failure
        return undefined;
    }
  }

  return (
    <div>
        <form ref={formRef} onSubmit={handleFormSubmit}>
            <CardContent className="p-6">
                <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        name="url"
                        placeholder="https://example.com"
                        className="pl-10 text-base"
                        required
                    />
                </div>
                {state?.error && (
                    <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 border-t">
                <Button type="submit" className="w-full" disabled={pending}>
                    {pending ? 'Analyzing...' : 'Analyze URL'}
                </Button>
            </CardFooter>
        </form>

      <div className="p-6">
        {pending && <ResultSkeleton />}
        {!pending && state.data && (
            <MetadataDisplay analysisResult={state.data} onOptimize={handleOptimize} />
        )}
      </div>
    </div>
  );
}
