/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 18:19:58
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-13 19:07:58
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import { GlobalState } from '../../services/session/reducer';

export interface NameInputReduxProps {
  dispatch?: (action: any) => void;
  name?: string;
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
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => props.onChange(e.target.value);
  return (
    <div className={['name-input'].join(' ')}>
      <Label>Name</Label>
      <input type='text' size={32} onChange={onChange}/>
    </div>
  );
};

export default connect(select)(NameInput);
