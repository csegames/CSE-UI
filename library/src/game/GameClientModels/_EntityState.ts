/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface EntityStateModel {
  faction: Faction;
  entityID: string;
  name: string;
  isAlive: boolean;

  /**
   * Players coordinates in world space.
   */
  position?: {
    x: number;
    y: number;
    z: number;
  };

  // status -- null / undefined if no status on entity
  statuses?: {
    id: number;
    duration: number;
  }[];
}

function defaultEntityStateModel(): EntityStateModel {
  return {
    faction: Faction.Factionless,
    entityID: '',
    name: 'unknown',
    isAlive: false,
  };
}


export interface PlayerStateModel extends EntityStateModel {
  type: 'player';
  race: Race;
  gender: Gender;
  class: Archetype;
  // health per body part, ordered according to the bodyParts enum found
  // in ../constants/bodyParts.ts -- TODO: use an enum from C# generated
  // through webAPI definitions.ts file
  health: Health[];
  stamina: CurrentMax;
  blood: CurrentMax;
  // An EntityState object for the entity this Character is in control of, ie
  // a siege engine, a vehicle, a creature, ect..
  controllingEntityState?: AnyEntityStateModel;
}

export function defaultHealth() {
  return {
    current: 1000,
    max: 1000,
    wounds: 0,
  };
}

export function defaultStamAndBlood() {
  return {
    current: 1000,
    max: 1000,
  };
}

export function defaultPlayerStateModel(): PlayerStateModel {
  return {
    ...defaultEntityStateModel(),
    type: 'player',
    race: Race.HumanMaleA,
    gender: Gender.None,
    class: Archetype.Blackguard,
    health: [defaultHealth(),defaultHealth(),defaultHealth(),defaultHealth(),defaultHealth(),defaultHealth()],
    stamina: defaultStamAndBlood(),
    blood: defaultStamAndBlood(),
  };
}

export interface SiegeStateModel extends EntityStateModel {
  type: 'siege';
  health: {
    current: number;
    max: number;
  };
}

export type AnyEntityStateModel = Readonly<PlayerStateModel> | Readonly<SiegeStateModel>;

export function defaultSiegeStateModel(): SiegeStateModel {
  return {
    ...defaultEntityStateModel(),
    type: 'siege',
    health: defaultHealth(),
  };
}
