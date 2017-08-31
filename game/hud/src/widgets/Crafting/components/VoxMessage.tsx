/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 20:52:19
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-08-31 20:53:01
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css, merge, voxMessage, VoxMessageStyles } from '../styles';
import { GlobalState } from '../services/session/reducer';
import { Message } from '../services/types';
import ProgressBar from './ProgressBar';

export interface VoxMessageReduxProps {
  dispatch?: (action: any) => void;
  message?: Message;
  total?: number;
  remaining?: number;
  status?: string;
  style?: Partial<VoxMessageStyles>;
}

export interface VoxMessageProps extends VoxMessageReduxProps {}

const select = (state: GlobalState, props: VoxMessageProps) : VoxMessageReduxProps => {
  return {
    message: state.job.message,
    status: state.job.status,
    total: state.job.totalCraftingTime,
    remaining: state.ui.remaining,
  };
};

const VoxMessage = (props: VoxMessageProps) => {
  const ss = StyleSheet.create(merge({}, voxMessage, props.style));
  const { message, total, remaining, status } = props;
  return (
    <div className={(message ? css(ss.voxMessage, ss[message.type]) : css(ss.voxMessage))}>
      <div>{message && message.message}</div>
      { status === 'Running'
        ? <ProgressBar
            total={total}
            current={remaining}
            color='lime'
            />
        : undefined
      }
    </div>
  );
};

export default connect(select)(VoxMessage);
