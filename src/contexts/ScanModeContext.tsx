'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type ScanMode = 'SCAN_FIRST' | 'PUT_FIRST';

type ScanModeContextType = {
    scanMode: ScanMode;
    setScanMode: (mode: ScanMode) => void;
};

const ScanModeContext = createContext<ScanModeContextType | undefined>(undefined);

export function ScanModeProvider({ children }: { children: ReactNode }) {
    const [scanMode, setScanModeState] = useState<ScanMode>('SCAN_FIRST');

    // 로컬 스토리지에서 값 로드
    useEffect(() => {
        const storedMode = localStorage.getItem('scanMode') as ScanMode;
        if (storedMode && (storedMode === 'SCAN_FIRST' || storedMode === 'PUT_FIRST')) {
            setScanModeState(storedMode);
        }
    }, []);

    // 모드 변경 시 로컬 스토리지에 저장
    const setScanMode = (mode: ScanMode) => {
        localStorage.setItem('scanMode', mode);
        setScanModeState(mode);
        console.log('스캔 모드 변경:', mode);
    };

    return <ScanModeContext.Provider value={{ scanMode, setScanMode }}>{children}</ScanModeContext.Provider>;
}

export function useScanMode() {
    const context = useContext(ScanModeContext);
    if (context === undefined) {
        throw new Error('useScanMode must be used within a ScanModeProvider');
    }
    return context;
}
