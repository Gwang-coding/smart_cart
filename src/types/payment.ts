// types/payment.ts (새로 추가된 타입 정의 파일)
export interface PaymentRequestData {
    amount: number;
    orderId: string;
    orderName: string;
    customerName: string;
    successUrl: string;
    failUrl: string;
}

export interface PaymentResponseData {
    success: boolean;
    paymentKey?: string;
    orderId: string;
    amount: number;
    nextRedirectUrl?: string;
    errorCode?: string;
    errorMessage?: string;
}
