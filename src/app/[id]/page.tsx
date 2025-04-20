// src/app/[id]/page.tsx
export const dynamic = 'force-dynamic';

import PageClient from './PageClient';

export default function Page({ params, searchParams }: { params: { id: string }; searchParams: { token?: string } }) {
    const cartId = parseInt(params.id);
    const token = searchParams?.token ?? '';

    return <PageClient cartId={cartId} token={token} />;
}
