import * as React from 'react';
import Modal from 'react-bootstrap/Modal';

import { AIMealScanner } from './AIMealScanner';

export interface AIMealScannerModalProps {
  show: boolean;
  onClose: () => void;
}

export function AIMealScannerModal(props: AIMealScannerModalProps) {
  return (
    <Modal
      className='mealz-ai-meal-scanner-modal'
      show={props.show}
      centered={true}
      backdrop={true}
      onHide={props.onClose}
      onEscapeKeyDown={props.onClose}
    >
      <AIMealScanner/>
    </Modal>
  );
}