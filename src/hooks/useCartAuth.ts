// hooks/useCartAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export function useCartAuth(cartId: string) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const sessionTokenFromUrl = searchParams?.get('session');

    useEffect(() => {
        // 로컬 스토리지에서 세션 토큰 확인
        const sessionToken = sessionTokenFromUrl || localStorage.getItem('sessionToken');
        const storedCartId = localStorage.getItem('cartId');

        if (!sessionToken || storedCartId !== cartId) {
            // 세션이 없거나 카트 ID가 일치하지 않으면 메인 페이지로 리다이렉트
            router.replace(`/main/${cartId}?session=${sessionToken || ''}`);
            return;
        }

        // 세션 토큰 유효성 검증
        const validateToken = async () => {
            try {
                const response = await fetch(`https://smartcartback-production.up.railway.app/carts/${cartId}/validate-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionToken }),
                });

                const data = await response.json();

                if (data.valid) {
                    setIsAuthorized(true);
                } else {
                    // 유효하지 않은 세션이면 메인 페이지로 리다이렉트
                    router.replace(`/${cartId}`);
                }
            } catch (error) {
                console.error('세션 검증 오류:', error);
                router.replace(`/${cartId}`);
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [cartId, router, sessionTokenFromUrl]);

    return { isAuthorized, isLoading };
}
