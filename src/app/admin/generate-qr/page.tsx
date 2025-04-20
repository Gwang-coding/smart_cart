'use client';

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function GenerateQRPage() {
    const [cartId, setCartId] = useState<string>('');
    const [qrUrl, setQrUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const generateQR = async () => {
        if (!cartId) return;

        setLoading(true);
        try {
            // Nest.js API 호출
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/generate-qr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartId: parseInt(cartId) }),
            });

            const data = await response.json();

            if (data.success) {
                setQrUrl(data.qrUrl);
            } else {
                alert('QR 코드 생성 실패: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('QR 코드 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const downloadQR = () => {
        const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
        if (!canvas) return;

        const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');

        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `cart-${cartId}-qr.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">카트 QR 코드 생성</h1>

            <div className="mb-4">
                <label className="block mb-2">카트 번호:</label>
                <div className="flex">
                    <input
                        type="number"
                        value={cartId}
                        onChange={(e) => setCartId(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="카트 번호 입력"
                    />
                    <button onClick={generateQR} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded" disabled={loading || !cartId}>
                        {loading ? '생성 중...' : 'QR 생성'}
                    </button>
                </div>
            </div>

            {qrUrl && (
                <div className="mt-6 border rounded p-4 text-center">
                    <p className="mb-3">카트 #{cartId}의 QR 코드:</p>
                    <div className="bg-white inline-block p-4">
                        <QRCodeCanvas id="qr-code" value={qrUrl} size={200} level="H" includeMargin={true} />
                    </div>
                    <p className="mt-3 text-sm text-gray-600 break-all">{qrUrl}</p>
                    <button onClick={downloadQR} className="mt-3 bg-green-500 text-white px-4 py-2 rounded">
                        QR 코드 다운로드
                    </button>
                </div>
            )}
        </div>
    );
}
