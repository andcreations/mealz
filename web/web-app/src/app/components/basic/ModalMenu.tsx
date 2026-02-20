import * as React from 'react';
import Modal from 'react-bootstrap/Modal';

export interface ModalMenuItem {
  key: string;
  content: string | React.ReactNode;
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
          key={item.key}
          className='mealz-modal-menu-item'
          onClick={() => onItemClick(item)}
        >
          {item.content}
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