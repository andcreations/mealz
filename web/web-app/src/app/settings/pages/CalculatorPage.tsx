import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageWrapper } from '../../page';
import { useTranslations } from '../../i18n';
import { PathTo } from '../../routing';
import { usePatchState } from '../../hooks';
import { Calculator } from '../components/calculator';
import {
  CalculatorPageTranslations,
} from './CalculatorPage.translations';
import { YesNoModal } from '../../components/modals';

interface CalculatorPageState {
  isDirty: boolean;
  showConfirmationModal: boolean;
}

export function CalculatorPage() {
  const translate = useTranslations(CalculatorPageTranslations);
  const navigate = useNavigate();

  const [state, setState] = useState<CalculatorPageState>({
    isDirty: false,
    showConfirmationModal: false,
  });
  const patchState = usePatchState(setState);

  const onGoBack = () => {
    if (state.isDirty) {
      patchState({ showConfirmationModal: true });
      return;
    }
    navigate(PathTo.settings());
  };

  const confirmationModal = {
    onNo: () => {
      patchState({ showConfirmationModal: false });
    },
    onYes: () => {
      patchState({ showConfirmationModal: false });
      navigate(PathTo.settings());
    },
  }

  return (
    <>
      <PageWrapper
        title={translate('title')}
        onGoBack={() => onGoBack()}
      >
        <Calculator
          onDirtyChanged={(isDirty) => patchState({ isDirty })}
        />
      </PageWrapper>
      { state.showConfirmationModal &&
        <YesNoModal
          show={state.showConfirmationModal}
          onYes={confirmationModal.onYes}
          onNo={confirmationModal.onNo}
        >
          { translate('confirmation-modal-message') }
        </YesNoModal>
      }
    </>
  );
}