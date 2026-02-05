import * as React from 'react';
import { useState } from 'react';

import { usePatchState } from '../../../hooks';
import { MaterialIcon, ModalMenu, ModalMenuItem } from '../../../components';
import { useTranslations } from '../../../i18n';
import {
  MealPlannerActionBarTranslations,
} from './MealPlannerActionBar.translations';

export interface MealPlannerActionBarProps {
  onLogMeal: () => void;
  onTakePhoto: () => void;
  onClearMeal: () => void;
  onLoadMeal: () => void;
  onSaveMeal: () => void;
  onDeleteMeal: () => void;
  onPortionMeal: () => void;
}

interface MealPlannerActionBarState {
  showModalMenu: boolean;
}

export function MealPlannerActionBar(props: MealPlannerActionBarProps) {
  const translate = useTranslations(MealPlannerActionBarTranslations);
  
  const [state, setState] = useState<MealPlannerActionBarState>({
    showModalMenu: false,
  });
  const patchState = usePatchState(setState);

  const Separator = () => {
    return (
      <div className='mealz-meal-planner-action-bar-separator'>
        &middot;
      </div>
    );
  }

  const onShowModalMenu = () => {
    patchState({ showModalMenu: true });
  }
  const onHideModalMenu = () => {
    patchState({ showModalMenu: false });
  }

  const menuItems: ModalMenuItem[] = [
    {
      key: 'clear-meal',
      content: translate('clear-meal'),
      onClick: props.onClearMeal,
    },
    {
      key: 'load-meal',
      content: translate('load-meal'),
      onClick: props.onLoadMeal,
    },
    {
      key: 'save-meal',
      content: translate('save-meal'),
      onClick: props.onSaveMeal,
    },
    { 
      key: 'delete-meal',
      content: translate('delete-meal'),
      onClick: props.onDeleteMeal,
    },
    {
      key: 'portion-meal',
      content: translate('portion-meal'),
      onClick: props.onPortionMeal,
    },
    {
      key: 'take-photo',
      content: translate('take-photo'),
      onClick: props.onTakePhoto,
    }
  ];

  return (
    <>
      <div className='mealz-meal-planner-action-bar'>
        <MaterialIcon
          className='mealz-meal-planner-action-bar-icon'
          icon='note_add'
          onClick={props.onLogMeal}
        />
        <Separator/>
        <MaterialIcon
          className='mealz-meal-planner-action-bar-icon'
          icon='more_vert'
          onClick={onShowModalMenu}
        />
      </div>
      { state.showModalMenu &&
        <ModalMenu
          show={state.showModalMenu}
          items={menuItems}
          onClick={onHideModalMenu}
          onClose={onHideModalMenu}
        />
      }
    </>      
  );
}