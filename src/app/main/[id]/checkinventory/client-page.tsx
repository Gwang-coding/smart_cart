// app/main/[id]/checkinventory/client-page.tsx
'use client';

import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import CheckInventory from '@/container/CheckInventory';
export default function CheckInventoryPageClient({ cartId }: { cartId: string }) {
    return (
        <AuthenticatedLayout cartId={cartId}>
            <CheckInventory />
        </AuthenticatedLayout>
    );
}
