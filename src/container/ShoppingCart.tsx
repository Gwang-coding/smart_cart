'use client';
import CancleBtn from '@/components/CancleBtn';
import Image from 'next/image';
import { Product } from '@/types/types';
import { useState, useEffect } from 'react';
import BuyButton from '@/container/BuyButton';
import { useCart } from '@/contexts/CartContext';
import { useBarcode } from '@/services/useBarcode';
import Modal from '@/container/BuyModal';
import { loadTossPayments } from '@tosspayments/payment-sdk';

type ProductWithQuantity = Product & { quantity: number; isChecked: boolean; isScan: boolean; unscanCount: number };

export default function ShoppingCart() {
    const [products, setProducts] = useState<ProductWithQuantity[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const { cartId, sessionToken } = useCart();

    if (!cartId) {
        return <div>카트 정보를 찾을 수 없습니다.</div>;
    }
    const socketData = useBarcode(cartId, sessionToken);
    const { isScan, getProduct } = socketData;

    // ShoppingCart.tsx의 handleClick 함수 부분
    const handleClick = async () => {
        // 고유한 주문 ID 생성 (최소 6자 이상)
        const uniqueId = Date.now().toString();
        const orderId = `order_${uniqueId}`; // 이렇게 하면 최소 12자 이상이 됩니다
        const secretKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string;
        try {
            const tosspayments = await loadTossPayments(secretKey);
            await tosspayments.requestPayment('카드', {
                amount: products
                    .filter((product) => product.isChecked) // 체크된 상품만 포함
                    .reduce((acc, curr) => {
                        return acc + curr.price * curr.quantity; // 수량을 고려한 가격 계산
                    }, 0), // 초기값을 0으로 설정
                orderId: orderId, // 수정된 주문 ID
                orderName: products
                    .filter((product) => product.isChecked)
                    .map((product) => product.name)
                    .join(', '),
                successUrl: `${window.location.origin}/api/payments`,
                failUrl: `${window.location.origin}/api/payments/fail`,
            });
        } catch (error) {
            console.error('결제 요청 오류:', error);
        }
    };
    // 상품 추가
    useEffect(() => {
        console.log(getProduct);
        if (getProduct) {
            setProducts((prevProducts) => {
                const existingProductIndex = prevProducts.findIndex((product) => product.barcode === getProduct.barcode);

                if (existingProductIndex !== -1) {
                    // 이미 존재하는 상품이면 수량 증가
                    return prevProducts.map((product, index) =>
                        index === existingProductIndex
                            ? {
                                  ...product,
                                  quantity: product.quantity + 1,
                                  unscanCount: isScan ? product.unscanCount : product.unscanCount + 1,
                              }
                            : product
                    );
                } else {
                    // 새로운 상품 추가
                    return [...prevProducts, { ...getProduct, quantity: 1, isChecked: true, isScan: isScan, unscanCount: isScan ? 0 : 1 }];
                }
            });
        }
    }, [getProduct, isScan]);

    const getTotalProduct = () => {
        return products.filter((product) => product.isChecked).length;
    };

    const getTotalPrice = () => {
        return products.filter((product) => product.isChecked).reduce((total, product) => total + product.price * product.quantity, 0);
    };

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

    // 수량 변경 함수
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
    // buytop에서 가져오기
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달을 열기 위한 핸들러
    const handleDelete = () => {
        setIsModalOpen(true);
    };

    // 삭제 처리 핸들러
    const handleCloseAndDelete = () => {
        setIsModalOpen(false); // 모달 닫기
        handleRemoveSelected();
    };

    // 모달을 닫기 위한 핸들러
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    // ShoppingCart.tsx에 추가
    useEffect(() => {
        // 로컬 스토리지에서 장바구니 데이터 불러오기
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setProducts(parsedCart);
            } catch (error) {
                console.error('장바구니 데이터 파싱 오류:', error);
            }
        }
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    // 장바구니가 변경될 때마다 로컬 스토리지 업데이트
    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem('shoppingCart', JSON.stringify(products));
        }
    }, [products]);

    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div className="w-full flex justify-between items-center py-2 px-4 border-b-[1px]  border-gray-300">
                <div className="flex items-center">
                    <input checked={selectAll} onChange={handleSelectAll} type="checkbox" className="accent-[#4285f4] w-7 h-7 mr-2 " />
                    <label htmlFor="selectAll" className="text-base font-bold">
                        전체 선택
                    </label>
                </div>
                <button onClick={handleDelete} className="px-3 py-1 text-sm text-gray-600 font-semibold ">
                    선택 삭제
                </button>

                <Modal
                    content="선택한 상품을 삭제하시겠습니까?"
                    isOpen={isModalOpen} // 모달의 열림 상태를 전달
                    handleClose={handleCloseModal} // 모달 닫기 핸들러 전달
                    handleConfirm={handleCloseAndDelete} // 삭제 확인 핸들러 전달
                />
            </div>
            {/* <div className="mt-32">
                <div className=" flex justify-center items-center m-5 h-20 rounded-md border bg-blue-500 text-white">
                    <p className="text-xl font-bold">바로스캔하기</p>
                </div>
                <div className="flex justify-center items-center m-5 h-20 rounded-md border border-[#393f47]">
                    <p className="text-xl font-bold text-[#393f47]">나중에 스캔하기</p>
                </div>
            </div> */}
            <div className="flex flex-col justify-start h-full">
                {products.map((product, index) => (
                    <div
                        key={index}
                        className={`p-5 m-1 rounded-xl border ${product.unscanCount > 0 ? 'border-red-400 ' : 'border-gray-400'}`}
                    >
                        <div className="flex justify-between items-center w-full pb-2">
                            <input
                                type="checkbox"
                                className="accent-[#4285f4] w-8 h-8"
                                checked={product.isChecked}
                                onChange={() => handleCheckboxChange(product.barcode)}
                            />
                            <div className="w-full mx-4"> {product.name}</div>
                            <CancleBtn onClick={() => handleRemoveProduct(product.barcode)} />
                        </div>
                        <div className="flex items-center">
                            <div className="relative w-20 h-[90px] ">
                                <Image src="/images/drawing.jpg" alt="sample" fill className="object-cover" />
                            </div>
                            <div className="w-full pl-4 pr-1 flex justify-between flex-col">
                                <p>{product.price}원</p>
                                <div className="flex justify-between items-center ">
                                    <div className="flex items-center space-x-2 border-[1px] border-gray-600 rounded-[5px]">
                                        <button
                                            onClick={() => handleQuantityChange(product.barcode, 'decrease')}
                                            disabled={product.quantity <= 1} // 수량이 1이면 비활성화
                                            className={`${
                                                product.quantity <= 1 ? 'text-gray-300' : 'text-black'
                                            }  px-3 disabled:cursor-not-allowed`}
                                        >
                                            -
                                        </button>
                                        <p>{product.quantity}</p>
                                        <button
                                            onClick={() => handleQuantityChange(product.barcode, 'increase')}
                                            className="text-black  px-3 "
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
                                        <button className="bg-blue-500 text-white text-sm font-bold py-2 px-3 rounded-lg hover:bg-blue-600 transition duration-200">
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
