import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {
  GWNamedMeal,
  GWShareUser,
} from '@mealz/backend-meals-named-gateway-api';

import {
  focusRef,
  Key,
  mapKey,
  stopBubble,
  stripDiacritics,
} from '../../../utils';
import { usePatchState, useService } from '../../../hooks';
import { SystemService } from '../../../system';
import { MealsNamedService, MealsNamedShareService } from '../../../meals';
import { useTranslations } from '../../../i18n';
import { NamedMealPickerDropdown } from './NamedMealPickerDropdown';
import { ShareUsersDropdown } from './ShareUsersDropdown';
import { 
  ShareNamedMealPickerTranslations,
} from './ShareNamedMealPicker.translations';

enum Focus { None, Meal, User, ShareButton };

export interface ShareNamedMealPickerProps {
  show: boolean;
  onShare: (namedMeal: GWNamedMeal, user: GWShareUser) => void;
  onClose: () => void;
}

interface ShareNamedMealPickerState {
  focus: Focus;

  mealName: string;
  mealDropdownItems: GWNamedMeal[];
  mealDropdownIndex: number;
  selectedMeal?: GWNamedMeal;

  userName: string;
  allUsers: GWShareUser[];
  userDropdownItems: GWShareUser[];
  userDropdownIndex: number;
  selectedUser?: GWShareUser;
}

