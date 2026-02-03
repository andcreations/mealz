import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';

import { useTranslations } from '../../i18n';
import { YesNoModalTranslations } from './YesNoModal.translations';

export interface YesNoModalProps {
  show: boolean;
  onYes: () => void;
  onNo: () => void;
  onClose?: () => void;
}

export function YesNoModal(props: React.PropsWithChildren<YesNoModalProps>) {
  const translate = useTranslations(YesNoModalTranslations);
  const onClose = props.onClose ?? props.onNo;

  return (
    <Modal
      className='mealz-yes-no-modal'
      show={props.show}
      centered={true}
      backdrop={true}
      onHide={onClose}
      onEscapeKeyDown={onClose}
    >
      { !!props.children &&
        <div className='mealz-yes-no-modal-message'>
          { props.children }
        </div>
      }
      <div className='mealz-yes-no-modal-buttons'>
        <Button
          variant='primary'
          onClick={props.onYes}
        >
          { translate('yes') }
        </Button>
        <Button
          variant='secondary'
          onClick={props.onNo}
        >
          { translate('no') }
        </Button>
      </div>
    </Modal>
  );
}