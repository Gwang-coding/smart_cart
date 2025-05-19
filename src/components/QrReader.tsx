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
                (decodedText) => onScan(decodedText),
                (errorMessage) => {
                    if (!errorMessage.includes('QR code parse error') && onError) {
                        onError(errorMessage);
                    }
                }
            );
            setIsScanning(true);
        } catch (err) {
            if (onError) onError('스캐너를 시작할 수 없습니다: ' + err);
        }
    }, [selectedCameraId, fps, width, height, onScan, onError]);

    const stopScanner = useCallback(async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear(); // <- 중요: DOM에 남은 <video> 제거
                setIsScanning(false);
            } catch (err) {
                if (onError) onError('스캐너를 중지할 수 없습니다: ' + err);
            }
        }
    }, [isScanning, onError]);

    useEffect(() => {
        const initScanner = async () => {
            scannerRef.current = new Html5Qrcode('qr-reader');
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
                if (onError) onError('카메라 접근 권한이 없습니다: ' + err);
            }
        };

        initScanner();

        return () => {
            stopScanner(); // cleanup
        };
    }, [onError, stopScanner]);

    // 카메라 변경 시 스캐너 재시작
    useEffect(() => {
        if (selectedCameraId && scannerRef.current) {
            if (isScanning) {
                stopScanner().then(startScanner);
            } else {
                startScanner();
            }
        }
    }, [selectedCameraId]);

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