export function ShareNamedMealPicker(props: ShareNamedMealPickerProps) {
  const systemService = useService(SystemService);
  const mealsNamedService = useService(MealsNamedService);
  const mealsNamedShareService = useService(MealsNamedShareService);
  const translate = useTranslations(ShareNamedMealPickerTranslations);

  const sortMeals = (namedMeals: GWNamedMeal[]) => {
    return [...namedMeals].sort((a, b) => {
      const nameA = stripDiacritics(a.name.toLowerCase());
      const nameB = stripDiacritics(b.name.toLowerCase());

      if (nameA === nameB) {
        return a.id.localeCompare(b.id);
      }

      return nameA.localeCompare(nameB);
    });
  }
  const allNamedMeals = sortMeals(mealsNamedService.getAll());

  const sortUsers = (users: GWShareUser[]) => {
    return [...users].sort((a, b) => {
      const nameA = stripDiacritics(a.firstName.toLowerCase());
      const nameB = stripDiacritics(b.firstName.toLowerCase());

      if (nameA === nameB) {
        return a.id.localeCompare(b.id);
      }

      return nameA.localeCompare(nameB);
    });
  }

  const [state, setState] = useState<ShareNamedMealPickerState>({
    focus: Focus.Meal,
    mealName: '',
    mealDropdownItems: allNamedMeals,
    mealDropdownIndex: 0,
    userName: '',
    allUsers: [],
    userDropdownItems: [],
    userDropdownIndex: 0,
  });
  const patchState = usePatchState(setState);

  useEffect(
    () => {
      mealsNamedShareService.readShareUsers()
        .then((users) => {
          const sorted = sortUsers(users);
          patchState({
            allUsers: sorted,
            userDropdownItems: sorted,
          });
        });
    },
    [],
  );

  useEffect(
    () => {
      switch (state.focus) {
        case Focus.Meal:
          focusRef(meal.ref, { select: true });
          break;
        case Focus.User:
          focusRef(user.ref, { select: true });
          break;
        case Focus.ShareButton:
          focusRef(share.ref);
          break;
      }
    },
    [state.focus],
  );

  const meal = {
    ref: useRef(null),

    onFocus: () => {
      patchState({ focus: Focus.Meal });
    },

    onBlur: () => {
      patchState({ focus: Focus.None });
    },

    matchItems: (name: string): GWNamedMeal[] => {
      if (name.length === 0) {
        return allNamedMeals;
      }
      return sortMeals(mealsNamedService.search(name));
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value;
      const found = allNamedMeals.find(item => item.name === name);
      patchState({
        mealName: name,
        selectedMeal: found,
        mealDropdownItems: meal.matchItems(name),
        mealDropdownIndex: 0,
      });
    },

    onSelectFromDropdown: (index: number) => {
      const item = state.mealDropdownItems[index];
      patchState({
        focus: Focus.User,
        mealName: item.name,
        selectedMeal: item,
      });
    },

    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (systemService.isMobile()) {
        return;
      }
      switch (mapKey(event)) {
        case Key.Enter:
          stopBubble(event);
          meal.onSelectFromDropdown(state.mealDropdownIndex);
          return;
        case Key.ArrowDown:
          stopBubble(event);
          patchState({
            mealDropdownIndex: Math.min(
              state.mealDropdownIndex + 1,
              state.mealDropdownItems.length - 1,
            ),
          });
          return;
        case Key.ArrowUp:
          stopBubble(event);
          patchState({
            mealDropdownIndex: Math.max(state.mealDropdownIndex - 1, 0),
          });
          return;
      }
    },
  };

  const user = {
    ref: useRef(null),

    onFocus: () => {
      patchState({ focus: Focus.User });
    },

    onBlur: () => {
      patchState({ focus: Focus.None });
    },

    matchItems: (name: string): GWShareUser[] => {
      if (name.length === 0) {
        return state.allUsers;
      }
      const queryNormalized = stripDiacritics(name.toLowerCase());
      return state.allUsers.filter(u => {
        const nameNormalized = stripDiacritics(u.firstName.toLowerCase());
        return nameNormalized.includes(queryNormalized);
      });
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value;
      const found = state.allUsers.find(u => u.firstName === name);
      const matched = user.matchItems(name);
      patchState({
        userName: name,
        selectedUser: found,
        userDropdownItems: matched,
        userDropdownIndex: 0,
      });
    },

    onSelectFromDropdown: (index: number) => {
      const item = state.userDropdownItems[index];
      patchState({
        focus: Focus.ShareButton,
        userName: item.firstName,
        selectedUser: item,
      });
    },

    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (systemService.isMobile()) {
        return;
      }
      switch (mapKey(event)) {
        case Key.Enter:
          stopBubble(event);
          user.onSelectFromDropdown(state.userDropdownIndex);
          return;
        case Key.ArrowDown:
          stopBubble(event);
          patchState({
            userDropdownIndex: Math.min(
              state.userDropdownIndex + 1,
              state.userDropdownItems.length - 1,
            ),
          });
          return;
        case Key.ArrowUp:
          stopBubble(event);
          patchState({
            userDropdownIndex: Math.max(state.userDropdownIndex - 1, 0),
          });
          return;
      }
    },
  };

  const share = {
    ref: useRef(null),

    disabled: (): boolean => {
      return !state.selectedMeal || !state.selectedUser;
    },

    onClick: () => {
      if (state.selectedMeal && state.selectedUser) {
        props.onShare(state.selectedMeal, state.selectedUser);
      }
    },
  };

  const mealDropdown = {
    visible: () => {
      return (
        state.focus === Focus.Meal &&
        state.mealDropdownItems.length > 0
      );
    },

    selectedIndex: () => {
      return systemService.isMobile() ? undefined : state.mealDropdownIndex;
    },
  };

  const userDropdown = {
    visible: () => {
      return (
        state.focus === Focus.User &&
        state.userDropdownItems.length > 0
      );
    },

    selectedIndex: () => {
      return systemService.isMobile() ? undefined : state.userDropdownIndex;
    },
  };

  return (
    <Modal
      className='mealz-share-named-meal-picker'
      show={props.show}
      backdrop={true}
      centered={false}
      onHide={props.onClose}
      onEscapeKeyDown={props.onClose}
    >
      <div className='mealz-share-named-meal-picker-content'>
        <div className='mealz-share-named-meal-picker-field'>
          <div className='mealz-share-named-meal-picker-label'>
            { translate('meal-label') }
          </div>
          <Form.Control
            ref={meal.ref}
            className='mealz-share-named-meal-picker-input'
            type='text'
            placeholder={translate('meal-placeholder')}
            value={state.mealName}
            onChange={meal.onChange}
            onFocus={meal.onFocus}
            onBlur={meal.onBlur}
            onKeyDown={meal.onKeyDown}
          />
          { mealDropdown.visible() &&
            <div
              onMouseDown={event => event.preventDefault()}
            >
              <NamedMealPickerDropdown
                items={state.mealDropdownItems}
                selectedIndex={mealDropdown.selectedIndex()}
                onSelect={meal.onSelectFromDropdown}
              />
            </div>
          }
        </div>
        <div className='mealz-share-named-meal-picker-field'>
          <div className='mealz-share-named-meal-picker-label'>
            { translate('user-label') }
          </div>
          <Form.Control
            ref={user.ref}
            className='mealz-share-named-meal-picker-input'
            type='text'
            placeholder={translate('user-placeholder')}
            value={state.userName}
            onChange={user.onChange}
            onFocus={user.onFocus}
            onBlur={user.onBlur}
            onKeyDown={user.onKeyDown}
          />
          { userDropdown.visible() &&
            <div
              onMouseDown={event => event.preventDefault()}
            >
              <ShareUsersDropdown
                items={state.userDropdownItems}
                selectedIndex={userDropdown.selectedIndex()}
                onSelect={user.onSelectFromDropdown}
              />
            </div>
          }
        </div>
        <div className='mealz-share-named-meal-picker-action-bar-wrapper'>
          <Button
            size='sm'
            disabled={share.disabled()}
            onClick={share.onClick}
          >
            { translate('share-button') }
          </Button>
        </div>
      </div>
    </Modal>
  );
}
