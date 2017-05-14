/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 18:19:58
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-14 21:52:18
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Label from '../Label';
import Input from '../Input';
import { GlobalState } from '../../services/session/reducer';

export interface QualityInputReduxProps {
  dispatch?: (action: any) => void;
  quality?: number;
}

export interface QualityInputProps extends QualityInputReduxProps {
  onChange: (quality: number) => void;
}

interface QualityInputState {}

const select = (state: GlobalState, props: QualityInputProps) : QualityInputReduxProps => {
  return {
    quality: state.job.quality,
  };
};

const QualityInput = (props: QualityInputProps) => {
  const onChange = (value: string) => {
    props.onChange(value as any);
  };
  return (
    <div className={['quality-input'].join(' ')}>
      <Label>Quality</Label>
      <Input size={3} onChange={onChange}/>
    </div>
  );
};

export default connect(select)(QualityInput);
