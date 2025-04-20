import { Suspense } from 'react';
import PageClient from './PageClient';

export default function Home() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <PageClient />
        </Suspense>
    );
}
