import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppHeader } from '@/components/app/header';

export const metadata: Metadata = {
  "title": "SEO Bunny - Free AI Metadata Extractor & Enhancer | SEO Tool",
  "description": "Extract and enhance website metadata for free using our AI-powered tool. Simply enter a URL to copy or optimize SEO descriptions, titles, and keywords with artificial intelligence.",
  "keywords": [
    "metadata extractor",
    "AI metadata",
    "free SEO tool",
    "website metadata",
    "generate meta description",
    "optimize SEO",
    "copy website metadata",
    "meta tag generator",
    "SEO enhancement",
    "AI content optimization"
  ],
  "openGraph": {
    "title": "SEO Bunny - Free AI-Powered Metadata Extractor & SEO Enhancer",
    "description": "Instantly extract and enhance website metadata using AI. Our free online tool helps you optimize SEO titles, descriptions, and keywords from any URL.",
    "images": [
      {
        "url": "https://seobunny.vercel.app/og_image.png"
      }
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "SEO Bunny - AI Metadata Extractor | Free SEO Tool",
    "description": "Extract & enhance website metadata with AI for free. Boost your SEO instantly.",
    "images": [
      "https://seobunny.vercel.app/og_image.png"
    ]
  },
  "alternates": {
    "canonical": "https://seobunny.vercel.app"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AppHeader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
