// app/main/[id]/searchproduct/page.tsx
import SearchProductPageClient from './client-page';
export default async function SearchProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // ✅ ② 실제로는 여기서 await
    return (
        <div>
            <SearchProductPageClient cartId={id} />
        </div>
    );
}
