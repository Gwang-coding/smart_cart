// app/[id]/page.tsx (서버 컴포넌트)
import QRPageClient from './client-page';

// 함수를 async로 변경
export default async function QRPage({ params }: { params: { id: string } }) {
    const unwrappedParams = await params;

    return (
        <div>
            <div className="relative flex itmes-center justify-center p-3 border-solid border-black border-b-2 mb-10">
                <div className="p-2 text-center flex ">
                    <p className="text-xl font-bold">{unwrappedParams.id}번 카트 </p>
                </div>
            </div>
            <QRPageClient cartId={unwrappedParams.id} />
        </div>
    );
}
