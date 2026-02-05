import { Analyzer } from "@/components/app/analyzer";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-headline">
          MetaBoost
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Elevate your SEO. Analyze any URL, then generate and optimize your website&apos;s metadata with the power of AI.
        </p>
      </div>
      <Card className="max-w-4xl mx-auto shadow-lg">
        <Analyzer />
      </Card>
    </main>
  );
}
