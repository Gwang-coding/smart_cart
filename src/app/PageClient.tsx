'use client';

import Top from '@/components/Top';
import ShoppingCart from '@/container/ShoppingCart';
import { useParams, useSearchParams } from 'next/navigation';

export default function PageClient() {
    const params = useParams();
    const searchParams = useSearchParams();

    const cartId = params?.id as string;
    const sessionToken = searchParams?.get('token') ?? '';

    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full">
                <Top cartid={cartId} sessionToken={sessionToken} />
                <ShoppingCart />
            </div>
        </div>
    );
}
