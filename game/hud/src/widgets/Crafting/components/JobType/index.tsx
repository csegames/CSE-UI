/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 21:36:18
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-11 12:57:25
 */

import * as React from 'react';
import { StyleSheet, css, merge, jobType, JobTypeStyles } from '../../styles';

import Label from '../Label';
import Button from '../Button';

export interface JobTypeProps {
  mode: string;
  job: string;
  changeType: (type: string) => void;
  clearJob: () => void;
  refresh: () => void;
  toggle: () => void;
  style?: Partial<JobTypeStyles>;
}

export const JobType = (props: JobTypeProps) => {
  const ss = StyleSheet.create(merge({}, jobType, props.style));
  const button = (type: string) => {
      return (
        <Button style={props.job === type ? {container:jobType.buttonSelected} : {}}
          disabled={props.job && props.job !== type}
          onClick={() => props.changeType(type)}>
          {type[0].toUpperCase() + type.substr(1)}
        </Button>
      );
  };
  let craftingButtons;
  switch (props.mode) {
    case 'crafting':
      craftingButtons = (
        <div className={css(ss.jobButtons)}>
          {button('purify')}
          {button('refine')}
          {button('grind')}
          {button('shape')}
          {button('block')}
          {button('make')}
          {button('repair')}
          <Button style={{container: jobType.refresh}} onClick={() => props.refresh()}>
            <i className='fa fa-refresh'></i>
          </Button>
          <Button onClick={props.clearJob}>Clear</Button>
        </div>
      );
  }
  return (
    <div className={'job-type ' + css(ss.container)}>
      {craftingButtons}
      { props.mode === 'crafting'
        ? <Button style={{container: jobType.tools}} onClick={props.toggle}>Tools &gt;</Button>
        : <Button style={{container: jobType.crafting}} onClick={props.toggle}>&lt; Crafting</Button>
      }
    </div>
  );
};

export default JobType;
