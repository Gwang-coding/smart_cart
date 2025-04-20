export const dynamic = 'force-dynamic';

import PageClient from './PageClient';

interface Props {
    params: { id: string };
    searchParams: { token?: string };
}

export default function Page({ params, searchParams }: Props) {
    const cartId = parseInt(params.id);
    const token = searchParams?.token ?? '';

    return <PageClient cartId={cartId} token={token} />;
}
