/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ActiveEffectAction } from './ActiveEffectAction';
import { AbilityTrackFlags } from './AbilityTypes';

// keep in sync with UIBindings.cpp CoherentBind(netmessages::CombatLogMessage*)
export interface CombatEvent {
  fromName: string;
  fromFaction: any;

  toName: string;
  toFaction: any;

  // def ID of the instigating status or ability
  source?: string;
  // set when this event killed the subject
  kill?: boolean;
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

  // gathering results, one entry per granted item stack
  harvests?: {
    track: string;
    progressChange: number;
    currentProgress: number;
    maxProgress: number;
    item: string; // display name of the rewarded item def
    unitCount: number;
    quality: number; // whole number
  }[];

  activeEffects?: {
    name: string;
    action: ActiveEffectAction;
    duration: string;
  }[];

  errors?: {
    msg: string;
  }[];
}
