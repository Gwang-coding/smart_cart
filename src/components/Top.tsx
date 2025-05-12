'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface TopProps {
    text?: string; // 선택적 prop으로 정의
    cartid?: string;
    sessionToken?: string | null;
    currentPath?: string | null;
}

export default function Top({ text = '장바구니', cartid, sessionToken, currentPath }: TopProps) {
    const sidebarRef = useRef(null);
    const [sidebar, setSidebar] = useState(false);
    const router = useRouter();
    // 네비게이션 핸들러
    const handleNavigation = (componentName: string, menuText: string) => {
        setSidebar(false);

        // 세션 토큰을 URL에 포함 (중요!)
        const sessionParam = sessionToken ? `&session=${sessionToken}` : '';

        // 페이지 경로 생성 (소문자 사용)
        const url = `/main/${cartid}/${componentName.toLowerCase()}?menu=${encodeURIComponent(menuText)}${sessionParam}`;

        console.log('Navigating to:', url);
        router.push(url);
    };

    return (
        <div className="relative flex itmes-center justify-center p-3 border-solid border-black border-b-2 mb-1">
            <div className="absolute left-0 align-center justify-center flex">
                <Image
                    onClick={() => {
                        setSidebar(!sidebar);
                    }}
<<<<<<< HEAD
                    className="w-6 h-6 ml-5 mt-2"
                    src="/icons/menu.svg"
                    alt="Menu"
=======
                    className="ml-5 mt-2"
                    src="/icons/menu.svg"
                    alt="메뉴 버튼"
                    width={24}
                    height={24}
>>>>>>> 243434ced545c98f1310c62e05808b2f7798933b
                />
            </div>
            {sidebar && (
                <div
                    className="bg-white absolute w-[190px] h-[100vh] left-0 flex flex-col items-start overflow-hidden shadow-md z-10"
                    ref={sidebarRef}
                >
                    <Image
                        onClick={() => {
                            setSidebar(false);
                        }}
                        className="ml-5 mt-2"
                        src="/icons/pagedown.svg"
                        alt="사이드바 닫기"
                        width={24}
                        height={24}
                    />
                    <div className="flex flex-col gap-4 items-end w-full pr-8 mt-8 font-medium">
                        <div
                            className="cursor-pointer hover:text-blue-500 transition-colors"
                            onClick={() => handleNavigation('CheckInventory', '재고확인')}
                        >
                            재고확인
                        </div>
                        <div
                            className="cursor-pointer hover:text-blue-500 transition-colors"
                            onClick={() => {
                                handleNavigation('SearchProduct', '물품 위치찾기');
                            }}
                        >
                            물품 위치찾기
                        </div>
                        <div
                            className="cursor-pointer hover:text-blue-500 transition-colors"
                            onClick={() => handleNavigation('ShoppingCart', '장바구니')}
                        >
                            장바구니
                        </div>
                        <div
                            className="cursor-pointer hover:text-blue-500 transition-colors"
                            onClick={() => handleNavigation('QR', 'QR입력')}
                        >
                            QR확인
                        </div>
                    </div>
                </div>
            )}
            <div className="p-2 text-center flex ">
                <p className="text-xl font-bold">{cartid}번 카트 /&nbsp; </p>
                <p className="text-xl font-bold">{text}</p>
            </div>
        </div>
    );
}
