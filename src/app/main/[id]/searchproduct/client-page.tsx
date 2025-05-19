// app/main/[id]/searchproduct/client-page.tsx

'use client';

import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import SearchProduct from '@/container/SearchProduct';
export default function SearchProductPageClient({ cartId }: { cartId: string }) {
    return (
        <AuthenticatedLayout cartId={cartId}>
            <SearchProduct />
        </AuthenticatedLayout>
    );
}
