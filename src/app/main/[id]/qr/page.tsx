// app/main/[id]/qr/page.tsx
import { Suspense } from 'react';
import QRPageClient from './client-page';

export default async function ShoppingCartPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // ✅ ② 실제로는 여기서 await
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <QRPageClient cartId={id} />
        </Suspense>
    );
}
