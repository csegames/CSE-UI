/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

//import * as Rest from '../util/RestAPI';
import {getCraftedAbilities} from '../../restapi/RestAPI';

import AbilityComponent from './AbilityComponent';
class Ability {
  id: string;
  icon: string;
  cooldowns: any[] = [];
  duration: number;
  triggerTimeOffset: number;
  name: string;
  tooltip: string;

  abilityComponents: AbilityComponent[];

  buttons: any[] = [];
  awaitingUpdate: { (a: Ability): any }[] = null;

  constructor(ability = <Ability>{}) {
    this.id = ability.id || "";
    this.icon = ability.icon || "";
    this.cooldowns = ability.cooldowns || [];
    this.duration = ability.duration || 0;
    this.triggerTimeOffset = ability.triggerTimeOffset || 0;
    this.name = ability.name || "";
    this.tooltip = ability.tooltip || "";
    this.buttons = ability.buttons || [];
    this.awaitingUpdate = ability.awaitingUpdate || null;
    this.abilityComponents = ability.abilityComponents || <AbilityComponent[]>[];
  }

  public static getAllAbilities(loginToken: string, characterID: string, callback: (abilities: Ability[]) => void) {
    getCraftedAbilities(loginToken, characterID)
      .then((data: Object[]) => {
        if (callback) {
          callback(data.map((o) => new Ability(<Ability>o)));
        }
      })
      .catch((error: Error) => {
        console.log(`error: ${error.message} | response: ${(<any>error).response}`);
      });
  }
}

export default Ability;
