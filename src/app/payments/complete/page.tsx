// app/success/page.tsx
'use client';
import Link from 'next/link';
interface SearchParams {
    orderId?: string;
}

export default async function PaymentSuccess({ searchParams }: { searchParams: SearchParams }) {
    const secretkey = process.env.TOSS_SECRET_KEY;
    const basicToken = Buffer.from(`${secretkey}:`, `utf-8`).toString('base64');

    const payments = await fetch(`https://api.tosspayments.com/v1/payments/orders/${searchParams.orderId}`, {
        headers: {
            Authorization: `Basic ${basicToken}`,
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json());
    const { card } = payments;
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <div className="bg-green-100 text-green-500 rounded-full p-3 inline-block mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">결제가 완료되었습니다</h1>
                <p className="text-gray-600 mb-6">주문이 성공적으로 처리되었습니다.</p>
            </div>

            <div className="border-t border-b py-4 mb-6">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-600">구매한 물품</span>
                    <span className="font-medium">{payments.orderName}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-gray-600">카드번호</span>
                    <span className="font-medium">{card.number}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="text-gray-600">주문번호</span>
                    <span className="font-medium">{payments.orderId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">결제금액</span>
                    <span className="font-medium">{card.amount}원</span>
                </div>
            </div>

            <Link
                href="/"
                className="block w-full text-center py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}
