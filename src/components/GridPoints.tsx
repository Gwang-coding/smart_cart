'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Product {
    id: number;
    barcode: string;
    name: string;
    price: number;
    quantity: number;
    location?: [number, number]; // x, y 좌표
}

interface GridPointsProps {
    width?: number;
    height?: number;
    gridSize?: number;
    imageSrc?: string;
}

export default function GridPoints({ width = 400, height = 400, gridSize = 10, imageSrc = './images/martmap.png' }: GridPointsProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<number[][]>([]);
    const [xCoord, setXCoord] = useState<string>('');
    const [yCoord, setYCoord] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);

    // 상품 샘플 데이터
    const sampleProducts: Product[] = [
        { id: 1, barcode: '654321', name: '위대한 게츠비', price: 10000, quantity: 15, location: [2, 3] },
        { id: 2, barcode: '123456', name: '충주 사과', price: 2000, quantity: 42, location: [2, 3] },
        { id: 3, barcode: '098765', name: 'raspberry pi 5', price: 34000, quantity: 7, location: [5, 7] },
        { id: 4, barcode: '8801056175900', name: '코카콜라제로', price: 2000, quantity: 23, location: [8, 1] },
        { id: 5, barcode: '232323', name: '펩시 제로', price: 2000, quantity: 35, location: [4, 6] },
        { id: 6, barcode: '343434', name: '가죽조끼', price: 12000, quantity: 10, location: [9, 9] },
        { id: 7, barcode: '8809246061293', name: '드로잉북', price: 18000, quantity: 5, location: [1, 8] },
        { id: 8, barcode: '8809741171442', name: '전담', price: 28000, quantity: 10, location: [7, 3] },
    ];

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
        if (!canvasRef.current || grid.length === 0 || !imageLoaded || !imageRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 캔버스 초기화
        ctx.clearRect(0, 0, width, height);

        // 배경 이미지 그리기
        ctx.drawImage(imageRef.current, 0, 0, width, height);

        const cellSize = width / gridSize;

        // 그리드 라인 그리기 (반투명)
        ctx.strokeStyle = 'transparent';
        ctx.lineWidth = 2;

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

    // 점 찍기 함수
    const placePoint = () => {
        const x = parseInt(xCoord);
        const y = parseInt(yCoord);

        if (isNaN(x) || isNaN(y) || x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
            alert(`좌표는 0부터 ${gridSize - 1} 사이여야 합니다.`);
            return;
        }

        setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            newGrid[y][x] = 1;
            return newGrid;
        });

        // 입력 필드 초기화
        setXCoord('');
        setYCoord('');
    };

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
    const searchProduct = () => {
        if (!searchTerm.trim()) {
            alert('검색어를 입력해주세요');
            return;
        }

        const results = sampleProducts.filter(
            (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.barcode.includes(searchTerm)
        );

        setSearchResults(results);

        // 점들을 초기화
        clearAllPoints();

        // 검색 결과 상품들의 위치에 점 찍기
        results.forEach((product) => {
            if (product.location) {
                const [x, y] = product.location;
                if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
                    setGrid((prevGrid) => {
                        const newGrid = [...prevGrid.map((row) => [...row])];
                        newGrid[y][x] = 1;
                        return newGrid;
                    });
                }
            }
        });

        if (results.length === 0) {
            alert('검색 결과가 없습니다');
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <canvas ref={canvasRef} width={width} height={height} onClick={handleCanvasClick} className="rounded shadow-md" />
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                        <p>이미지 로딩 중...</p>
                    </div>
                )}
            </div>

            {/* 상품 검색 부분 */}
            <div className="w-full max-w-md flex items-center gap-2 mt-2">
                <input
                    type="text"
                    placeholder="상품명 또는 바코드로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded"
                />
                <button onClick={searchProduct} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                    검색
                </button>
            </div>

            {/* 검색 결과 표시 */}
            {searchResults.length > 0 && (
                <div className="w-full max-w-md mt-2 border border-gray-200 rounded p-3 bg-gray-50">
                    <h3 className="font-medium text-lg mb-2">검색 결과 ({searchResults.length})</h3>
                    <ul className="divide-y divide-gray-200">
                        {searchResults.map((product) => (
                            <li key={product.id} className="py-2">
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-600">
                                    바코드: {product.barcode} | 가격: {product.price}원 | 위치:{' '}
                                    {product.location ? `(${product.location[0]}, ${product.location[1]})` : '정보 없음'}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
