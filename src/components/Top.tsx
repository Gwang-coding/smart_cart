'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';

interface TopProps {
    text?: string; // 선택적 prop으로 정의
    cartid?: string;
}

export default function Top({ text = '장바구니', cartid }: TopProps) {
    const sidebarRef = useRef(null);
    const [sidebar, setSidebar] = useState(false);
    const router = useRouter();
    // 네비게이션 핸들러
    const handleNavigation = (componentName: string, menuText: string) => {
        setSidebar(false); // 메뉴 선택 후 사이드바 닫기
        router.push(`/${cartid}/${componentName}?menu=${encodeURIComponent(menuText)}`);
    };

    return (
        <div className="relative flex itmes-center justify-center p-3 border-solid border-black border-b-2 mb-1">
            <div className="absolute left-0 align-center justify-center flex">
                <img
                    onClick={() => {
                        setSidebar(!sidebar);
                    }}
                    className="w-6 h-6 ml-5 mt-2"
                    src="./icons/menu.svg"
                    alt="Menu"
                />
            </div>
            {sidebar && (
                <div
                    className="bg-white absolute w-[190px] h-[100vh] left-0 flex flex-col items-start overflow-hidden shadow-md z-10"
                    ref={sidebarRef}
                >
                    <img
                        onClick={() => {
                            setSidebar(false);
                        }}
                        className="ml-5 mt-2 w-6"
                        src="/icons/pagedown.svg"
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
