/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-16 18:52:22
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-10 22:56:23
 */


import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import { GlobalState, JobState } from '../../services/session/reducer';

import { StyleSheet, css, merge, voxInfo, VoxInfoStyles } from '../../styles';

export interface VoxInfoReduxProps {
  dispatch?: (action: any) => void;
  job?: JobState;
  style?: Partial<VoxInfoStyles>;
}

export interface VoxInfoProps extends VoxInfoReduxProps {}
interface VoxInfoState {}

const select = (state: GlobalState, props: VoxInfoProps) : VoxInfoReduxProps => {
  return {
    job: state.job,
  };
};

const VoxInfo = (props: VoxInfoProps) => {
  const ss = StyleSheet.create(merge({}, voxInfo, props.style));
  return (
    <div className={'vox-info ' + css(ss.container)}>
      <span className={css(ss.span)}>{props.job.status}</span>
      <span className={css(ss.span)}>{props.job.type}</span>
      <span className={css(ss.span)}>{props.job.started}</span>
      <span className={css(ss.span)}>{props.job.endin}</span>
      <span className={css(ss.span)}>{props.job.recipe && props.job.recipe.id}</span>
      <span className={css(ss.span)}>{props.job.template && props.job.template.id}</span>
      <span className={css(ss.span)}>{props.job.name}</span>
      <span className={css(ss.span)}>{props.job.quality}</span>
      <span className={css(ss.span)}>{props.job.count}</span>
    </div>
  );
};

export default connect(select)(VoxInfo);
