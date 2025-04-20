'use client';

import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import Top from '@/components/Top';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default function Layout({ children, params }: LayoutProps) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    const searchParams = useSearchParams();
    const menuText = searchParams?.get('menu') || '장바구니'; // 기본값은 '장바구니'

    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full">
                <Top text={menuText} cartid={id} />
                {children}
            </div>
        </div>
    );
}
