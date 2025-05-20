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
    const lastScannedRef = useRef<string | null>(null);
    const startScanner = useCallback(async () => {
        if (!scannerRef.current || !selectedCameraId) return;

        try {
            await scannerRef.current.start(
                selectedCameraId,
                {
                    fps,
                    qrbox: { width: width - 100, height: height - 100 },
                    aspectRatio: 1,
                },
                (decodedText) => {
                    if (lastScannedRef.current !== decodedText) {
                        lastScannedRef.current = decodedText;
                        onScan(decodedText);
                    }
                },
                (errorMessage) => {
                    if (!errorMessage.includes('QR code parse error') && onError) {
                        onError(errorMessage);
                    }
                }
            );
            setIsScanning(true);
            console.log('✅ 스캐너 시작됨');
        } catch (err) {}
    }, [selectedCameraId, fps, width, height, onScan, onError]);

    const stopScanner = useCallback(async () => {
        const scanner = scannerRef.current;
        if (scanner && isScanning) {
            try {
                await scanner.stop();
                await scanner.clear();
                setIsScanning(false);
                console.log('✅ 스캐너 중지됨');
            } catch (err) {
                console.error('❌ 스캐너 중지 실패:', err);
                if (onError) onError('스캐너를 중지할 수 없습니다: ' + String(err));
            }
        }
    }, [isScanning, onError]);

    useEffect(() => {
        const initScanner = async () => {
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode('qr-reader');
            }
            try {
                const devices = await Html5Qrcode.getCameras();
                if (devices.length > 0) {
                    setCameras(devices);
                    setSelectedCameraId(devices[0].id);
                    setHasCamera(true);
                } else {
                    setHasCamera(false);
                    if (onError) onError('카메라를 찾을 수 없습니다.');
                }
            } catch (err) {
                setHasCamera(false);
                if (onError) onError('카메라 접근 권한이 없습니다: ' + String(err));
            }
        };

        initScanner();

        return () => {
            const shutdown = async () => {
                try {
                    if (scannerRef.current) {
                        await scannerRef.current.stop();
                        await scannerRef.current.clear();
                        console.log('🧹 언마운트 시 스캐너 정리 완료');
                    }
                } catch (err) {
                    console.warn('⚠️ 언마운트 시 스캐너 정리 실패:', err);
                }
            };
            shutdown();
        };
    }, [onError]);

    // 카메라 변경 시 스캐너 재시작
    useEffect(() => {
        const restart = async () => {
            if (selectedCameraId && scannerRef.current) {
                if (isScanning) {
                    await stopScanner();
                }
                await startScanner();
            }
        };
        restart();
    }, [selectedCameraId, startScanner, startScanner]);

    const switchCamera = (cameraId: string) => {
        setSelectedCameraId(cameraId);
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
                                onChange={(e) => switchCamera(e.target.value)}
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
                                onClick={startScanner}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                스캐너 시작
                            </button>
                        ) : (
                            <button
                                onClick={stopScanner}
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
