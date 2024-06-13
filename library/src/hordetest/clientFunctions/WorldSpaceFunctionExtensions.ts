/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { Binding } from '../../_baseGame/types/Keybind';
import { ArrayMap } from '../../_baseGame/types/ObjectMap';
import { VoiceChatMemberStatus } from '../../_baseGame/types/VoiceChatMemberSettings';
import { BaseEntityStateModel, EntityResource, WorldUIPositionMapModel } from '../game/GameClientModels/EntityState';
import { CharacterKind } from '../game/types/CharacterKind';
import { HealthBarKind } from '../game/types/HealthBarKind';
import { ItemGameplayType } from '../game/types/ItemGameplayType';
import { LifeState } from '../game/types/LifeState';

export type DamageTextListener = (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string
) => void;

export type HealthBarListener = (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  name: string,
  kind: HealthBarKind,
  voiceChatStatus: VoiceChatMemberStatus,
  voiceChatVolume: number,
  barColor: number,
  isShielded: boolean,
  healthBarIcon: string,
  rank: CharacterKind,
  lifeState: LifeState,
  deathStartTime: number,
  downedStateEndTime: number,
  bindingName: string,
  bindingIconClass: string,
  reviveRange: number,
  worldTime: number,
  hideReviveBar: boolean,
  resources: ArrayMap<EntityResource>
) => void;

export type InteractableListener = (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  name: string,
  description: string,
  gameplayType: ItemGameplayType
) => void;

export type InteractionBarListener = (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  name: string,
  description: string,
  gameplayType: ItemGameplayType,
  title: string,
  progress?: number,
  keybind?: Binding
) => void;

export type ObjectiveListener = (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  currentWorldTime: number,
  entityState: BaseEntityStateModel
) => void;

export type WorldUIPositionMapUpdatedListener = (newMap: WorldUIPositionMapModel) => void;

export interface WorldSpaceFunctionExtensions {
  bindDamageTextListener(onUpdateDamageText: DamageTextListener): ListenerHandle;
  bindHealthBarListener(onHealthBarUpdate: HealthBarListener): ListenerHandle;
  bindInteractableListener(onUpdateInteractable: InteractableListener): ListenerHandle;
  bindInteractionBarListener(onInteractionBarUpdate: InteractionBarListener): ListenerHandle;
  bindObjectiveListener(onObjectiveUpdate: ObjectiveListener): ListenerHandle;
  bindWorldUIPositionMapUpdatedListener(onWorldUIPositionMapUpdate: WorldUIPositionMapUpdatedListener): ListenerHandle;
}

class CoherentWorldSpaceFunctions implements WorldSpaceFunctionExtensions {
  bindDamageTextListener(onUpdateDamageText: DamageTextListener): ListenerHandle {
    const innerHandle = engine.on('updateDamageText', onUpdateDamageText);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
  bindHealthBarListener(onHealthBarUpdate: HealthBarListener): ListenerHandle {
    const innerHandle = engine.on('updateHealthBar', onHealthBarUpdate);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
  bindInteractableListener(onInteractableUpdate: InteractableListener): ListenerHandle {
    const innerHandle = engine.on('updateInteractable', onInteractableUpdate);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
  bindInteractionBarListener(onInteractionBarUpdate: InteractionBarListener): ListenerHandle {
    const innerHandle = engine.on('updateInteractionBar', onInteractionBarUpdate);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
  bindObjectiveListener(onObjectiveUpdate: ObjectiveListener): ListenerHandle {
    const innerHandle = engine.on('updateObjective', onObjectiveUpdate);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
  bindWorldUIPositionMapUpdatedListener(onWorldUIPositionMapUpdate: WorldUIPositionMapUpdatedListener): ListenerHandle {
    const innerHandle = engine.on('updateWorldUIPositionMap', onWorldUIPositionMapUpdate);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
}

class BrowserWorldSpaceFunctions implements WorldSpaceFunctionExtensions {
  bindDamageTextListener(onUpdateDamageText: DamageTextListener): ListenerHandle {
    return { close() {} };
  }
  bindHealthBarListener(onHealthBarUpdate: HealthBarListener): ListenerHandle {
    return { close() {} };
  }
  bindInteractableListener(onInteractableUpdate: InteractableListener): ListenerHandle {
    return { close() {} };
  }
  bindInteractionBarListener(onInteractionBarUpdate: InteractionBarListener): ListenerHandle {
    return { close() {} };
  }
  bindObjectiveListener(onObjectiveUpdate: ObjectiveListener): ListenerHandle {
    return { close() {} };
  }
  bindWorldUIPositionMapUpdatedListener(onWorldUIPositionMapUpdate: WorldUIPositionMapUpdatedListener): ListenerHandle {
    return { close() {} };
  }
}

export const impl: WorldSpaceFunctionExtensions = engine.isAttached
  ? new CoherentWorldSpaceFunctions()
  : new BrowserWorldSpaceFunctions();
