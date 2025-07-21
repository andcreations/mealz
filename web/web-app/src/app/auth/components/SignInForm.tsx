import * as React from 'react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { usePatchState, useService } from '../../hooks';
import {
  ifEnterKey,
  isEmail,
  isNonEmpty,
  focusRef,
  validate,
} from '../../utils';
import { Row } from '../../components';
import { PathTo } from '../../routing';
import { useTranslations } from '../../i18n';
import { AuthService } from '../services';
import { SignInFormTranslations } from './SignInForm.translations';

enum Focus { Email, Password };

interface SignInFormState {
  email: string;
  password: string;
  focus: Focus;
  status: string;
}

export function SignInForm() {
  const [state, setState] = useState<SignInFormState>({
    email: '',
    password: '',
    focus: Focus.Email,
    status: '',
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(SignInFormTranslations);
  const navigate = useNavigate();
  const authService = useService(AuthService);

  const email = {
    ref: useRef(null),

    onFocus: () => {
      patchState({ focus: Focus.Email });
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      patchState({
        email: event.target.value,
        status: '',
      });
    },

    onEnter: () => {
      focusRef(password.ref);
    },
  };

  const password = {
    ref: useRef(null),

    onFocus: () => {
      patchState({ focus: Focus.Password });
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      patchState({
        password: event.target.value,
        status: '',
      });
    },

    onEnter: () => {
      login();
    },
  };

  const validateForm = (): boolean => {
    const errors = validate(state, [
      [ 'email', isNonEmpty, translate('e-mail-is-required') ],
      [ 'email', isEmail, translate('e-mail-is-invalid') ],
      [ 'password', isNonEmpty, translate('password-is-required') ],
    ]);
    if (errors.length) {
      patchState({ status: errors[0].message });
    }
    return !errors.length;
  };

  const login = () => {
    if (!validateForm()) {
      return;
    }
    authService.signIn(state.email, state.password)
      .then(() => {
        navigate(PathTo.dflt());
      })
      .catch((error) => {
        if (error.status === 401) {
          patchState({ status: translate('invalid-email-or-password') });
        } else {
          patchState({ status: translate('unexpected-error') });
        }
      });
  };
  
  switch (state.focus) {
    case Focus.Email:
      focusRef(email.ref);
      break;
    case Focus.Password:
      focusRef(password.ref);
      break;
  }

  return (
    <Form className='mealz-sign-in-form'>
      <Form.Group className='mealz-sign-in-form-control'>
        <Form.Control
          type='email'
          placeholder={translate('email')}
          ref={email.ref}
          autoFocus={state.focus === Focus.Email}
          onFocus={email.onFocus}
          onChange={email.onChange}
          onKeyDown={ifEnterKey(email.onEnter)}
        />
      </Form.Group>
      <Form.Group className='mealz-login-form-control'>
        <Form.Control
          type='password'
          placeholder={translate('password')}
          ref={password.ref}
          onFocus={password.onFocus}
          onChange={password.onChange}
          onKeyDown={ifEnterKey(password.onEnter)}
        />
      </Form.Group>
      <Row alignment='center'>
        <Button
          variant='primary'
          className='mealz-sign-in-form-button'
          onClick={login}
        >
          {translate('login')}
        </Button>
      </Row>
      <Row alignment='center'>
        <div className='mealz-sign-in-form-status'>
          {state.status}
        </div>
      </Row>        
    </Form>
  );
}