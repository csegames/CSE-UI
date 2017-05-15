/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-15 16:21:40
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-15 17:03:10
 */


import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import { GlobalState } from '../../services/session/reducer';

export interface QuantityInputReduxProps {
  dispatch?: (action: any) => void;
  count?: number;
}

export interface QuantityInputProps extends QuantityInputReduxProps {
  onChange: (count: number) => void;
}

interface QuantityInputState {}

const select = (state: GlobalState, props: QuantityInputProps) : QuantityInputReduxProps => {
  return {
    count: state.job.count,
  };
};

const QuantityInput = (props: QuantityInputProps) => {
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    props.onChange(((e.target as HTMLInputElement).value as any) | 0);
  return (
    <div className={['quality-input'].join(' ')}>
      <Label>Quantity</Label>
      <input type='text' size={3} onBlur={onBlur}/>
    </div>
  );
};

export default connect(select)(QuantityInput);
