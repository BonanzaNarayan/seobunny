import type { AnalysisResult } from '@/lib/types';
import type { OptimizeMetadataOutput } from '@/ai/schemas';

// Basic regex parsers - not robust for production but sufficient for this demo.
const extract = (html: string, regex: RegExp): string | null => {
  const match = html.match(regex);
  return match ? match[1].trim() : null;
};

export function parseMetadata(html: string): AnalysisResult {
  return {
    title: extract(html, /<title>(.*?)<\/title>/is),
    description: extract(html, /<meta\s+name=["']description["']\s+content=["'](.*?)["']/is),
    keywords: extract(html, /<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/is),
    canonical: extract(html, /<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/is),
    robots: extract(html, /<meta\s+name=["']robots["']\s+content=["'](.*?)["']/is),
    
    ogTitle: extract(html, /<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/is),
    ogDescription: extract(html, /<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/is),
    ogImage: extract(html, /<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/is),
    ogUrl: extract(html, /<meta\s+property=["']og:url["']\s+content=["'](.*?)["']/is),
    ogType: extract(html, /<meta\s+property=["']og:type["']\s+content=["'](.*?)["']/is),

    twitterCard: extract(html, /<meta\s+name=["']twitter:card["']\s+content=["'](.*?)["']/is),
    twitterTitle: extract(html, /<meta\s+name=["']twitter:title["']\s+content=["'](.*?)["']/is),
    twitterDescription: extract(html, /<meta\s+name=["']twitter:description["']\s+content=["'](.*?)["']/is),
    twitterImage: extract(html, /<meta\s+name=["']twitter:image["']\s+content=["'](.*?)["']/is),
    
    structuredData: extract(html, /<script\s+type=["']application\/ld\+json["']>(.*?)<\/script>/is),
  };
}

function generateCombinedMetadata(
  original: AnalysisResult,
  optimized?: OptimizeMetadataOutput
): AnalysisResult {
  if (!optimized) return original;
  
  return {
    ...original,
    title: optimized.optimizedTitleTag || original.title,
    description: optimized.optimizedMetaDescription || original.description,
    keywords: optimized.optimizedKeywords || original.keywords,
    // Carry over OG/Twitter, but update with optimized values if they were missing initially
    ogTitle: original.ogTitle || optimized.optimizedTitleTag,
    ogDescription: original.ogDescription || optimized.optimizedMetaDescription,
    twitterTitle: original.twitterTitle || optimized.optimizedTitleTag,
    twitterDescription: original.twitterDescription || optimized.optimizedMetaDescription,
  };
}


function generateTag(key: string, value: string | null, isProperty = false) {
  if (!value) return null;
  const attr = isProperty ? 'property' : 'name';
  return `<meta ${attr}="${key}" content="${value}">`;
}

function generateLink(rel: string, href: string | null) {
  if (!href) return null;
  return `<link rel="${rel}" href="${href}">`;
}

export function formatAsHtml(original: AnalysisResult, optimized?: OptimizeMetadataOutput): string {
  const data = generateCombinedMetadata(original, optimized);
  
  const tags = [
    data.title ? `<title>${data.title}</title>` : null,
    generateTag('description', data.description),
    generateTag('keywords', data.keywords),
    generateLink('canonical', data.canonical),
    generateTag('robots', data.robots),
    
    generateTag('og:title', data.ogTitle, true),
    generateTag('og:description', data.ogDescription, true),
    generateTag('og:image', data.ogImage, true),
    generateTag('og:url', data.ogUrl, true),
    generateTag('og:type', data.ogType, true),

    generateTag('twitter:card', data.twitterCard),
    generateTag('twitter:title', data.twitterTitle),
    generateTag('twitter:description', data.twitterDescription),
    generateTag('twitter:image', data.twitterImage),

    data.structuredData ? `<script type="application/ld+json">\n${JSON.stringify(JSON.parse(data.structuredData), null, 2)}\n</script>` : null
  ].filter(Boolean);

  return tags.join('\n');
}

export function formatAsNextJs(original: AnalysisResult, optimized?: OptimizeMetadataOutput): string {
  const data = generateCombinedMetadata(original, optimized);

  const metadataObject = {
    title: data.title,
    description: data.description,
    keywords: data.keywords?.split(',').map(k => k.trim()),
    robots: data.robots,
    openGraph: {
      title: data.ogTitle,
      description: data.ogDescription,
      url: data.ogUrl,
      images: data.ogImage ? [{ url: data.ogImage }] : undefined,
      type: data.ogType,
    },
    twitter: {
      card: data.twitterCard,
      title: data.twitterTitle,
      description: data.twitterDescription,
      images: data.twitterImage ? [data.twitterImage] : undefined,
    },
    alternates: {
      canonical: data.canonical,
    },
  };

  const jsonString = JSON.stringify(metadataObject, (key, value) => {
    // Remove undefined values for cleaner output
    if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
      return undefined;
    }
    // Remove empty objects
    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return undefined;
    }
    return value;
  }, 2);
  
  return `import type { Metadata } from 'next';\n\nexport const metadata: Metadata = ${jsonString};`;
}
