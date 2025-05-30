'use client';

import React, { useState } from 'react';

import QrReader from '@/components/QrReader';
import { Product } from '@/types/types';

function QR() {
    const [scannedResult, setScannedResult] = useState<string>('');
    const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // QR.tsx의 handleAddToCart 함수
    const handleAddToCart = () => {
        if (scannedProduct) {
            // 타입 정의
            interface CartProduct {
                id: number;
                barcode: string;
                name: string;
                price: number;
                quantity: number;
                isChecked: boolean;
                isScan: boolean;
                unscanCount: number;
            }

            // 타입을 명시하여 로컬 스토리지에서 가져오기
            const cartItems: CartProduct[] = JSON.parse(localStorage.getItem('shoppingCart') || '[]');

            // 이제 item은 CartProduct 타입으로 추론됩니다
            const existingIndex = cartItems.findIndex((item) => item.barcode === scannedProduct.barcode);

            if (existingIndex !== -1) {
                // 이미 존재하는 상품이면 수량만 증가
                cartItems[existingIndex].quantity += 1;
            } else {
                // 새 상품 추가
                cartItems.push({
                    ...scannedProduct,
                    quantity: 1,
                    isChecked: true,
                    isScan: true,
                    unscanCount: 0,
                } as CartProduct); // 타입 어서션 추가
            }

            // 수정된 장바구니를 로컬 스토리지에 저장
            localStorage.setItem('shoppingCart', JSON.stringify(cartItems));

            // 추가 완료 메시지
            alert(`${scannedProduct.name}이(가) 장바구니에 추가되었습니다.`);

            // 상태 초기화 (새 스캔 준비)
            setScannedResult('');
            setScannedProduct(null);
        }
    };

    const handleScan = async (decodedText: string) => {
        // 같은 바코드를 연속으로 스캔하는 것 방지 (UX 개선)
        if (decodedText && scannedProduct) {
            console.log('같은 바코드 연속 스캔 무시:', decodedText);
            return;
        }

        setScannedResult(decodedText);
        setIsLoading(true);
        setError(null);
        console.log('스캔된 바코드:', decodedText);

        try {
            const res = await fetch(`https://smartcartback-production.up.railway.app/product/barcode/${decodedText}`);
            if (!res.ok) {
                throw new Error('상품을 찾을 수 없습니다.');
            }
            const product: Product = await res.json();
            setScannedProduct(product);
            console.log('상품 정보 로드 성공:', product);
        } catch (err) {
            if (err instanceof Error) {
                console.error('상품 정보 로드 오류:', err);
                setError(err.message);
            } else {
                console.error('알 수 없는 오류:', err);
                setError('알 수 없는 오류가 발생했습니다.');
            }
            setScannedProduct(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleError = (error: string) => {
        // QR 코드 파싱 오류는 무시 (정상적인 스캔 프로세스의 일부)
        if (error.includes('QR code parse error') || error.includes('No barcode or QR code detected')) {
            return;
        }

        console.error('QR 스캔 오류:', error);
        setError(error);
    };

    // 스캔 결과 초기화
    const handleReset = () => {
        setScannedResult('');
        setScannedProduct(null);
        setError(null);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1 p-4">
                <div className="max-w-md mx-auto">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-semibold mb-2">상품 QR 코드 스캔</h2>
                        <p className="text-gray-600">QR 코드나 바코드를 스캔하여 상품 정보를 확인하세요</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <QrReader onScan={handleScan} onError={handleError} width={320} height={320} />
                    </div>

                    {isLoading && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">정보를 불러오는 중...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                            <p>{error}</p>
                            <button onClick={handleReset} className="mt-2 px-4 py-1 bg-red-500 text-white text-sm rounded">
                                다시 시도
                            </button>
                        </div>
                    )}

                    {scannedResult && !isLoading && !error && (
                        <div className="bg-gray-100 p-3 rounded mb-4">
                            <p className="text-sm text-gray-700">
                                스캔 결과: <span className="font-mono font-medium">{scannedResult}</span>
                            </p>
                        </div>
                    )}

                    {scannedProduct && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                            <h3 className="text-lg font-bold mb-2">{scannedProduct.name}</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-600">바코드:</div>
                                <div className="font-medium">{scannedProduct.barcode}</div>
                                <div className="text-gray-600">가격:</div>
                                <div className="font-medium">{scannedProduct.price.toLocaleString()}원</div>
                            </div>

                            <div className="flex space-x-2 mt-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    장바구니에 추가
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QR;
