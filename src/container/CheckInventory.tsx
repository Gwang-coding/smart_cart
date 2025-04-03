'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/types';

interface SearchProductProps {
    onSelectProduct?: (product: Product) => void;
}

export default function CheckInventory({ onSelectProduct }: SearchProductProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // 샘플 데이터 (실제로는 API에서 가져와야 함)
    useEffect(() => {
        // API 호출을 시뮬레이션하는 코드
        setLoading(true);
        // 실제 환경에서는 fetch나 axios를 사용하여 API에서 데이터를 가져옵니다
        setTimeout(() => {
            const dummyProducts: Product[] = [
                { id: 1, barcode: '654321', name: '위대한 게츠비', price: 10000, quantity: 15 },
                { id: 2, barcode: '123456', name: '충주 사과', price: 2000, quantity: 42 },
                { id: 3, barcode: '098765', name: 'raspberry pi 5', price: 34000, quantity: 7 },
                { id: 4, barcode: '8801056175900', name: '코카콜라제로', price: 2000, quantity: 23 },
                { id: 5, barcode: '232323', name: '펩시 제로', price: 2000, quantity: 35 },
                { id: 6, barcode: '343434', name: '가죽조끼', price: 12000, quantity: 10 },
                { id: 7, barcode: '8809246061293', name: '드로잉북', price: 18000, quantity: 5 },
            ];
            setProducts(dummyProducts);
            setFilteredProducts(dummyProducts);
            setLoading(false);
        }, 500);
    }, []);

    // 검색어 변경 시 상품 필터링
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(
                (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm)
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectProduct = (product: Product) => {
        if (onSelectProduct) {
            onSelectProduct(product);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="상품명 또는 바코드로 검색..."
                        className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-4">
                    <p>상품을 불러오는 중...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {filteredProducts.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                    onClick={() => handleSelectProduct(product)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                                            <p className="text-sm text-gray-500">바코드: {product.barcode}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold">{product.price.toLocaleString()}원</p>
                                            <p className="text-sm text-gray-600">재고: {product.quantity}개</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">검색 결과가 없습니다.</div>
                    )}
                </div>
            )}
        </div>
    );
}
