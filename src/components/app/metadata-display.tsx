'use client';

import { FileJson } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyButton } from './copy-button';
import { formatAsHtml, formatAsNextJs } from '@/lib/metadata-utils';
import { TooltipProvider } from '@/components/ui/tooltip';

interface MetadataDisplayProps {
  analysisResult: AnalysisResult;
}

export function MetadataDisplay({ analysisResult }: MetadataDisplayProps) {
  const handleExportJson = () => {
    const html = formatAsHtml(analysisResult);
    const nextjs = formatAsNextJs(analysisResult);
    const data = {
        html,
        nextjs,
        original: analysisResult,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadata.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const originalHtmlCode = formatAsHtml(analysisResult);
  const originalNextJsCode = formatAsNextJs(analysisResult);

  const renderMetadataList = (data: Record<string, any>) => (
    <ul className="space-y-3 text-sm">
      {Object.entries(data).map(([key, value]) => (value && typeof value !== 'object') && (
        <li key={key} className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <span className="font-semibold text-muted-foreground capitalize w-40 shrink-0">{key.replace(/([A-Z])/g, ' $1')}</span>
          <span className="text-foreground break-all">{value}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <TooltipProvider>
        <div className="space-y-6">
        <Card>
            <CardHeader>
            <CardTitle>Analyzed Metadata</CardTitle>
            <CardDescription>This is the metadata scraped from the URL.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="list">
                    <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="list">List</TabsTrigger>
                        <TabsTrigger value="nextjs">Next.js</TabsTrigger>
                        <TabsTrigger value="html">HTML</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleExportJson}>
                            <FileJson className="mr-2 h-4 w-4" /> Export JSON
                        </Button>
                    </div>
                    </div>
                    <TabsContent value="list">
                        {renderMetadataList(analysisResult)}
                    </TabsContent>
                    <TabsContent value="nextjs">
                        <div className="relative rounded-md bg-muted/20 p-4 font-code text-sm">
                            <CopyButton textToCopy={originalNextJsCode} className="absolute top-2 right-2" />
                            <pre className="whitespace-pre-wrap break-all"><code>{originalNextJsCode}</code></pre>
                        </div>
                    </TabsContent>
                    <TabsContent value="html">
                        <div className="relative rounded-md bg-muted/20 p-4 font-code text-sm">
                            <CopyButton textToCopy={originalHtmlCode} className="absolute top-2 right-2" />
                            <pre className="whitespace-pre-wrap break-all"><code>{originalHtmlCode}</code></pre>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
        </div>
    </TooltipProvider>
  );
}
