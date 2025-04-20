import { Product } from '@/types/types';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// 기존 전역 소켓 인스턴스를 제거하고 함수 내부로 이동합니다
export const useBarcode = (cartId?: number, token?: string): { isScan: boolean; getProduct: Product | null } => {
    const [barcodeData, setBarcodeData] = useState<{ isScan: boolean; getProduct: Product | null }>({
        isScan: false,
        getProduct: null,
    });
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // cartId와 token이 제공된 경우에만 소켓 연결
        if (cartId && token) {
            // 카트 ID와 토큰을 쿼리 파라미터로 포함하여 소켓 연결
            const socketInstance = io('http://localhost:3001', {
                query: { cartId, token },
            });

            setSocket(socketInstance);

            // 소켓 연결 로그
            socketInstance.on('connect', () => {
                console.log(`카트 #${cartId}에 연결되었습니다.`);
            });

            // 바코드 데이터 수신
            socketInstance.on('barcodeData', (data: { isScan: boolean; getProduct: Product }) => {
                console.log(`카트 #${cartId} 바코드 데이터 수신:`, data);
                setBarcodeData(data);
            });

            // 컴포넌트 언마운트 시 소켓 정리
            return () => {
                console.log(`카트 #${cartId} 연결 종료`);
                socketInstance.disconnect();
            };
        } else {
            console.warn('카트 ID 또는 토큰이 제공되지 않아 소켓 연결을 생성하지 않습니다.');
        }
    }, [cartId, token]); // cartId나 token이 변경되면 소켓 다시 연결

    return barcodeData;
};
