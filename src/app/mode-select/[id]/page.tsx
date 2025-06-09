export const dynamic = 'force-dynamic';

import ScanModeSelector from '@/components/ScanModeSelector';

export default async function ModeSelectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div>
            <ScanModeSelector cartId={id} />
        </div>
    );
}
