// app/main/[id]/shoppingcart/client-page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ShoppingCart from '@/container/ShoppingCart';
import { useSearchParams } from 'next/navigation';
export default function ShoppingCartPageClient({ cartId }: { cartId: string }) {
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
    }, [cartId, router]);

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

    return (
        <div className="h-full">
            <ShoppingCart sessionToken={localStorage.getItem('sessionToken')} />
        </div>
    );
}
