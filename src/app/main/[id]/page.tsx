// app/main/[id]/page.tsx (서버 컴포넌트)
import MainCartPageClient from './client-page';

export default async function MainCartPage() {
    return <MainCartPageClient />;
}
