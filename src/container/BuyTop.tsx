// BuyTop.tsx
'use client'; // 클라이언트 컴포넌트로 지정

import React, { useState } from 'react';
import Modal from '@/container/BuyModal';

export default function BuyTop() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달을 열기 위한 핸들러
    const handleDelete = () => {
        setIsModalOpen(true);
    };

    // 삭제 처리 핸들러
    const handleConfirmDelete = () => {
        alert('상품이 삭제되었습니다.');
        setIsModalOpen(false); // 모달 닫기
    };

    // 모달을 닫기 위한 핸들러
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="w-full flex justify-between items-center py-3 px-4 border-b-[1px]  border-gray-300">
            <div className="flex items-center">
                <input type="checkbox" className="accent-[#4285f4] w-7 h-7 mr-2 " />
                <label htmlFor="selectAll" className="text-lg font-medium">
                    전체 선택
                </label>
            </div>
            <button onClick={handleDelete} className="px-3 py-1 text-black font-semibold ">
                선택 삭제
            </button>

            <Modal
                isOpen={isModalOpen} // 모달의 열림 상태를 전달
                handleClose={handleCloseModal} // 모달 닫기 핸들러 전달
                handleConfirm={handleConfirmDelete} // 삭제 확인 핸들러 전달
            />
        </div>
    );
}
