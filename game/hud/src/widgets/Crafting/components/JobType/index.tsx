/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 21:36:18
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-11 23:55:15
 */

import * as React from 'react';

import Label from '../Label';

export interface JobTypeProps {
  job: string;
  changeType: (type: string) => void;
}

export const JobType = (props: JobTypeProps) => {
  const button = (type: string) => {
      return (
        <button className={props.job === type ? 'selected' : ''} onClick={() => props.changeType(type)}>
          {type[0].toUpperCase() + type.substr(1)}
        </button>
      );
  };
  return (
    <div className='job-type'>
      {button('purify')}
      {button('refine')}
      {button('grind')}
      {button('shape')}
      {button('block')}
      {button('make')}
    </div>
  );
};

export default JobType;
