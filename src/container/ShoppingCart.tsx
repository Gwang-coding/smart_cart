'use client';
import CancleBtn from '@/components/CancleBtn';
import Image from 'next/image';
import { Product } from '@/types/types';
import { useState, useEffect } from 'react';
import BuyButton from '@/container/BuyButton';
import { useCart } from '@/contexts/CartContext';
import { useScanMode } from '@/contexts/ScanModeContext';
import { useBarcode } from '@/services/useBarcode';
import Modal from '@/container/BuyModal';
import { loadTossPayments } from '@tosspayments/payment-sdk';

type ProductWithQuantity = Product & { quantity: number; isChecked: boolean; isScan: boolean; unscanCount: number; img_url: string };

export default function ShoppingCart() {
    const [products, setProducts] = useState<ProductWithQuantity[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const { cartId, sessionToken } = useCart();

    // 모달 상태들
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedProductBarcode, setSelectedProductBarcode] = useState<string>('');

    const { scanMode, setScanMode } = useScanMode();
    const socketData = useBarcode(cartId || '', sessionToken);
    const { isScan, getProduct } = socketData;

    const getTotalProduct = () => {
        return products.filter((product) => product.isChecked).length;
    };

    const getTotalPrice = () => {
        return products.filter((product) => product.isChecked).reduce((total, product) => total + product.price * product.quantity, 0);
    };

    // 스캔 모드 토글 함수
    const toggleScanMode = () => {
        const newMode = scanMode === 'SCAN_FIRST' ? 'PUT_FIRST' : 'SCAN_FIRST';
        setScanMode(newMode);

        // 모드 변경 피드백
        console.log(`스캔 모드 변경: ${scanMode} → ${newMode}`);
    };

    // 결제 처리 함수 (기존과 동일)
    const handleClick = async () => {
        if (!cartId) {
            console.error('❌ 결제 실패: cartId가 없습니다.');
            return;
        }

        const uniqueId = Date.now().toString();
        const orderId = `order_${uniqueId}`;
        const secretKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string;

        if (!secretKey) {
            console.error('❌ 환경 변수 오류: NEXT_PUBLIC_TOSS_CLIENT_KEY가 설정되지 않음');
            return;
        }

        try {
            console.log('✅ Toss 클라이언트 키:', secretKey);
            console.log('🛒 장바구니 상품 목록:', products);

            const selectedProducts = products.filter((product) => product.isChecked);

            if (selectedProducts.length === 0) {
                console.error('❌ 결제 실패: 선택된 상품이 없습니다.');
                return;
            }

            const amount = selectedProducts.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
            const orderName = selectedProducts.map((product) => product.name).join(', ');

            console.log('🧾 주문 정보:', {
                amount,
                orderId,
                orderName,
                successUrl: `${window.location.origin}/api/payments`,
                failUrl: `${window.location.origin}/api/payments/fail`,
            });

            const tosspayments = await loadTossPayments(secretKey);
            console.log('✅ TossPayments 객체 로드 완료:', tosspayments);

            await tosspayments.requestPayment('카드', {
                amount,
                orderId,
                orderName,
                successUrl: `${window.location.origin}/api/payments`,
                failUrl: `${window.location.origin}/api/payments/fail`,
            });

            console.log('✅ 결제 요청 성공');
        } catch (error) {
            console.error('❌ 결제 요청 중 오류 발생:', error);
        }
    };

    // 상품 추가
    useEffect(() => {
        if (!cartId) return;
        console.log('현재 스캔 모드:', scanMode);
        console.log('받은 상품 데이터:', getProduct);

        if (getProduct) {
            setProducts((prevProducts) => {
                const existingProductIndex = prevProducts.findIndex((product) => product.barcode === getProduct.barcode);

                const effectiveIsScan = scanMode === 'PUT_FIRST' ? true : isScan;

                if (existingProductIndex !== -1) {
                    return prevProducts.map((product, index) =>
                        index === existingProductIndex
                            ? {
                                  ...product,
                                  quantity: product.quantity + 1,
                                  unscanCount: effectiveIsScan ? product.unscanCount : product.unscanCount + 1,
                              }
                            : product
                    );
                } else {
                    return [
                        ...prevProducts,
                        {
                            ...getProduct,
                            quantity: 1,
                            isChecked: true,
                            isScan: effectiveIsScan,
                            unscanCount: effectiveIsScan ? 0 : 1,
                        },
                    ];
                }
            });
        }
    }, [getProduct, isScan, cartId, scanMode]);

    const handleRemoveProduct = (barcode: string) => {
        setProducts((prevProducts) => prevProducts.filter((p) => p.barcode !== barcode));
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setProducts((prevProducts) => prevProducts.map((product) => ({ ...product, isChecked: newSelectAll })));
    };

    const handleCheckboxChange = (barcode: string) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.barcode === barcode ? { ...product, isChecked: !product.isChecked } : product))
        );
    };

    const handleRemoveSelected = () => {
        setProducts((prevProducts) => prevProducts.filter((p) => !p.isChecked));
        setSelectAll(false);
    };

    const handleQuantityChange = (barcode: string, type: 'increase' | 'decrease') => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => {
                if (product.barcode === barcode) {
                    const newQuantity = type === 'increase' ? product.quantity + 1 : product.quantity > 1 ? product.quantity - 1 : 1;
                    return { ...product, quantity: newQuantity };
                }
                return product;
            })
        );
    };

    // 삭제 모달 관련 함수들
    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseAndDelete = () => {
        setIsDeleteModalOpen(false);
        handleRemoveSelected();
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    // 인식 확인 모달 관련 함수들
    const handleConfirmRecognition = (barcode: string) => {
        setSelectedProductBarcode(barcode);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmAndMarkAsRecognized = () => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.barcode === selectedProductBarcode ? { ...product, unscanCount: 0 } : product))
        );
        setIsConfirmModalOpen(false);
        setSelectedProductBarcode('');
    };

    const handleCloseConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setSelectedProductBarcode('');
    };

    // 로컬 스토리지에서 장바구니 데이터 불러오기
    useEffect(() => {
        if (!cartId) return;

        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setProducts(parsedCart);
            } catch (error) {
                console.error('장바구니 데이터 파싱 오류:', error);
            }
        }
    }, [cartId]);

    // 장바구니가 변경될 때마다 로컬 스토리지 업데이트
    useEffect(() => {
        if (!cartId) return;

        if (products.length > 0) {
            localStorage.setItem('shoppingCart', JSON.stringify(products));
        }
    }, [products, cartId]);

    if (!cartId) {
        return <div>카트 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="w-full h-full flex flex-col justify-between">
            {/* 스캔 모드 표시 및 변경 버튼 */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <p className="text-sm font-medium text-blue-800">
                            현재 모드: {scanMode === 'SCAN_FIRST' ? '선스캔 후담기' : '선담기 후스캔'}
                        </p>
                        <div className="flex items-center space-x-1">
                            {scanMode === 'SCAN_FIRST' ? (
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={toggleScanMode}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                            scanMode === 'SCAN_FIRST'
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                        <div className="flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>변경</span>
                        </div>
                    </button>
                </div>

                {/* 모드 설명 */}
                <p className="text-xs text-blue-600 mt-1">
                    {scanMode === 'SCAN_FIRST'
                        ? '상품을 먼저 스캔한 후 장바구니에 담습니다. 인식센서를 통과해야 합니다.'
                        : '상품을 먼저 담은 후 나중에 스캔합니다. 인식센서를 거치지 않습니다.'}
                </p>
            </div>

            {/* 전체 선택 및 삭제 버튼 */}
            <div className="w-full flex justify-between items-center py-2 px-4 border-b-[1px] border-gray-300">
                <div className="flex items-center">
                    <input checked={selectAll} onChange={handleSelectAll} type="checkbox" className="accent-[#4285f4] w-7 h-7 mr-2" />
                    <label htmlFor="selectAll" className="text-base font-bold">
                        전체 선택
                    </label>
                </div>
                <button onClick={handleDelete} className="px-3 py-1 text-sm text-gray-600 font-semibold">
                    선택 삭제
                </button>

                {/* 삭제 확인 모달 */}
                <Modal
                    content="선택한 상품을 삭제하시겠습니까?"
                    isOpen={isDeleteModalOpen}
                    handleClose={handleCloseDeleteModal}
                    handleConfirm={handleCloseAndDelete}
                />

                {/* 인식 확인 모달 */}
                <Modal
                    content="담은 상품을 확인하셨습니까?"
                    isOpen={isConfirmModalOpen}
                    handleClose={handleCloseConfirmModal}
                    handleConfirm={handleConfirmAndMarkAsRecognized}
                />
            </div>

            {/* 상품 목록 */}
            <div className="flex flex-col justify-start h-full">
                {products.map((product, index) => (
                    <div
                        key={index}
                        className={`p-5 m-1 rounded-xl border ${product.unscanCount > 0 ? 'border-red-400' : 'border-gray-400'}`}
                    >
                        <div className="flex justify-between items-center w-full pb-2">
                            <input
                                type="checkbox"
                                className="accent-[#4285f4] w-8 h-8"
                                checked={product.isChecked}
                                onChange={() => handleCheckboxChange(product.barcode)}
                            />
                            <div className="w-full mx-4">{product.name}</div>
                            <CancleBtn onClick={() => handleRemoveProduct(product.barcode)} />
                        </div>
                        <div className="flex items-center">
                            <div className="relative w-20 h-[90px]">
                                <Image src={product.img_url} alt={product.name} fill className="object-cover" />
                            </div>
                            <div className="w-full pl-4 pr-1 flex justify-between flex-col">
                                <p>{product.price}원</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2 border-[1px] border-gray-600 rounded-[5px]">
                                        <button
                                            onClick={() => handleQuantityChange(product.barcode, 'decrease')}
                                            disabled={product.quantity <= 1}
                                            className={`${
                                                product.quantity <= 1 ? 'text-gray-300' : 'text-black'
                                            } px-3 disabled:cursor-not-allowed`}
                                        >
                                            -
                                        </button>
                                        <p>{product.quantity}</p>
                                        <button
                                            onClick={() => handleQuantityChange(product.barcode, 'increase')}
                                            className="text-black px-3"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {product.unscanCount > 0 && (
                                        <p className="text-xs font-semibold text-red-500">인식되지 않은 물품: {product.unscanCount}개</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-2xl font-extrabold mt-1">{product.price * product.quantity}</p>
                                        <p className="text-base mt-2 ml-1">원</p>
                                    </div>
                                    {product.unscanCount > 0 && (
                                        <button
                                            onClick={() => handleConfirmRecognition(product.barcode)}
                                            className="bg-blue-500 text-white text-sm font-bold py-2 px-3 rounded-lg hover:bg-blue-600 transition duration-200"
                                        >
                                            인식 확인
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <BuyButton Click={handleClick} getTotalPrice={getTotalPrice()} totalProduct={getTotalProduct()} />
        </div>
    );
}
