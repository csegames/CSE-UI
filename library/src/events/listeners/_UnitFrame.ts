/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import EventEmitter from '../classes/EventEmitter';
import Combatant from '../../core/classes/Combatant';
import Player from '../../core/classes/Player';
import race from '../../core/constants/race';
import client from '../../core/client';

function run(emitter: EventEmitter, topic: string) {
  const info: any = {};
  let instance: Combatant;

  // Event receivers
  function nameChanged(name: string) {
    if (name === "") {
      instance.reset();             // reset if no target
    }
    instance.setName(name);
    emitter.emit(topic, instance);
  }

  function raceChanged(race: race) {
    instance.setRace(race);
    emitter.emit(topic, instance);
  }

  function healthChanged(health: number, maxHealth: number) {
    instance.setHealth(health, maxHealth);
    emitter.emit(topic, instance);
  }

  function staminaChanged(stamina: number, maxStamina: number) {
    instance.setStamina(stamina, maxStamina);
    emitter.emit(topic, instance);
  }

  function injuriesChanged(part: number, health: number, maxHealth: number, wounds: number) {
    if (instance.name) {
      instance.setInjury(part, health, maxHealth, wounds);
      emitter.emit(topic, instance);
    }
  }

  // Hook up event receivers to the relevant cuAPI methods
  switch (topic) {
    case 'character':
      instance = new Player(<Player>{});
      client.OnCharacterNameChanged(nameChanged);
      client.OnCharacterRaceChanged(raceChanged);
      client.OnCharacterHealthChanged(healthChanged);
      client.OnCharacterStaminaChanged(staminaChanged);
      client.OnCharacterInjuriesChanged(injuriesChanged);
      break;
    case 'enemytarget':
      instance = new Combatant(<Combatant>{});
      client.OnEnemyTargetNameChanged(nameChanged);
      client.OnEnemyTargetHealthChanged(healthChanged);
      client.OnEnemyTargetStaminaChanged(staminaChanged);
      client.OnEnemyTargetInjuriesChanged(injuriesChanged);
      break;
    case 'friendlytarget':
      instance = new Combatant(<Combatant>{});
      client.OnFriendlyTargetNameChanged(nameChanged);
      client.OnFriendlyTargetHealthChanged(healthChanged);
      client.OnFriendlyTargetStaminaChanged(staminaChanged);
      client.OnFriendlyTargetInjuriesChanged(injuriesChanged);
      break;
  }
}

export default class UnitFrameListener {
  listening: boolean = false;
  topic: string;
  constructor(handles: any) {
    this.topic = handles.topic;
  }
  start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
