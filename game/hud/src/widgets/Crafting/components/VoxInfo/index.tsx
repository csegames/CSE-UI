/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-16 18:52:22
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-16 19:00:07
 */


import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import { GlobalState, JobState } from '../../services/session/reducer';

export interface VoxInfoReduxProps {
  dispatch?: (action: any) => void;
  job?: JobState;
}

export interface VoxInfoProps extends VoxInfoReduxProps {}
interface VoxInfoState {}

const select = (state: GlobalState, props: VoxInfoProps) : VoxInfoReduxProps => {
  return {
    job: state.job,
  };
};

const VoxInfo = (props: VoxInfoProps) => {
  return (
    <div className='vox-info'>
      <span>vox: {props.job.vox}</span>
      <span>status: {props.job.status}</span>
      <span>type: {props.job.type}</span>
      <span>loading: {props.job.loading}</span>
      <span>ready: {props.job.ready}</span>
      <span>recipe: {props.job.recipe && props.job.recipe.id}</span>
      <span>template: {props.job.template && props.job.template.id}</span>
      <span>quality: {props.job.quality}</span>
      <span>name: {props.job.name}</span>
      <span>count: {props.job.count}</span>
    </div>
  );
};

export default connect(select)(VoxInfo);
