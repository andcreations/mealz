import * as React from 'react';
import { useState } from 'react';

import { usePatchState } from '../../../hooks';
import { MaterialIcon, ModalMenu, ModalMenuItem } from '../../../components';

export interface MealPlannerActionBarProps {
  onLogMeal: () => void;
  onClearMeal: () => void;
}

interface MealPlannerActionBarState {
  showModalMenu: boolean;
}

export function MealPlannerActionBar(props: MealPlannerActionBarProps) {
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
      name: 'Log Meal',
      onClick: props.onLogMeal,
    },
  ];

  return (
    <>
      <div className='mealz-meal-planner-action-bar'>
        <MaterialIcon
          className='mealz-meal-planner-action-bar-icon'
          icon='delete'
          onClick={props.onClearMeal}
        />
        <Separator/>
        <MaterialIcon
          className='mealz-meal-planner-action-bar-icon'
          icon='note_add'
          onClick={props.onLogMeal}
        />
        {/* <Separator/>
        <MaterialIcon
          className='mealz-meal-planner-action-bar-icon'
          icon='more_vert'
          onClick={onShowModalMenu}
        /> */}
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