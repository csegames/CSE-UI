/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import abilityTags from '../constants/abilityConstants/abilityTags';
import componentType from '../constants/abilityConstants/componentType';
import componentPath from '../constants/abilityConstants/componentPath';
import componentSubType from '../constants/abilityConstants/componentSubType';
import componentBranchState from '../constants/abilityConstants/componentBranchState';
import stats from './Stats';

export class ComponentBranch {
    parts: any[];
    state: componentBranchState;
}

export interface ComponentSlot {
    type: componentType;
    subType: componentSubType;
    x: number;
    y: number;
    parents: ComponentSlot[];
    children: ComponentSlot[];
    branch: ComponentBranch;
    component: AbilityComponent;
    isDisabled: boolean;
    tooltip: string;
    originalSubType: componentSubType; 
    queuedAnimation: string;
}

export class AbilityComponent {

  cooldown: number;
  duration: number;
  tooltip: string;
  id: string;
  baseComponentID: number;
  name: string;
  description: string;
  icon: string;
  type: componentType;
  subType: componentSubType;
  path: componentPath;
  abillityStats: stats; //TODO use Stats from Character ?ß
  abilityTags: abilityTags[];
  //tagConstraints: Array<TagConstraint>;
  slot: ComponentSlot;
  rank: number;
  isTrained: boolean;
  isHalted: boolean;
    
    

  constructor(abilityComponent = <AbilityComponent>{}) {
    this.id = abilityComponent.id || "";
    this.icon = abilityComponent.icon || "";
    this.cooldown = abilityComponent.cooldown || 0;
    this.duration = abilityComponent.duration || 0;
    this.name = abilityComponent.name || "";
    this.tooltip = abilityComponent.tooltip || "";
    this.abilityTags = abilityComponent.abilityTags || <abilityTags[]>[];
      //....

  }

  static create() {
    let a = new AbilityComponent();
    return a;
  }

}

export default AbilityComponent;
