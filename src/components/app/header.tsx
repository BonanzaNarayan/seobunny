'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Rabbit } from "lucide-react"

export function AppHeader() {
    const pathname = usePathname();
    return (
        <header className="container mx-auto px-4 py-4 flex justify-between items-center border-b mb-8">
            <Link href="/" className="text-lg flex items-center gap-1.5 font-bold font-headline">
                <Rabbit className='text-primary h-8 w-8'/> SEO Bunny
            </Link>
            <nav className="flex items-center gap-2">
                <Button variant={pathname === '/' ? 'default' : 'secondary'} asChild>
                    <Link href="/">Analyze</Link>
                </Button>
            </nav>
        </header>
    )
}
