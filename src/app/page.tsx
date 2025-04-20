'use client';

import Top from '@/components/Top';
import ShoppingCart from '@/container/ShoppingCart';
import { use } from 'react';
interface CartPageProps {
    params: {
        id: string;
    };
    searchParams: {
        token: string;
    };
}

export default function Home({ params, searchParams }: CartPageProps) {
    const cartId = parseInt(params.id);

    // searchParams를 React.use()로 언래핑
    const unwrappedParams = use(searchParams as any);
    const token = (use(searchParams as any) as { token: string }).token;

    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full">
                <Top />

                <ShoppingCart cartId={cartId} token={token} />
            </div>
        </div>
    );
}

// Helper function to get the title for the Top component
// function getComponentTitle(componentName: string): string {
//     switch (componentName) {
//         case 'ShoppingCart':
//             return '장바구니';
//         case 'CheckInventory':
//             return '재고확인';
//         case 'SearchProduct':
//             return '물품 위치찾기';
//         case 'QR':
//             return 'QR';
//         default:
//             return '장바구니';
//     }
// }
