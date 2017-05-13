/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-07 17:23:14
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-13 22:32:33
 */

import { Module } from 'redux-typed-modules';
import { Template } from '../types';
import { slash } from '../game/slash';

export interface TemplatesState {
  updating: number;
  armour: Template[];
  weapons: Template[];
}

const initialState = () : TemplatesState => {
  console.log('CRAFTING: generate initialTemplateState');
  return {
    updating: 0,
    armour: [],
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
      case 'armour':
      case 'weapons':
      console.log('CRAFTING: ' + type, a.templates);
      return Object.assign(s, { [type]: [...a.templates] });
    }
    console.error('CRAFTING: illegal template type ' + type);
    return s;
  },
});

// Templates

export const templateTypes = [
  'armour', 'weapons',
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
  slash('cr list ' + what + 'templates', (response: any) => {
    console.log('CRAFTING: templates ', what, response.type, response.list);
    gotTemplate(what, response.list);
    return false;
  });
  // TODO how to capture response
  callback(what, dummyTemplates[what]);
}

export function getAllTemplates(callback: (type: string, templates: Template[]) => void) {
  const done = (type: string, list: Template[]) => callback(type, list);
  templateTypes.forEach((type: string) => getTemplateFor(type, done));
  return templateTypes.length;
}

export default module.createReducer();
