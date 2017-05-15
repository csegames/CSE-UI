/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-07 17:23:14
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-15 06:24:58
 */

import { Module } from 'redux-typed-modules';
import { Template } from '../types';
import { slash, isClient } from '../game/slash';

export interface TemplatesState {
  updating: number;
  armor: Template[];
  weapons: Template[];
}

const initialState = () : TemplatesState => {
  console.log('CRAFTING: generate initialTemplateState');
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

export const updatingTemplates = module.createAction({
  type: 'crafting/templates/updating',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    console.log('CRAFTING: updating ' + Date.now());
    return Object.assign(s, { updating: Date.now() });
  },
});

export const updatedTemplates = module.createAction({
  type: 'crafting/templates/updated',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    console.log('CRAFTING: finished updating');
    return Object.assign(s, { updating: 0 });
  },
});

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
      console.log('CRAFTING: ' + type + ' ' + JSON.stringify(a.templates));
      return Object.assign(s, { [type]: [...a.templates] });
    }
    console.error('CRAFTING: illegal template type ' + type);
    return s;
  },
});

// Templates

export const templateTypes = [
  'armor', 'weapons',
  'substences', 'inventory', 'blocks',
];

// TESTING: Dummy Templates

const dummyTemplates = {
  armour: [
    { id: 1, name: 'Silly Hat of Awesomness' },
    { id: 2, name: 'Big Boots of Buffalo Hide' },
  ],
  weapons: [
    { id: 1, name: 'Big Sword of Jobber' },
    { id: 2, name: 'Small Kife of Sneakyness' },
  ],
};

export function getTemplateFor(what: string, callback: (type: string, list: Template[]) => void) {
  if (!isClient()) {
    callback(what, dummyTemplates[what]);    // no cuAPI, simulation
  } else {
    slash('cr list ' + what, (response: any) => {
      console.log('CRAFTING: GOT ' + what + ' TEMPLATES: ' + JSON.stringify(response));
      switch (response.type) {
        case 'templates':
          const list: Template[] = response.templates.map((id: string) => { return { id, name: id }; });
          callback(what, list);
          break;
      }
    });
  }
}

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
