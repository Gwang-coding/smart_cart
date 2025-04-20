'use client';

import { useParams, useSearchParams } from 'next/navigation';
import PageClient from './PageClient';

export const dynamic = 'force-dynamic';

export default function Page() {
    const params = useParams(); // useParams로 동적 라우트 파라미터 접근
    const searchParams = useSearchParams(); // 쿼리 파라미터 접근

    // params.id가 배열일 경우 첫 번째 값만 사용하고, 없으면 '0'을 사용하여 parseInt
    const cartId = parseInt(Array.isArray(params?.id) ? params.id[0] : params?.id ?? '0');
    const token = searchParams?.get('token') ?? '';

    return <PageClient cartId={cartId} token={token} />;
}
