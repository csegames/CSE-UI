/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-07 17:23:14
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-09 21:38:22
 */

import { Module } from 'redux-typed-modules';
import { Template } from '../types';
import { slash, isClient } from '../game/slash';
import { VoxTemplate } from '../game/crafting';

export interface TemplatesState {
  updating: number;
  templates: Template[];
}

export const initialState = () : TemplatesState => {
  return {
    updating: 0,
    templates: [],
  };
};

const module = new Module({
  initialState: initialState(),
  actionExtraData: () => {
    return {
      when: new Date(),
    };
  },
});

export const gotVoxTemplates = module.createAction({
  type: 'crafting/job/got-vox-template',
  action: (templates: VoxTemplate[]) => {
    return { templates };
  },
  reducer: (s, a) => {
    return { templates: a.templates };
  },
});

export default module.createReducer();
