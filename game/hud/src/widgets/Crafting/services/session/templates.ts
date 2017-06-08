/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-07 17:23:14
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-08 21:54:13
 */

import { Module } from 'redux-typed-modules';
import { Template } from '../types';
import { slash, isClient } from '../game/slash';
import { VoxTemplate } from '../game/crafting';

export interface TemplatesState {
  updating: number;
  armor: Template[];
  weapons: Template[];
}

export const initialState = () : TemplatesState => {
  return {
    updating: 0,
    armor: [],
    weapons: [],
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
    const armor = a.templates.filter((template: VoxTemplate) => template.id.indexOf('Armor') > -1);
    const weapons = a.templates.filter((template: VoxTemplate) => template.id.indexOf('Weapon') > -1);
    return { armor, weapons };
  },
});


// {depricated}
export const gotTemplate = module.createAction({
  type: 'crafting/templates/got-templates',
  action: (templateType: string, templates: Template[]) => {
    return { templateType, templates };
  },
  reducer: (s, a) => {
    const type = a.templateType;
    switch (type) {
      case 'armor':
      case 'weapons':
      return { [type]: a.templates };
    }
    console.error('CRAFTING: illegal template type ' + type);
    return {};
  },
});

// Templates

// {depricated}
export const templateTypes = [
  'armor', 'weapons',
  'substences', 'inventory', 'blocks',
];

// TESTING: Dummy Templates

// {depricated}
const dummyTemplates = {
  armor: [
    { id: 1, name: 'Silly Hat of Awesomness' },
    { id: 2, name: 'Big Boots of Buffalo Hide' },
  ],
  weapons: [
    { id: 3, name: 'Big Sword of Jobber' },
    { id: 4, name: 'Small Kife of Sneakyness' },
  ],
};

// {depricated}
export function getTemplateFor(what: string, callback: (type: string, list: Template[]) => void) {
  if (!isClient()) {
    callback(what, dummyTemplates[what]);    // no cuAPI, simulation
  } else {
    slash('cr list ' + what, (response: any) => {
      switch (response.type) {
        case 'templates':
          const list: Template[] = response.templates.map((id: string) => { return { id, name: id }; });
          callback(what, list);
          break;
      }
    });
  }
}

// {depricated}
export function getAllTemplates(callback: (type: string, templates: Template[]) => void) {
  const queue = [ 'armor', 'weapons' ];
  function nom() {
    const what = queue.shift();
    if (what) {
      getTemplateFor(what, (type: string, templates: Template[]) => {
        callback(type, templates);
        nom();
      });
    }
  }
  nom();
}

export default module.createReducer();
