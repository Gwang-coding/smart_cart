import { Suspense } from 'react';
import PageClientWrapper from './PageClientWrapper';

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <PageClientWrapper />
        </Suspense>
    );
}
