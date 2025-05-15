// src/app/cart/[id]/page.tsx
export const dynamic = 'force-dynamic'; // SSR 사용

import QRPageClient from './client-page';

export default async function QRPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // ✅ ② 실제로는 여기서 await

    return (
        <div>
            <div className="relative flex items-center justify-center p-3 border-solid border-black border-b-2 mb-10">
                <div className="p-2 text-center flex">
                    <p className="text-xl font-bold">{id}번 카트</p>
                </div>
            </div>
            <QRPageClient cartId={id} />
        </div>
    );
}
