// 'use client' 제거!
import Top from '@/components/Top';
import ShoppingCart from '@/container/ShoppingCart';

interface CartPageProps {
    params: { id: string };
    searchParams: { token?: string };
}

export default function Home({ params, searchParams }: CartPageProps) {
    const cartId = parseInt(params.id);
    const token = searchParams?.token ?? '';

    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full">
                <Top />
                <ShoppingCart cartId={cartId} token={token} />
            </div>
        </div>
    );
}
