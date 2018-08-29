/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState, JobState } from '../services/session/reducer';

import { StyleSheet, cssAphrodite, merge, voxInfo, VoxInfoStyles } from '../styles';

export interface VoxInfoReduxProps {
  dispatch?: (action: any) => void;
  job?: JobState;
  style?: Partial<VoxInfoStyles>;
}

export interface VoxInfoProps extends VoxInfoReduxProps {}

const select = (state: GlobalState, props: VoxInfoProps): VoxInfoReduxProps => {
  return {
    job: state.job,
  };
};

const VoxInfo = (props: VoxInfoProps) => {
  const ss = StyleSheet.create(merge({}, voxInfo, props.style));
  return (
    <div className={cssAphrodite(ss.voxInfo)}>
      <span className={cssAphrodite(ss.span)}>{props.job.status}</span>
      <span className={cssAphrodite(ss.span)}>{props.job.type}</span>
      <span className={cssAphrodite(ss.span)}>{props.job.started}</span>
      <span className={cssAphrodite(ss.span)}>{props.job.totalCraftingTime}</span>
      <span className={cssAphrodite(ss.span)}>{props.job.recipe && props.job.recipe.id}</span>
      <span className={cssAphrodite(ss.span)}>{props.job.name}</span>
      <span className={cssAphrodite(ss.span)}>{props.job.quality}</span>
      <span className={cssAphrodite(ss.span)}>{props.job.itemCount}</span>
    </div>
  );
};

export default connect(select)(VoxInfo);
