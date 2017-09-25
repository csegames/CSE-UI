/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-15 16:21:40
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-08-31 20:52:11
 */


import * as React from 'react';
import { connect } from 'react-redux';
import Label from './Label';
import Input from './Input';
import { GlobalState } from '../services/session/reducer';
import { StyleSheet, css, merge, quantityInput } from '../styles';

export interface QuantityInputReduxProps {
  dispatch?: (action: any) => void;
  count?: number;
  disabled?: boolean;
  style?: Partial<QuantityInputState>;
}

export interface QuantityInputProps extends QuantityInputReduxProps {
  onChange: (count: number) => void;
}

interface QuantityInputState {}

const select = (state: GlobalState, props: QuantityInputProps): QuantityInputReduxProps => {
  return {
    count: state.job.itemCount,
  };
};

const QuantityInput = (props: QuantityInputProps) => {
  const ss = StyleSheet.create(merge({}, quantityInput, props.style));
  return (
    <div className={css(ss.quantityInput)} style={ props.disabled ? { opacity: 0.1 } : {} }>
      <Label style={{ label: quantityInput.label }}>Quantity</Label>
      <Input
        name='quantity'
        style={{ input: quantityInput.input }}
        disabled={props.disabled}
        numeric={true} min={1} max={20}
        size={2}
        onChange={(value: string) => props.onChange((value as any) | 0)}
        value={props.count ? props.count.toString() : ''}
        />
    </div>
  );
};

export default connect(select)(QuantityInput);
