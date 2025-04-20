'use client';

import Top from '@/components/Top';
import ShoppingCart from '@/container/ShoppingCart';
import { useParams, useSearchParams } from 'next/navigation';

export default function Home() {
    const params = useParams();
    const searchParams = useSearchParams();

    const cartId = parseInt(params?.id as string);
    const token = searchParams?.get('token') ?? '';

    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full">
                <Top />
                <ShoppingCart cartId={cartId} token={token} />
            </div>
        </div>
    );
}
