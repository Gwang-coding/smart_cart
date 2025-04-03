// components/TossPaymentButton.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TossPaymentButtonProps {
    amount: number;
    orderName: string;
}

export default function TossPaymentButton({ amount, orderName }: TossPaymentButtonProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    // 결제 시작 함수
    const startPayment = async (): Promise<void> => {
        setLoading(true);

        try {
            // 실제로는 서버에 결제 정보를 전송하여 토스 결제를 초기화합니다
            // 여기서는 시뮬레이션을 위해 직접 처리합니다
            const paymentData = {
                amount: amount,
                orderId: `ORDER_${Date.now()}`,
                orderName: orderName,
                customerName: '홍길동',
                successUrl: `${window.location.origin}/success`,
                failUrl: `${window.location.origin}/fail`,
            };

            console.log('결제 요청 데이터:', paymentData);

            // 실제 API 요청 대신 결제 페이지로 바로 이동
            // 실제 구현에서는 서버에서 받은 응답의 URL로 이동합니다
            setTimeout(() => {
                router.push(`/payment-simulation?orderId=${paymentData.orderId}&amount=${amount}`);
            }, 500);
        } catch (error) {
            console.error('결제 시작 중 오류 발생:', error);
            alert('결제를 시작할 수 없습니다. 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={startPayment}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
            {loading ? '결제 준비 중...' : `${amount.toLocaleString()}원 결제하기`}
        </button>
    );
}
