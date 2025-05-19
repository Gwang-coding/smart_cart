'use client';

import React, { useState } from 'react';
import { Product } from '@/types/types';

interface SearchProductProps {
    onSelectProduct?: (product: Product) => void;
}

export default function CheckInventory({ onSelectProduct }: SearchProductProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState<boolean>(false); // 검색 수행 여부 상태 추가

    // 상품 검색 함수
    const searchProducts = async () => {
        if (!searchTerm.trim()) {
            setError('검색어를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setHasSearched(true);

            // 검색어를 포함하는 URL 인코딩
            const encodedSearchTerm = encodeURIComponent(searchTerm.trim());

            // 백엔드 API 호출
            const response = await fetch(`https://smartcartback-production.up.railway.app/product/search?term=${encodedSearchTerm}`);

            if (!response.ok) {
                throw new Error('검색 결과를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (err) {
            console.error('상품 검색 오류:', err);
            setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setError(null); // 새 검색어 입력 시 오류 메시지 초기화
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    };

    const handleSearchClick = () => {
        searchProducts();
    };

    const handleSelectProduct = (product: Product) => {
        if (onSelectProduct) {
            onSelectProduct(product);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setError(null);
        // 검색 결과는 그대로 유지하여 이전 검색 결과를 볼 수 있게 함
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div className="mb-4">
                <div className="flex items-center">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="상품명 또는 바코드로 검색..."
                            className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={handleSearch}
                            onKeyDown={handleKeyDown}
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
                        {searchTerm && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleSearchClick}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                        검색
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">상품을 검색하는 중...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {hasSearched ? (
                        searchResults.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {searchResults.map((product) => (
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
                            <div className="p-8 text-center text-gray-500">검색 결과가 없습니다.</div>
                        )
                    ) : (
                        <div className="p-8 text-center text-gray-500">검색어를 입력하고 검색 버튼을 클릭하세요.</div>
                    )}
                </div>
            )}
        </div>
    );
}
