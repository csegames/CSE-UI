/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 18:19:58
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-11 19:58:12
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Label from '../Label';
import Input from '../Input';
import { GlobalState } from '../../services/session/reducer';
import { StyleSheet, css, merge, qualityInput, QualityInputStyles } from '../../styles';

export interface QualityInputReduxProps {
  dispatch?: (action: any) => void;
  quality?: number;
  disabled?: boolean;
  style?: Partial<QualityInputStyles>;
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
  const ss = StyleSheet.create(merge({}, qualityInput, props.style));
  return (
    <div className={'quality-input ' + css(ss.container)} style={ props.disabled ? { opacity: 0.1 } : {} }>
      <Label style={{ container: qualityInput.label }}>Quality</Label>
      <Input
        name='quality'
        numeric={true} min={1} max={100}
        style={{input: qualityInput.input}}
        disabled={props.disabled}
        size={3}
        onChange={(value: string) => props.onChange((value as any) | 0)}
        value={props.quality ? props.quality.toString() : ''}
        />
      <span>%</span>
    </div>
  );
};

export default connect(select)(QualityInput);
