// app/main/[id]/top-wrapper.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Top from '@/components/Top';

export default function TopWrapper({ cartId }: { cartId: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const menuText = searchParams?.get('menu') || '장바구니';
    const sessionFromUrl = searchParams?.get('session');
    const [sessionToken, setSessionToken] = useState<string | null>(null);

    useEffect(() => {
        // 브라우저 환경에서만 실행
        if (typeof window !== 'undefined') {
            // URL의 세션 파라미터 우선 사용, 없으면 로컬 스토리지에서 가져오기
            const effectiveToken = sessionFromUrl || localStorage.getItem('sessionToken');

            // 세션 토큰이 있으면 저장
            if (sessionFromUrl) {
                console.log('Saving session token from URL:', sessionFromUrl);
                localStorage.setItem('sessionToken', sessionFromUrl);
                localStorage.setItem('cartId', cartId);
            }

            setSessionToken(effectiveToken);
        }
    }, [sessionFromUrl, cartId]);

    // 디버깅 로그
    useEffect(() => {
        console.log('Current session token:', sessionToken);
    }, [sessionToken]);

    return <Top text={menuText} cartid={cartId} sessionToken={sessionToken} currentPath={pathname} />;
}
