// Modal.tsx
'use client'; // 클라이언트 컴포넌트로 지정

import React from 'react';

interface ModalProps {
    isOpen: boolean; // 모달이 열렸는지 여부
    handleConfirm: () => void; // 삭제 확인 버튼을 눌렀을 때의 핸들러
    handleClose: () => void; // 모달 닫기 버튼을 눌렀을 때의 핸들러
}

function Modal({ isOpen, handleConfirm, handleClose }: ModalProps) {
    if (!isOpen) return null; // isOpen이 false일 때는 모달을 렌더링하지 않음

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-90">
                <h2 className="text-lg font-semibold mb-4">선택한 상품을 삭제하시겠습니까?</h2>
                <div className="flex justify-between space-x-4">
                    <button onClick={handleClose} className="px-10 py-2 border-2 border-gray-200 text-black font-bold rounded-md ">
                        취소
                    </button>
                    <button onClick={handleConfirm} className="px-10 py-2 bg-[#4285f4]  text-white font-bold rounded-md ">
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
