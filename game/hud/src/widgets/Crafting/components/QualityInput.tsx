/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Label from './Label';
import Input from './Input';
import { GlobalState } from '../services/session/reducer';
import { StyleSheet, cssAphrodite, merge, qualityInput, QualityInputStyles } from '../styles';

export interface QualityInputReduxProps {
  dispatch?: (action: any) => void;
  quality?: number;
  disabled?: boolean;
  style?: Partial<QualityInputStyles>;
}

export interface QualityInputProps extends QualityInputReduxProps {
  onChange: (quality: number) => void;
}

const select = (state: GlobalState, props: QualityInputProps): QualityInputReduxProps => {
  return {
    quality: state.job.quality,
  };
};

const QualityInput = (props: QualityInputProps) => {
  const ss = StyleSheet.create(merge({}, qualityInput, props.style));
  return (
    <div className={cssAphrodite(ss.qualityInput)} style={ props.disabled ? { opacity: 0.3 } : {} }>
      <Label style={{ label: qualityInput.label }}>Quality</Label>
      <Input
        name='quality'
        numeric={true} min={1} max={100}
        style={{ input: qualityInput.input }}
        disabled={props.disabled}
        size={3}
        onChange={(value: string) => props.onChange((value as any) | 0)}
        value={props.quality ? props.quality.toString() : ''}
        />
      <span>&nbsp;%</span>
    </div>
  );
};

export default connect(select)(QualityInput);
