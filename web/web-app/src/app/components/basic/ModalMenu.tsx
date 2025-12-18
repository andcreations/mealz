import * as React from 'react';
import Modal from 'react-bootstrap/Modal';

import { nameToKey } from '../../utils';

export interface ModalMenuItem {
  id?: string;
  name: string;
  onClick: (item: ModalMenuItem) => void;
}

export interface ModalMenuProps {
  show: boolean
  items: ModalMenuItem[];
  onClick?: (item: ModalMenuItem) => void;
  onClose: () => void;
}

export function ModalMenu(props: ModalMenuProps) {
  const onItemClick = (item: ModalMenuItem) => {
    item.onClick(item);
    if (props.onClick) {
      props.onClick(item);
    }
  }


  const renderItems = () => {
    return props.items.map((item) => {
      return (
        <div
          key={nameToKey(item.name)}
          className='mealz-modal-menu-item'
          onClick={() => onItemClick(item)}
        >
          {item.name}
        </div>
      );
    });
  }

  return (
    <Modal
      className='mealz-modal-menu'
      show={props.show}
      backdrop={true}
      centered={true}
      onHide={props.onClose}
      onEscapeKeyDown={props.onClose}
    >
      { renderItems() }
    </Modal>
  );
}