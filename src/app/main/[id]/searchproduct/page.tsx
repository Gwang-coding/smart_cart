// app/main/[id]/searchproduct/page.tsx
import SearchProductPageClient from './client-page';
export default async function SearchProductPage({ params }: { params: { id: string } }) {
    const unwrappedParams = await params;
    return (
        <div>
            <SearchProductPageClient cartId={unwrappedParams.id} />
        </div>
    );
}
