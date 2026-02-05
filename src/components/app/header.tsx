'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export function AppHeader() {
    const pathname = usePathname();
    return (
        <header className="container mx-auto px-4 py-4 flex justify-between items-center border-b mb-8">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-headline">
                MetaBoost
            </Link>
            <nav className="flex items-center gap-2">
                <Button variant={pathname === '/' ? 'secondary' : 'ghost'} asChild>
                    <Link href="/">Analyze</Link>
                </Button>
                <Button variant={pathname === '/build' ? 'secondary' : 'ghost'} asChild>
                    <Link href="/build">Build</Link>
                </Button>
            </nav>
        </header>
    )
}
