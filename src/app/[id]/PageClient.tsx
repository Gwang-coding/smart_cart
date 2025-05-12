'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ShoppingCart from '@/container/ShoppingCart';

interface PageClientProps {
    cartId: number;
    token: string;
}

function PageClient({ cartId, token }: PageClientProps) {
    const router = useRouter();
    const [isValidated, setIsValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            router.push('/unauthorized');
            return;
        }

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
        return null;
    }

    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full">
                <ShoppingCart cartId={cartId} token={token} />
            </div>
        </div>
    );
}
export default PageClient;
