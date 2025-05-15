'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ShoppingCart from '@/container/ShoppingCart';
import { useCart } from '@/contexts/CartContext';

export default function MainCartPageClient() {
    const router = useRouter();
    const { cartId, sessionToken } = useCart();
    // Loading 상태 추가
    const [isLoading, setIsLoading] = useState(true);

    // 모든 Hooks는 조건문 이전에 호출해야 함
    useEffect(() => {
        // cartId가 없는 경우 처리
        if (!cartId) {
            setIsLoading(false);
            return;
        }

        const validateSession = async () => {
            try {
                if (!sessionToken) {
                    console.error('세션 토큰이 없습니다. QR 코드를 먼저 스캔해주세요.');
                    router.replace(`/cart/${cartId}`); // QR 코드 페이지로 리다이렉트
                    return;
                }
                console.log('세션토큰', sessionToken);
                console.log('cartid', cartId);

                // 백엔드에 세션 토큰 검증 요청
                const response = await fetch(`https://smartcartback-production.up.railway.app/carts/${cartId}/validate-session`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionToken }),
                });

                const data = await response.json();
                console.log(data);

                if (!data.valid) {
                    console.error('유효하지 않은 세션입니다. QR 코드를 먼저 스캔해주세요.');
                    router.replace(`/cart/${cartId}`); // QR 코드 페이지로 리다이렉트
                    return;
                }

                localStorage.setItem('sessionToken', sessionToken);
                localStorage.setItem('cartId', cartId);
                // 인증 성공
                setIsLoading(false);
            } catch (error) {
                console.error('세션 검증 오류:', error);
                router.replace(`/cart/${cartId}`); // QR 코드 페이지로 리다이렉트
            }
        };

        validateSession();
    }, [cartId, router, sessionToken]);

    // 조건부 렌더링은 return 문에서 처리
    if (!cartId) {
        return <div>카트 정보를 찾을 수 없습니다.</div>;
    }

    if (isLoading) {
        return <div>세션 검증 중...</div>;
    }

    return (
        <div className="h-full">
            <ShoppingCart />
        </div>
    );
}
