'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import menu from '../../public/icons/menu.svg';
import close from '../../public/icons/pagedown.svg';
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
        setSidebar(false);

        // 페이지 경로 생성 (소문자 사용)
        const url = `/main/${cartid}/${componentName.toLowerCase()}?menu=${encodeURIComponent(menuText)}`;

        router.push(url);
    };

    return (
        <div className="relative flex itmes-center justify-center p-3 border-solid border-black border-b-2 mb-1">
            <div className="absolute left-4 top-5 cursor-pointer">
                <Image
                    src={menu}
                    alt="menu"
                    width={25}
                    height={25}
                    onClick={() => {
                        setSidebar(!sidebar);
                    }}
                />
            </div>
            {sidebar && (
                <div
                    className="bg-white absolute w-[190px] h-[100vh] left-0 flex flex-col items-start overflow-hidden shadow-md z-10"
                    ref={sidebarRef}
                >
                    <div className="absolute left-4 top-2 cursor-pointer">
                        <Image
                            src={close}
                            alt="close"
                            width={25}
                            height={25}
                            onClick={() => {
                                setSidebar(false);
                            }}
                        />
                    </div>
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
