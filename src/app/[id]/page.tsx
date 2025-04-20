// src/app/[id]/page.tsx

export const dynamic = 'force-dynamic'; // 추가

import PageClient from './PageClient';

interface CartPageProps {
    params: {
        id: string;
    };
    searchParams: {
        token?: string;
    };
}

export default function Page({ params, searchParams }: CartPageProps) {
    const cartId = parseInt(params.id);
    const token = searchParams.token ?? '';

    return <PageClient cartId={cartId} token={token} />;
}
