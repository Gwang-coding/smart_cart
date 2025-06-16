'use client';

import { useState } from 'react';
import { useScanMode } from '@/contexts/ScanModeContext';
import { useRouter } from 'next/navigation';

interface ScanModeSelectorProps {
    cartId: string;
}

export default function ScanModeSelector({ cartId }: ScanModeSelectorProps) {
    const { setScanMode } = useScanMode();
    const router = useRouter();
    const [isSelecting, setIsSelecting] = useState(false);

    const handleModeSelect = (mode: 'SCAN_FIRST' | 'PUT_FIRST') => {
        setIsSelecting(true);
        setScanMode(mode);

        // 모드 선택 후 장바구니 페이지로 이동
        setTimeout(() => {
            router.push(`/main/${cartId}/shoppingcart`);
        }, 500);
    };

    return (
        <div>
            <div className="relative flex items-center justify-center p-3 border-solid border-black border-b-2 mb-10">
                <div className="p-2 text-center flex">
                    <p className="text-xl font-bold">{cartId}번 카트</p>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center m-10">
                <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">스캔 모드를 선택하세요</h1>

                <div className="space-y-4">
                    {/* 선스캔 후담기 버튼 */}
                    <button
                        onClick={() => handleModeSelect('SCAN_FIRST')}
                        disabled={isSelecting}
                        className="w-full p-6 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 
                                 text-white rounded-lg transition-colors duration-200 
                                 shadow-md hover:shadow-lg"
                    >
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-2">선스캔 후담기</h3>
                            <p className="text-sm opacity-90">
                                상품을 먼저 스캔한 후 장바구니에 담습니다.
                                <br />
                                인식센서를 통과해야 합니다.
                            </p>
                        </div>
                    </button>

                    {/* 선담기 후스캔 버튼 */}
                    <button
                        onClick={() => handleModeSelect('PUT_FIRST')}
                        disabled={isSelecting}
                        className="w-full p-6 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 
                                 text-white rounded-lg transition-colors duration-200 
                                 shadow-md hover:shadow-lg"
                    >
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-2">선담기 후스캔</h3>
                            <p className="text-sm opacity-90">
                                상품을 먼저 담은 후 나중에 스캔합니다.
                                <br />
                                인식센서를 거치지 않습니다.
                            </p>
                        </div>
                    </button>
                </div>

                {isSelecting && (
                    <div className="mt-6 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-gray-600">모드 설정 중...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
