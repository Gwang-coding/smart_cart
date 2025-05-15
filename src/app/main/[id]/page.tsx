// app/main/[id]/page.tsx (서버 컴포넌트)
import MainCartPageClient from './client-page';

export default async function MainCartPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // ✅ ② 실제로는 여기서 await

    return <MainCartPageClient cartId={id} />;
}
