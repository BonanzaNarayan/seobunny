import { Builder } from "@/components/app/builder";
import { Card } from "@/components/ui/card";

export default function BuildPage() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Build Metadata from Scratch
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Describe your website or page, and let our AI generate a full set of SEO-optimized metadata for you.
        </p>
      </div>
      <Card className="max-w-4xl mx-auto shadow-lg">
        <Builder />
      </Card>
    </main>
  );
}
