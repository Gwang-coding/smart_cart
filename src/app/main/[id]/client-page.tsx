// app/main/[id]/client-page.tsx (클라이언트 컴포넌트)
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ShoppingCart from '@/container/ShoppingCart';

export default function MainCartPageClient({ cartId }: { cartId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionToken = searchParams?.get('session');

    // 세션 토큰 검증
    useEffect(() => {
        const validateSession = async () => {
            try {
                if (!sessionToken) {
                    console.error('세션 토큰이 없습니다. QR 코드를 먼저 스캔해주세요.');
                    router.replace(`/${cartId}`); // QR 코드 페이지로 리다이렉트
                    return;
                }

                // 백엔드에 세션 토큰 검증 요청
                const response = await fetch(`https://smartcartback-production.up.railway.app/carts/${cartId}/validate-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionToken }),
                });

                const data = await response.json();

                if (!data.valid) {
                    console.error('유효하지 않은 세션입니다. QR 코드를 먼저 스캔해주세요.');
                    router.replace(`/${cartId}`); // QR 코드 페이지로 리다이렉트
                    return;
                }
                localStorage.setItem('sessionToken', sessionToken);
                localStorage.setItem('cartId', cartId);
                // 인증 성공

                // 카트 정보 로드
                // loadCart();
            } catch (error) {
                console.error('세션 검증 오류:', error);
                router.replace(`/${cartId}`); // QR 코드 페이지로 리다이렉트
            }
        };

        validateSession();
    }, [cartId, router, sessionToken]);

    return (
        <div className="h-full">
            <ShoppingCart />
        </div>
    );
}
