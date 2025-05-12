// app/container/components/Button.tsx
'use client'; // 클라이언트 컴포넌트로 지정

interface ButtonProps {
    Click?: () => void;
    navigateTo?: string;
    totalProduct: number;
    getTotalPrice: number;
}

function BuyButton({ getTotalPrice, totalProduct, Click }: ButtonProps) {
    return (
        <div className="sticky bottom-0">
            <div className="border-t bg-white border-gray-300 py-1 font-bold text-lg text-center">
                <p>총 {getTotalPrice}원</p>
            </div>
            <button onClick={Click} className="py-4 font-bold w-full text-xl text-white bg-[#4285f4]">
                총{totalProduct}개의 상품 구매하기
            </button>
        </div>
    );
}

export default BuyButton;
