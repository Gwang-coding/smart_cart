// app/main/[id]/checkinventory/page.tsx
import { Suspense } from 'react';
import CheckInventoryPageClient from './client-page';

export default async function ShoppingCartPage({ params }: { params: { id: string } }) {
    const unwrappedParams = await params;
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <CheckInventoryPageClient cartId={unwrappedParams.id} />
        </Suspense>
    );
}
