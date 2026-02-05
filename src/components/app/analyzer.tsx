'use client';

import { useActionState, useRef } from 'react';
import { Link, AlertCircle } from 'lucide-react';
import { analyzeUrl, optimizeMetadataAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MetadataDisplay } from './metadata-display';
import type { AnalysisState } from '@/lib/types';
import { ResultSkeleton } from './result-skeletons';
import type { OptimizeMetadataOutput, RateSeoOutput } from '@/ai/schemas';
import { CardContent, CardFooter } from '../ui/card';
import { useToast } from '@/hooks/use-toast';

const initialState: AnalysisState = {};

type OptimizationResult = {
  optimizedResult: OptimizeMetadataOutput;
  rating: RateSeoOutput;
};

export function Analyzer() {
  const [state, formAction, isPending] = useActionState(analyzeUrl, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleOptimize = async (input: { title: string, description: string, keywords: string }): Promise<OptimizationResult | undefined> => {
    try {
        const result = await optimizeMetadataAction({
            titleTag: input.title,
            metaDescription: input.description,
            keywords: input.keywords,
        });
        return result;
    } catch(e) {
        console.error("Optimization failed", e);
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during optimization.";
        toast({
            variant: "destructive",
            title: "Optimization Failed",
            description: errorMessage,
        });
        return undefined;
    }
  }

  return (
    <div>
        <form ref={formRef} action={formAction}>
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
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Analyzing...' : 'Analyze URL'}
                </Button>
            </CardFooter>
        </form>

      <div className="p-6">
        {isPending && <ResultSkeleton />}
        {!isPending && state.data && (
            <MetadataDisplay analysisResult={state.data} onOptimize={handleOptimize} />
        )}
      </div>
    </div>
  );
}
