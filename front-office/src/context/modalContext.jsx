// src/components/ModalContext.js
import React, { createContext, useContext, useState } from 'react';
import Modal from '../components/Modal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    content: null,
  });

  const openModal = (content, title = '') => {
    setModalConfig({ isOpen: true, title, content });
  };
  const closeModal = () => {
    setModalConfig((cfg) => ({ ...cfg, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
      >
        {modalConfig.content}
      </Modal>
    </ModalContext.Provider>
  );
};

// Hook to use in any component
export const useModal = () => useContext(ModalContext);
