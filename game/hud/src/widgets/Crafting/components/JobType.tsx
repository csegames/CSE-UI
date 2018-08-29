/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, cssAphrodite, merge, jobType, JobTypeStyles } from '../styles';
import { GlobalState } from '../services/session/reducer';

import Button from './Button';

interface JobTypeReduxProps {
  dispatch?: (action: any) => void;
  jobType?: string;
  hasIngredients?: boolean;
}

export interface JobTypeProps extends JobTypeReduxProps {
  mode: string;
  changeType: (type: string) => void;
  clearJob: () => void;
  refresh: () => void;
  toggle: () => void;
  style?: Partial<JobTypeStyles>;
}

const select = (state: GlobalState, props: JobTypeProps): JobTypeReduxProps => {
  const job = state.job;
  const hasIngredients = !!(job.ingredients && job.ingredients.length);
  return {
    jobType: state.job.type,
    hasIngredients,
  };
};

export const JobType = (props: JobTypeProps) => {
  const ss = StyleSheet.create(merge({}, jobType, props.style));
  const job = props.jobType;
  const button = (type: string) => {
    const disabled = job && job !== 'invalid' && job !== type;
    const style = {
      button: merge({},
        jobType.button,
        job === type ? jobType.buttonSelected : undefined,
        disabled ? jobType.buttonDisabled : undefined,
    )};
    return (
        <Button style={style}
          disabled={job && job !== 'invalid' && job !== type}
          disableSound={true}
          onClick={() => {
            props.changeType(type);
          }}>
          {type[0].toUpperCase() + type.substr(1)}
        </Button>
    );
  };
  let craftingButtons;
  switch (props.mode) {
    case 'crafting':
      craftingButtons = (
        <div className={cssAphrodite(ss.jobButtons)}>
          {button('purify')}
          {button('grind')}
          {button('shape')}
          {button('block')}
          {button('make')}
          {button('repair')}
          {button('salvage')}
          <Button style={{ button: jobType.refresh }} onClick={() => props.refresh()}>
            <i className='fa fa-refresh'></i>
          </Button>
          <Button onClick={props.clearJob} disabled={props.hasIngredients}>Clear</Button>
        </div>
      );
  }
  return (
    <div className={cssAphrodite(ss.jobType)}>
      {craftingButtons}
      { props.mode === 'crafting'
        ? <Button style={{ button: jobType.tools }} onClick={props.toggle}>Tools &gt;</Button>
        : <Button style={{ button: jobType.crafting }} onClick={props.toggle}>&lt; Crafting</Button>
      }
    </div>
  );
};

export default connect(select)(JobType);
