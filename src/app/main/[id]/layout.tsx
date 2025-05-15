// app/main/[id]/layout.tsx
import TopWrapper from './top-wrapper';

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen">
            <TopWrapper />
            <main className="flex-grow overflow-auto">{children}</main>
        </div>
    );
}
