// app/main/[id]/qr/page.tsx
import { Suspense } from 'react';
import QRPageClient from './client-page';

export default async function ShoppingCartPage({ params }: { params: { id: string } }) {
    const unwrappedParams = await params;
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <QRPageClient cartId={unwrappedParams.id} />
        </Suspense>
    );
}
