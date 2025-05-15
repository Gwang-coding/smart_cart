// app/main/[id]/top-wrapper.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Top from '@/components/Top';
import { useCart } from '@/contexts/CartContext';
export default function TopWrapper() {
    const searchParams = useSearchParams();
    const menuText = searchParams?.get('menu') || '장바구니';
    const { cartId, sessionToken } = useCart();
    if (!cartId) {
        return <div>카트 정보를 찾을 수 없습니다.</div>;
    }

    // 디버깅 로그
    useEffect(() => {
        console.log('Current session token:', sessionToken);
    }, [sessionToken]);

    return <Top text={menuText} cartid={cartId} />;
}
