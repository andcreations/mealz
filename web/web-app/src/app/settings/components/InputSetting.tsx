import * as React from 'react';
import { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import classNames = require('classnames');

import { ifEnterKey } from '../../utils';
import { Setting } from './Setting';

export interface InputSettingProps {
  className?: string;
  type: 'text' | 'number';
  label: string;
  labelSuffix?: string;
  details?: string;
  value: string | number | undefined;
  error?: boolean;
  width?: 'sm' | 'md' | 'lg';
  onChange: (value: string | number) => void;
  onLeave?: () => void;
  onBlur?: () => void;
}

const WIDTH_MAP = {
  sm: '2rem',
  md: '4rem',
  lg: '6rem',
};

export function InputSetting(props: InputSettingProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onEnter = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
    if (props.onLeave) {
      props.onLeave();
    }
  };

  const inputStyle = {
    width: WIDTH_MAP[props.width ?? 'md'],
  };

  const inputClassName = classNames(
    props.className,
    { 'mealz-input-error': props.error },
  );

  return (
    <Setting
      label={props.label}
      labelSuffix={props.labelSuffix}
      details={props.details}
    >
      <Form.Control
        ref={inputRef}
        className={inputClassName}
        style={inputStyle}
        type={props.type}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        onKeyDown={ifEnterKey(onEnter)}
        onBlur={props.onBlur}
      />
    </Setting>
  );
}