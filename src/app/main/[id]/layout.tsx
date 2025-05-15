// app/main/[id]/layout.tsx
import TopWrapper from './top-wrapper';

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
    const unwrappedParams = await params;
    return (
        <div className="flex flex-col h-screen">
            <TopWrapper cartId={unwrappedParams.id} />
            <main className="flex-grow overflow-auto">{children}</main>
        </div>
    );
}
