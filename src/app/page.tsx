import Top from '@/components/Top';
import ShoppingCart from '@/container/ShoppingCart';
import { useSearchParams } from 'next/navigation';

interface CartPageProps {
    params: {
        id: string;
    };
}

export default function Home({ params }: CartPageProps) {
    const cartId = parseInt(params.id);
    const searchParams = useSearchParams(); // Next.js 훅
    const token = searchParams?.get('token') ?? ''; // get으로 불러와야 함

    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full">
                <Top />
                <ShoppingCart cartId={cartId} token={token} />
            </div>
        </div>
    );
}
