'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrReaderProps {
    onScan: (decodedText: string) => void;
    onError?: (error: string) => void;
    width?: number;
    height?: number;
    fps?: number;
}

function QrReader({ onScan, onError, width = 300, height = 300, fps = 10 }: QrReaderProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [hasCamera, setHasCamera] = useState(true);
    const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
    const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 스캐너 중지 함수 - 먼저 정의하여 의존성 순환을 방지
    const stopScanner = useCallback(async () => {
        if (!scannerRef.current) return;

        try {
            // 스캐너가 스캔 중인지 먼저 확인
            if (scannerRef.current.isScanning) {
                console.log('스캐너 중지 시도...');
                await scannerRef.current.stop();
                console.log('스캐너 중지 성공');
                setIsScanning(false);
            }
        } catch (err) {
            console.error('스캐너 중지 오류:', err);
            if (onError) onError('스캐너를 중지할 수 없습니다: ' + err);
        }
    }, [onError]);

    // 스캐너 시작 함수
    const startScanner = useCallback(async () => {
        if (!scannerRef.current || !selectedCameraId) return;

        try {
            // 이미 스캔 중이면 먼저 중지
            if (scannerRef.current.isScanning) {
                await stopScanner();
            }

            console.log('스캐너 시작 시도...');
            await scannerRef.current.start(
                selectedCameraId,
                {
                    fps,
                    qrbox: { width: width - 100, height: height - 100 },
                    aspectRatio: 1,
                },
                (decodedText) => {
                    onScan(decodedText);
                },
                (errorMessage) => {
                    // QR 코드를 찾는 중에 발생하는 일반적인 오류는 무시
                    if (errorMessage.includes('QR code parse error')) {
                        return;
                    }

                    if (onError) onError(errorMessage);
                }
            );

            console.log('스캐너 시작 성공');
            setIsScanning(true);
        } catch (err) {
            console.error('스캐너 시작 오류:', err);
            if (onError) onError('스캐너를 시작할 수 없습니다: ' + err);
        }
    }, [selectedCameraId, fps, width, height, onScan, onError, stopScanner]);

    // 컴포넌트 마운트 시 초기화
    useEffect(() => {
        if (!containerRef.current) return;

        console.log('QR 스캐너 초기화...');
        scannerRef.current = new Html5Qrcode('qr-reader');

        // 사용 가능한 카메라 목록 가져오기
        Html5Qrcode.getCameras()
            .then((devices) => {
                if (devices && devices.length > 0) {
                    console.log('카메라 찾음:', devices.length);
                    setCameras(devices);
                    setSelectedCameraId(devices[0].id);
                    setHasCamera(true);
                } else {
                    console.log('사용 가능한 카메라 없음');
                    setHasCamera(false);
                    if (onError) onError('카메라를 찾을 수 없습니다.');
                }
            })
            .catch((err) => {
                console.error('카메라 접근 오류:', err);
                setHasCamera(false);
                if (onError) onError('카메라 접근 권한이 없습니다: ' + err);
            });

        // 컴포넌트 언마운트 시 스캐너 정리
        return () => {
            console.log('컴포넌트 언마운트, 스캐너 정리 중...');
            if (scannerRef.current) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().catch((err) => console.error('언마운트 시 스캐너 중지 오류:', err));
                }
            }
        };
    }, [onError]); // 마운트/언마운트 시에만 실행

    // 카메라 변경 시 자동 시작하지 않도록 수정
    useEffect(() => {
        // 처음 카메라 설정 시에만 스캐너 시작
        if (selectedCameraId && cameras.length > 0 && !isScanning) {
            console.log('초기 카메라 설정 후 스캐너 시작');
            startScanner();
        }
    }, [cameras, selectedCameraId, startScanner, isScanning]);

    const handleCameraSwitch = async (cameraId: string) => {
        // 카메라 전환 시 먼저 기존 스캐너 중지
        if (isScanning) {
            await stopScanner();
        }

        console.log('카메라 전환:', cameraId);
        setSelectedCameraId(cameraId);

        // 카메라 변경 후 자동으로 스캐너 시작하지 않음
        // 사용자가 직접 시작 버튼을 눌러야 함
    };

    const handleStartClick = () => {
        console.log('스캐너 시작 버튼 클릭');
        startScanner();
    };

    const handleStopClick = () => {
        console.log('스캐너 중지 버튼 클릭');
        stopScanner();
    };

    return (
        <div className="qr-scanner-container">
            {!hasCamera ? (
                <div className="no-camera-message p-4 text-center bg-red-100 rounded">
                    <p>카메라를 사용할 수 없습니다. 카메라 접근 권한을 확인해주세요.</p>
                </div>
            ) : (
                <>
                    <div
                        id="qr-reader"
                        ref={containerRef}
                        style={{ width: `${width}px`, height: `${height}px` }}
                        className="mx-auto border border-gray-300 rounded overflow-hidden"
                    ></div>

                    {cameras.length > 1 && (
                        <div className="camera-selection mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">카메라 선택:</label>
                            <select
                                value={selectedCameraId || ''}
                                onChange={(e) => handleCameraSwitch(e.target.value)}
                                disabled={isScanning} // 스캔 중에는 카메라 변경 비활성화
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {cameras.map((camera) => (
                                    <option key={camera.id} value={camera.id}>
                                        {camera.label || `카메라 ${camera.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex justify-center mt-4 space-x-4">
                        {!isScanning ? (
                            <button
                                onClick={handleStartClick}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                스캐너 시작
                            </button>
                        ) : (
                            <button
                                onClick={handleStopClick}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                스캐너 중지
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default QrReader;
