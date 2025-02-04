// app/container/components/Button.tsx
'use client'; // 클라이언트 컴포넌트로 지정

import { useRouter } from 'next/navigation';

interface ButtonProps {
    onClick?: () => void;
    navigateTo?: string;
    totalProduct: number;
    getTotalPrice: number;
}

function BuyButton({ getTotalPrice, totalProduct, onClick, navigateTo }: ButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        alert('결제 ㄱㄱ');
        // if (navigateTo) router.push(navigateTo); // 페이지 이동
    };

    return (
        <div className="sticky bottom-0">
            <div className="border-t bg-white border-gray-300 py-1 font-bold text-lg text-center">
                <p>총 {getTotalPrice}원</p>
            </div>
            <button onClick={handleClick} className="py-4 font-bold w-full text-xl text-white bg-[#4285f4]">
                총{totalProduct}개의 상품 구매하기
            </button>
        </div>
    );
}

export default BuyButton;
