// app/[id]/client-page.tsx (클라이언트 컴포넌트)
'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { useCart } from '@/contexts/CartContext';
import camera from '../../../../public/icons/camera.png';
import Image from 'next/image';

export default function QRPageClient({ cartId }: { cartId: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [qrData, setQrData] = useState({ content: '', token: '' });
    const [scanned, setScanned] = useState(false);
    const { setCartId, setSessionToken } = useCart();
    useEffect(() => {
        // QR 토큰 생성
        const token = `cart_${cartId}_${Date.now()}`;
        const timestamp = Date.now();

        const contentObj = { cartId, token, timestamp };
        setQrData({
            content: JSON.stringify(contentObj),
            token,
        });

        setIsLoading(false);

        // 웹소켓 연결
        const socket: Socket = io('https://smartcartback-production.up.railway.app', {
            query: { cartId },
        });

        socket.on('connect', () => {
            console.log('웹소켓 연결됨');
        });

        socket.on('message', (data) => {
            // 스캔 이벤트 및 세션 토큰 확인
            if (data.type === 'scan' && data.cartId === cartId && data.qrToken === token) {
                console.log('QR 스캔 이벤트 수신, 리다이렉트 준비');
                setScanned(true);
                setCartId(cartId);
                setSessionToken(data.sessionToken);

                // localStorage에 직접 저장 (Context가 자동으로 처리하지 않는 경우)
                localStorage.setItem('cartId', cartId);
                localStorage.setItem('sessionToken', data.sessionToken);
                // 세션 토큰이 포함된 URL로 리다이렉트
                setTimeout(() => {
                    router.push(`/mode-select/${cartId}`);
                }, 1500);
            }
        });

        socket.on('disconnect', () => {
            console.log('웹소켓 연결 해제됨');
        });

        return () => {
            socket.disconnect();
            console.log('웹소켓 연결 해제됨');
        };
    }, [cartId, router, setCartId, setSessionToken]);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">QR 코드 생성 중...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center mb-2">
                <Image src={camera} alt="menu" width={35} height={35} />
                <p className="ml-2 text-lg text-black font-bold">QR 코드를 스캔해주세요!</p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-lg">
                <QRCodeSVG value={qrData.content} size={256} />
            </div>

            {scanned && <p className="mt-4 text-green-600 font-bold">스캔 완료! 메인 페이지로 리다이렉트 중...</p>}
        </div>
    );
}
