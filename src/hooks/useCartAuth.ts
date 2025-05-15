// hooks/useCartAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

export function useCartAuth(cartId: string) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { sessionToken, setCartId, setSessionToken } = useCart();

    useEffect(() => {
        // Context에 cartId 설정
        setCartId(cartId);

        // 로컬 스토리지에서 세션 토큰 확인
        const storedToken = localStorage.getItem('sessionToken');
        const storedCartId = localStorage.getItem('cartId');

        // Context에 없으면 로컬 스토리지에서 가져옴
        if (!sessionToken && storedToken) {
            setSessionToken(storedToken);
        }

        if (!storedToken || storedCartId !== cartId) {
            router.replace(`/main/${cartId}`);
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
                    router.replace(`/cart/${cartId}`);
                }
            } catch (error) {
                console.error('세션 검증 오류:', error);
                router.replace(`/${cartId}`);
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [cartId, router, sessionToken, setCartId, setSessionToken]);

    return { isAuthorized, isLoading };
}
