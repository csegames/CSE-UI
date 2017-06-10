/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 18:19:58
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-24 19:55:40
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import Input from '../Input';
import { GlobalState } from '../../services/session/reducer';
import { StyleSheet, css, merge, nameInput, NameInputStyles } from '../../styles';

export interface NameInputReduxProps {
  dispatch?: (action: any) => void;
  name?: string;
  style?: Partial<NameInputStyles>;
}

export interface NameInputProps extends NameInputReduxProps {
  onChange: (name: String) => void;
}

interface NameInputState {}

const select = (state: GlobalState, props: NameInputProps) : NameInputReduxProps => {
  return {
    name: state.job.name,
  };
};

const NameInput = (props: NameInputProps) => {
  const ss = StyleSheet.create(merge({}, nameInput, props.style));
  return (
    <div className={'name-input ' + css(ss.container)}>
      <Label style={{container: nameInput.label}}>Name</Label>
      <Input size={32} onChange={props.onChange} value={props.name}/>
    </div>
  );
};

export default connect(select)(NameInput);
