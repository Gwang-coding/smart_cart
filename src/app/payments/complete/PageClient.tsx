// app/payments/complete/page.tsx
'use client';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
export const dynamic = 'force-dynamic';

interface PaymentData {
    orderId: string;
    orderName: string;
    card: {
        number: string;
        amount: number;
    };
}

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const orderId = searchParams?.get('orderId');
    const { cartId } = useCart();

    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchPaymentData() {
            if (!orderId) {
                setIsLoading(false);
                return;
            }

            try {
                const secretkey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY;
                const basicToken = Buffer.from(`${secretkey}:`, 'utf-8').toString('base64');

                const response = await fetch(`https://api.tosspayments.com/v1/payments/orders/${orderId}`, {
                    headers: {
                        Authorization: `Basic ${basicToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPaymentData(data);
                }
            } catch (error) {
                console.error('결제 정보를 불러오는 중 오류가 발생했습니다:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPaymentData();

        // 결제 완료 시 장바구니 비우기
        localStorage.removeItem('shoppingCart');
    }, [orderId]);

    if (isLoading) {
        return <div className="max-w-md mx-auto mt-10 p-6 text-center">로딩 중...</div>;
    }

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

            {paymentData && (
                <div className="border-t border-b py-4 mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">구매한 물품</span>
                        <span className="font-medium">{paymentData.orderName}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">카드번호</span>
                        <span className="font-medium">{paymentData.card.number}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">주문번호</span>
                        <span className="font-medium">{paymentData.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">결제금액</span>
                        <span className="font-medium">{paymentData.card.amount}원</span>
                    </div>
                </div>
            )}
            <Link
                href={`/main/${cartId}`}
                className="block w-full text-center py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={() => {
                    // 링크 클릭 시 한 번 더 장바구니 비우기 (이중 안전장치)
                    localStorage.removeItem('shoppingCart');
                }}
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}
