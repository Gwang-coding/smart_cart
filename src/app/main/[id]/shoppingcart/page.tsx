// app/main/[id]/shoppingcart/page.tsx
import { Suspense } from 'react';
import ShoppingCartPageClient from './client-page';

export default async function ShoppingCartPage({ params }: { params: { id: string } }) {
    const unwrappedParams = await params;
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <ShoppingCartPageClient cartId={unwrappedParams.id} />
        </Suspense>
    );
}
