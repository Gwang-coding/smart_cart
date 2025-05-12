// app/main/[id]/page.tsx (서버 컴포넌트)
import MainCartPageClient from './client-page';

export default async function MainCartPage({ params }: { params: { id: string } }) {
    const unwrappedParams = await params;

    return <MainCartPageClient cartId={unwrappedParams.id} />;
}
