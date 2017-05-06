/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 21:36:18
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-06 18:14:35
 */

import * as React from 'react';

import Label from '../Label';

export interface JobTypeProps {
  job: string;
  changeType: (type: string) => void;
}

export const JobType = (props: JobTypeProps) => {
  const selectType = (el: HTMLSelectElement) => {
    const selected = el.selectedOptions[0].value;
    console.log('CRAFTING: change type to ' + selected);
    props.changeType(selected);
  };
  return (
    <div className='job-type'>
      <Label>Select Job Type</Label>
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => selectType(e.target)}>
        <option></option>
        <option>purify</option>
        <option>refine</option>
        <option>grind</option>
        <option>shape</option>
        <option>block</option>
        <option>make</option>
      </select>
    </div>
  );
};

export default JobType;
