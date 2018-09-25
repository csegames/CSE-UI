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
  public parts: any[];
  public state: componentBranchState;
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

  public cooldown: number;
  public duration: number;
  public tooltip: string;
  public id: string;
  public baseComponentID: number;
  public name: string;
  public description: string;
  public icon: string;
  public type: componentType;
  public subType: componentSubType;
  public path: componentPath;
  public abillityStats: stats; // TODO use Stats from Character ?�
  public abilityTags: abilityTags[];
  // tagConstraints: Array<TagConstraint>;
  public slot: ComponentSlot;
  public rank: number;
  public isTrained: boolean;
  public isHalted: boolean;


  constructor(abilityComponent = <AbilityComponent> {}) {
    this.id = abilityComponent.id || '';
    this.icon = abilityComponent.icon || '';
    this.cooldown = abilityComponent.cooldown || 0;
    this.duration = abilityComponent.duration || 0;
    this.name = abilityComponent.name || '';
    this.tooltip = abilityComponent.tooltip || '';
    this.abilityTags = abilityComponent.abilityTags || <abilityTags[]> [];
    // ....

  }

  public static create() {
    const a = new AbilityComponent();
    return a;
  }

}

export default AbilityComponent;
