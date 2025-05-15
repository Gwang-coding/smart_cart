// app/main/[id]/shoppingcart/client-page.tsx
'use client';

import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import ShoppingCart from '@/container/ShoppingCart';
export default function ShoppingCartPageClient({ cartId }: { cartId: string }) {
    return (
        <AuthenticatedLayout cartId={cartId}>
            <ShoppingCart />
        </AuthenticatedLayout>
    );
}
