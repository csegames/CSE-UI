/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActiveEffectAction } from './ActiveEffectAction';
import { AbilityTrackFlags } from './AbilityTypes';

export interface CombatEvent {
  fromName: string;
  fromFaction: any;

  toName: string;
  toFaction: any;
  // damage against an abilities disruption health, high enough disruption damage causes and interrupt
  disruption?: {
    sent: number;
    received: number;
    tracksInterrupted?: AbilityTrackFlags;
    source: string;
  };

  // Array of statuses
  statuses?: {
    name: string;
    action: any;
    duration: number;
    statusID: number;
  }[];

  // resources spent or gained
  resources?: {
    amount: number;
    resourceNumericID: number;
    damageTypeNumericID: number;
  }[];

  // impulse = knock back or a force applied to your character
  impulse?: {
    sent: number;
    received: number;
  };

  activeEffects?: {
    name: string;
    action: ActiveEffectAction;
    duration: string;
  }[];

  errors?: {
    msg: string;
  }[];
}
