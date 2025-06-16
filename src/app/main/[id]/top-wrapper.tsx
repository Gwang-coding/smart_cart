'use client';

import { useSearchParams } from 'next/navigation';
import Top from '@/components/Top';
import { useCart } from '@/contexts/CartContext';

export default function TopWrapper() {
    const searchParams = useSearchParams();
    const menuText = searchParams?.get('menu') || '장바구니';
    const { cartId } = useCart();

    // 조건부 렌더링은 Hooks 호출 이후에 처리
    if (!cartId) {
        return <div>카트 정보를 찾을 수 없습니다.</div>;
    }

    return <Top text={menuText} cartid={cartId} />;
}
