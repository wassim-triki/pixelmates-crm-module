// src/components/Modal.js
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  // close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg mt-20 w-full max-w-2xl "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold ">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
