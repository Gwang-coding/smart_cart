import { Product } from '@/types/types';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useBarcode = (cartId: string, token?: string | null): { isScan: boolean; getProduct: Product | null } => {
    const [barcodeData, setBarcodeData] = useState<{ isScan: boolean; getProduct: Product | null }>({
        isScan: false,
        getProduct: null,
    });

    useEffect(() => {
        // cartId와 token이 제공된 경우에만 소켓 연결
        if (cartId && token) {
            const socket = io('https://smartcartback-production.up.railway.app', {
                query: { cartId, token },
            });

            console.log(`카트 #${cartId}에 연결되었습니다.`);

            // 바코드 데이터 수신
            socket.on('barcodeData', (data: { isScan: boolean; getProduct: Product }) => {
                setBarcodeData(data);
            });

            // 컴포넌트 언마운트 시 소켓 정리
            return () => {
                console.log(`카트 #${cartId} 연결 종료`);
                socket.disconnect();
            };
        } else {
            console.warn('카트 ID 또는 토큰이 제공되지 않아 소켓 연결을 생성하지 않습니다.');
        }
    }, [cartId, token]);

    return barcodeData;
};
