import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import * as classNames from 'classnames';

export interface ModalMenuItem {
  key: string;
  group?: string;
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

  const differentGroup = (a: ModalMenuItem, b: ModalMenuItem) => {
    const hasGroup = a.group !== undefined || b.group !== undefined;
    return hasGroup && a.group !== b.group;
  }

  const renderItems = () => {
    return props.items.map((item, index) => {
      const isLast = index === props.items.length - 1;
      const isDifferentGroup = (
        !isLast && differentGroup(item, props.items[index + 1])
      );
      const itemClassNames = classNames(
        'mealz-modal-menu-item',
        {
          'mealz-modal-menu-item-item-separator': !isDifferentGroup,
          'mealz-modal-menu-item-group-separator': isDifferentGroup,
        },
      );
      return (
        <div
          key={item.key}
          className={itemClassNames}
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