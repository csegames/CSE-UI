/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  interface CombatEvent {
    fromName: string;
    fromFaction: any;

    toName: string;
    toFaction: any;

    damages?: {
      sent: number;
      received: number;
      part: BodyPart;
      type: DamageType;
    }[];

    // damage against an abilities disruption health, high enough disruption damage causes and interrupt
    disruption?: {
      sent: number;
      received: number;
      tracksInterrupted?: AbilityTrack;
      source: string;
    };

    heals?: {
      sent: number;
      received: number;
      part: BodyPart;
    }[];

    // Array of statuses
    statuses?: {
      name: string;
      action: any;
      duration: number;
    }[];

    // Array of body Part ids that received a cure, ie [1, 1, 2] = 2 cures on body part 1 and 1 cure ont body part 2
    cures?: BodyPart[];

    // resources spent or gained
    resources?: {
      sent: number;
      received: number;
      type: any;
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
}
