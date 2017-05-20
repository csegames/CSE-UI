/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 21:36:18
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-20 22:16:45
 */

import * as React from 'react';

import Label from '../Label';

export interface JobTypeProps {
  mode: string;
  job: string;
  changeType: (type: string) => void;
  clearJob: () => void;
  refresh: () => void;
  toggle: () => void;
}

export const JobType = (props: JobTypeProps) => {
  const button = (type: string) => {
      return (
        <button className={props.job === type ? 'selected' : ''} onClick={() => props.changeType(type)}>
          {type[0].toUpperCase() + type.substr(1)}
        </button>
      );
  };
  let craftingButtons;
  switch (props.mode) {
    case 'crafting':
      craftingButtons = (
        <div className='job-buttons'>
          {button('purify')}
          {button('refine')}
          {button('grind')}
          {button('shape')}
          {button('block')}
          {button('make')}
          <button className='refresh' onClick={() => props.refresh()}><i className='fa fa-refresh'></i></button>
          <button className='clear' onClick={props.clearJob}>Clear</button>
        </div>
      );
  }
  return (
    <div className='job-type'>
      {craftingButtons}
      { props.mode === 'crafting'
        ? <button className='tools' onClick={props.toggle}>Tools &gt;</button>
        : <button className='crafting' onClick={props.toggle}>&lt; Crafting</button>
      }
    </div>
  );
};

export default JobType;
