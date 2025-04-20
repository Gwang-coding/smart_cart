import { Suspense } from 'react';
import PaymentSuccess from './PageClient';

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <PaymentSuccess />
        </Suspense>
    );
}
