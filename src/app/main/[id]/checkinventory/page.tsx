// app/main/[id]/checkinventory/page.tsx
import { Suspense } from 'react';
import CheckInventoryPageClient from './client-page';

export default async function CheckInventoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // ✅ ② 실제로는 여기서 await
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <CheckInventoryPageClient cartId={id} />
        </Suspense>
    );
}
