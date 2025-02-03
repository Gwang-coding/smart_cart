// components/CloseButton.tsx
'use client';

import React from 'react';

interface CloseButtonProps {
    onClick?: () => void; // 클릭 핸들러
}

const CancleBtn = ({ onClick }: CloseButtonProps) => {
    return (
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-300" onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );
};

export default CancleBtn;
