// components/AuthenticatedLayout.tsx
'use client';

import { ReactNode } from 'react';
import { useCartAuth } from '@/hooks/useCartAuth';

interface AuthenticatedLayoutProps {
    cartId: string;
    children: ReactNode;
}

export default function AuthenticatedLayout({ cartId, children }: AuthenticatedLayoutProps) {
    const { isAuthorized, isLoading } = useCartAuth(cartId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-3">로딩 중...</p>
            </div>
        );
    }

    if (!isAuthorized) {
        return <div>인증되지 않은 접근입니다.</div>;
    }

    return <div className="h-full">{children}</div>;
}
