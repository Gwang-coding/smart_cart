// app/container/components/Button.tsx
'use client'; // 클라이언트 컴포넌트로 지정

import { useRouter } from 'next/navigation';

interface ButtonProps {
    onClick?: () => void;
    navigateTo?: string;
}

function BuyButton({ onClick, navigateTo }: ButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        alert('결제 ㄱㄱ');
        // if (navigateTo) router.push(navigateTo); // 페이지 이동
    };

    return (
        <button onClick={handleClick} className="py-4 font-semibold w-full text-white bg-[#4285f4]">
            총한개의 상품 구매하기
        </button>
    );
}

export default BuyButton;
