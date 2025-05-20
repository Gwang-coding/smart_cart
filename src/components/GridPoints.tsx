'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Product {
    id: number;
    barcode: string;
    name: string;
    price: number;
    quantity: number;
    location_x: number;
    location_y: number;
}

interface GridPointsProps {
    width?: number;
    height?: number;
    gridSize?: number;
    imageSrc?: string;
}

export default function GridPoints({ width = 400, height = 400, gridSize = 10, imageSrc = '/images/martmap.png' }: GridPointsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<number[][]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);

    // 그리드 초기화
    useEffect(() => {
        setGrid(
            Array(gridSize)
                .fill(null)
                .map(() => Array(gridSize).fill(0))
        );
    }, [gridSize]);

    // 이미지 로드 처리
    useEffect(() => {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.width = width;
        img.height = height;
        img.onload = () => {
            imageRef.current = img;
            setImageLoaded(true);
        };
    }, [imageSrc, width, height]);

    // 캔버스 그리기
    useEffect(() => {
        if (!canvasRef.current || grid.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 캔버스 초기화
        ctx.clearRect(0, 0, width, height);

        // 배경 이미지 그리기
        if (imageLoaded && imageRef.current) {
            ctx.drawImage(imageRef.current, 0, 0, width, height);
        } else {
            // 이미지가 로드되지 않았으면 기본 배경 채우기
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, width, height);
        }

        const cellSize = width / gridSize;

        // 그리드 라인 그리기 (반투명)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;

        // 수직선 그리기
        for (let x = 0; x <= width; x += cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // 수평선 그리기
        for (let y = 0; y <= height; y += cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // 점 그리기
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (grid[y][x] === 1) {
                    const centerX = x * cellSize + cellSize / 2;
                    const centerY = y * cellSize + cellSize / 2;
                    const radius = cellSize / 3;

                    // 빨간 점 그리기 (테두리 추가로 가시성 향상)
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
                    ctx.fill();
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }
    }, [grid, width, height, gridSize, imageLoaded]);

    // 캔버스 클릭으로 점 찍기
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const cellSize = width / gridSize;
        const x = Math.floor(mouseX / cellSize);
        const y = Math.floor(mouseY / cellSize);

        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
            setGrid((prevGrid) => {
                const newGrid = [...prevGrid.map((row) => [...row])]; // 깊은 복사
                newGrid[y][x] = newGrid[y][x] === 1 ? 0 : 1; // 토글 기능 추가
                return newGrid;
            });
        }
    };

    // 모든 점 지우기
    const clearAllPoints = () => {
        setGrid(
            Array(gridSize)
                .fill(null)
                .map(() => Array(gridSize).fill(0))
        );
    };

    // 상품 검색 함수
    const searchProduct = async () => {
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
            console.log('검색 결과:', data);
            setSearchResults(data);

            // 점들을 초기화
            clearAllPoints();

            // 검색 결과 상품들의 위치에 점 찍기
            data.forEach((product: Product) => {
                if (product.location_x) {
                    const x = product.location_x;
                    const y = product.location_y;
                    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
                        setGrid((prevGrid) => {
                            const newGrid = [...prevGrid.map((row) => [...row])];
                            newGrid[y][x] = 1;
                            return newGrid;
                        });
                    }
                }
            });
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
            searchProduct();
        }
    };

    const handleSearchClick = () => {
        searchProduct();
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setError(null);
        // 검색 결과는 유지
    };

    return (
        <div className="max-w-md mx-auto w-full items-center p-4">
            <div className="relative mb-6 flex justify-center">
                <canvas ref={canvasRef} width={width} height={height} onClick={handleCanvasClick} className="rounded shadow-md" />
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                        <p>이미지 로딩 중...</p>
                    </div>
                )}
            </div>

            {/* 상품 검색 부분 */}
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
                                    <div key={product.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                                                <p className="text-sm text-gray-500">바코드: {product.barcode}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold">{product.price.toLocaleString()}원</p>
                                                <p className="text-sm text-gray-500">
                                                    위치:{' '}
                                                    {product.location_x ? `(${product.location_x}, ${product.location_y})` : '정보 없음'}
                                                </p>
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
