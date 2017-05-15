/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 20:52:19
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-15 06:54:18
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import { GlobalState } from '../../services/session/reducer';
import { Message } from '../../services/types';

export interface VoxMessageReduxProps {
  dispatch?: (action: any) => void;
  message?: Message;
}

export interface VoxMessageProps extends VoxMessageReduxProps {}
interface VoxMessageState {}

const select = (state: GlobalState, props: VoxMessageProps) : VoxMessageReduxProps => {
  return {
    message: state.job.message,
  };
};

const VoxMessage = (props: VoxMessageProps) => {
  return (
    <div className={['vox-message', props.message ? props.message.type : 'none'].join(' ')}>
      {props.message && props.message.message}
    </div>
  );
};

export default connect(select)(VoxMessage);
