// src/components/CustomModal.jsx
import React from 'react';
import { Modal as RBModal, Button } from 'react-bootstrap';

const CustomModal = ({
  title,
  show,
  onHide,
  children,
  onSave,
  saveLabel = 'Save',
}) => (
  <RBModal show={show} onHide={onHide} centered>
    <RBModal.Header closeButton>
      <RBModal.Title>{title}</RBModal.Title>
    </RBModal.Header>
    <RBModal.Body>{children}</RBModal.Body>
    <RBModal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
      {onSave && (
        <Button variant="primary" onClick={onSave}>
          {saveLabel}
        </Button>
      )}
    </RBModal.Footer>
  </RBModal>
);

export default CustomModal;
