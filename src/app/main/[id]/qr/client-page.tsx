// app/main/[id]/qr/client-page.tsx
'use client';

import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import QR from '@/container/QR';
export default function CheckInventoryPageClient({ cartId }: { cartId: string }) {
    return (
        <AuthenticatedLayout cartId={cartId}>
            <QR />
        </AuthenticatedLayout>
    );
}
