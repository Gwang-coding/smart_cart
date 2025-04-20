'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ShoppingCart from '@/container/ShoppingCart';

interface CartPageProps {
    params: {
        id: string;
    };
    searchParams: {
        token: string;
    };
}

export default function Page({ params, searchParams }: CartPageProps) {
    const router = useRouter();
    const cartId = parseInt(params.id);
    const token = searchParams.token;
    const [isValidated, setIsValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 토큰이 없으면 즉시 리다이렉트
        if (!token) {
            router.push('/unauthorized');
            return;
        }

        // Nest.js API로 토큰 유효성 검증
        async function validateToken() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}/validate?token=${token}`);
                const data = await response.json();

                if (data.isValid) {
                    setIsValidated(true);
                } else {
                    router.push('/unauthorized');
                }
            } catch (error) {
                console.error('토큰 검증 오류:', error);
                router.push('/error');
            } finally {
                setIsLoading(false);
            }
        }

        validateToken();
    }, [cartId, token, router]);

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!isValidated) {
        return null; // 리다이렉트 처리 중이므로 아무것도 렌더링하지 않음
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full">
                <ShoppingCart cartId={cartId} token={token} />
            </div>
        </div>
    );
}
