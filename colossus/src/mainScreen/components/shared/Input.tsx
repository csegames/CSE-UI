/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface InputStyle {
  inputWrapper: React.CSSProperties;
  input: React.CSSProperties;
  label: React.CSSProperties;
}

const InputWrapper = 'Shared-Input-InputWrapper';
const InputView = 'Shared-Input-InputView';

const Label = 'Shared-Input-Label';

export interface InputProps {
  styles?: Partial<InputStyle>;
  label?: string;
  inputRef?: (r: HTMLInputElement) => void;
  type: string;

  [id: string]: any;
}

export const Input = (props: Partial<InputProps>) => {
  const { styles, ...inputProps } = props;
  const customStyles = props.styles || {};
  return (
    <div className={InputWrapper} style={customStyles.inputWrapper}>
      {props.label ? (
        <label className={Label} style={customStyles.label}>
          {props.label}
        </label>
      ) : null}
      <input
        className={InputView} //@todo fix this <-----
        /* innerRef={(r: any) => props.inputRef ? props.inputRef(r) : null} */ style={styles.input}
        {...inputProps}
      />
    </div>
  );
};

export default Input;
