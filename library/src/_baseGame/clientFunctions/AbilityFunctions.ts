/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { AbilityEditStatus, AbilityGroup, AbilityStatus, ButtonLayout } from '../types/AbilityTypes';

export type AbilityActivatedListener = (abilityID: number) => void;
export type AbilityEditStatusListener = (status: AbilityEditStatus) => void;
export type AbilityGroupUpdatedListener = (group: AbilityGroup) => void;
export type AbilityGroupDeletedListener = (groupID: number) => void;
export type AbilityStatusUpdatedListener = (status: AbilityStatus) => void;
export type ButtonLayoutUpdatedListener = (layout: ButtonLayout) => void;
export type ButtonLayoutDeletedListener = (layoutID: number) => void;

// client -> UI (see UIEvents.h)
const abilityActivatedEventName = 'ability.activated';
const editChangedEventName = 'ability.editChanged';
const layoutUpdatedEventName = 'ability.layoutUpdated';
const layoutDeletedEventName = 'ability.layoutDeleted';
const groupUpdatedEventName = 'ability.groupUpdated';
const groupDeletedEventName = 'ability.groupDeleted';
const statusUpdatedEventName = 'ability.statusUpdated';
// UI -> client (see UIViewListener.cpp)
const createLayoutCallbackName = 'ability.CreateButtons';
const deleteLayoutCallbackName = 'ability.DeleteButtons';
const selectGroupCallbackName = 'ability.SelectGroup';
const setGroupCycleCallbackName = 'ability.SetGroupCycle';
const selectNextGroupCallbackName = 'ability.NextGroup';
const selectPrevGroupCallbackName = 'ability.PrevGroup';
const setVisibleSlotsCallbackName = 'ability.SetVisibleSlots';
const createGroupCallbackName = 'ability.CreateGroup';
const deleteGroupCallbackName = 'ability.DeleteGroup';
const renameGroupCallbackName = 'ability.RenameGroup';
const executeAbilityCallbackName = 'ability.ExecuteAbility';
const moveAbilityCallbackName = 'ability.MoveAbility';
const replaceAbilityCallbackName = 'ability.ReplaceAbility';
const requestEditModeCallbackName = 'ability.RequestEditMode';
const resetAbilitiesCallbackName = 'ability.ResetToDefaults';

export interface AbilityFunctions {
  bindAbilityActivatedListener(listener: AbilityActivatedListener): ListenerHandle;
  bindAbilityEditStatusListener(listener: AbilityEditStatusListener): ListenerHandle;
  bindAbilityGroupUpdatedListener(listener: AbilityGroupUpdatedListener): ListenerHandle;
  bindAbilityGroupDeletedListener(listener: AbilityGroupDeletedListener): ListenerHandle;
  bindAbilityStatusUpdatedListener(listener: AbilityStatusUpdatedListener): ListenerHandle;
  bindButtonLayoutUpdatedListener(listener: ButtonLayoutUpdatedListener): ListenerHandle;
  bindButtonLayoutDeletedListener(listener: ButtonLayoutDeletedListener): ListenerHandle;

  requestEditMode(active: boolean): void;
  resetAllAbilitiesToDefaults(): void;

  createAbilityLayout(): Promise<number>;
  deleteAbilityLayout(layoutID: number): void;
  selectAbilityLayoutGroup(layoutID: number, groupID: number): void;
  selectAbilityLayoutGroupCycle(layoutID: number, groupIDs: number[]): void;
  selectNextAbilityLayoutGroup(layoutID: number): void;
  selectPrevAbilityLayoutGroup(layoutID: number): void;

  createAbilityGroup(name: string): Promise<number>;
  deleteAbilityGroup(groupID: number): void;
  renameAbilityGroup(groupID: number, name: string): void;
  setVisibleAbilitySlots(groupID: number, count: number): void;

  clearAbility(groupID: number, pos: number): void;
  executeAbility(groupID: number, pos: number): void;
  moveAbility(groupID: number, srcPos: number, destPos: number): void;
  setAbility(groupID: number, pos: number, abilityID: number): void;
}

export interface AbilityMocks {
  triggerAbilityActivated(abilityID: number): void;
  triggerAbilityEditStatus(status: AbilityEditStatus): void;
  triggerAbilityGroupUpdated(group: AbilityGroup): void;
  triggerAbilityStatusUpdated(status: AbilityStatus): void;
  triggerButtonLayoutUpdated(layout: ButtonLayout): void;
}

abstract class AbilityFunctionsBase implements AbilityFunctions, AbilityMocks {
  private readonly events = new EventEmitter();

  bindAbilityActivatedListener(listener: AbilityActivatedListener): ListenerHandle {
    return this.events.on(abilityActivatedEventName, listener);
  }
  bindAbilityEditStatusListener(listener: AbilityEditStatusListener): ListenerHandle {
    return this.events.on(editChangedEventName, listener);
  }
  bindAbilityGroupUpdatedListener(listener: AbilityGroupUpdatedListener): ListenerHandle {
    return this.events.on(groupUpdatedEventName, listener);
  }
  bindAbilityGroupDeletedListener(listener: AbilityGroupDeletedListener): ListenerHandle {
    return this.events.on(groupDeletedEventName, listener);
  }
  bindAbilityStatusUpdatedListener(listener: AbilityStatusUpdatedListener): ListenerHandle {
    return this.events.on(statusUpdatedEventName, listener);
  }
  bindButtonLayoutUpdatedListener(listener: ButtonLayoutUpdatedListener): ListenerHandle {
    return this.events.on(layoutUpdatedEventName, listener);
  }
  bindButtonLayoutDeletedListener(listener: ButtonLayoutDeletedListener): ListenerHandle {
    return this.events.on(layoutDeletedEventName, listener);
  }

  abstract requestEditMode(active: boolean): void;
  abstract resetAllAbilitiesToDefaults(): void;

  abstract createAbilityLayout(): Promise<number>;
  abstract deleteAbilityLayout(layoutID: number): void;
  abstract selectAbilityLayoutGroup(layoutID: number, groupID: number): void;
  abstract selectAbilityLayoutGroupCycle(layoutID: number, groupIDs: number[]): void;
  abstract selectNextAbilityLayoutGroup(layoutID: number): void;
  abstract selectPrevAbilityLayoutGroup(layoutID: number): void;

  abstract createAbilityGroup(name: string): Promise<number>;
  abstract deleteAbilityGroup(groupID: number): void;
  abstract renameAbilityGroup(groupID: number, name: string): void;
  abstract setVisibleAbilitySlots(groupID: number, count: number): void;

  abstract clearAbility(groupID: number, pos: number): void;
  abstract executeAbility(groupID: number, pos: number): void;
  abstract moveAbility(groupID: number, srcPos: number, destPos: number): void;
  abstract setAbility(groupID: number, pos: number, abilityID: number): void;

  triggerAbilityActivated(abilityID: number): void {
    this.events.trigger(abilityActivatedEventName, abilityID);
  }

  triggerAbilityEditStatus(status: AbilityEditStatus): void {
    this.events.trigger(editChangedEventName, status);
  }

  triggerAbilityGroupUpdated(group: AbilityGroup): void {
    this.events.trigger(groupUpdatedEventName, group);
  }

  triggerAbilityStatusUpdated(status: AbilityStatus): void {
    this.events.trigger(statusUpdatedEventName, status);
  }

  triggerButtonLayoutUpdated(layout: ButtonLayout): void {
    this.events.trigger(layoutUpdatedEventName, layout);
  }
}

class CoherentAbilityFunctions extends AbilityFunctionsBase {
  bindAbilityActivatedListener(listener: AbilityActivatedListener): ListenerHandle {
    const mockHandle = super.bindAbilityActivatedListener(listener);
    const engineHandle = engine.on(abilityActivatedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  bindAbilityEditStatusListener(listener: AbilityEditStatusListener): ListenerHandle {
    const mockHandle = super.bindAbilityEditStatusListener(listener);
    const engineHandle = engine.on(editChangedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  bindAbilityGroupUpdatedListener(listener: AbilityGroupUpdatedListener): ListenerHandle {
    const mockHandle = super.bindAbilityGroupUpdatedListener(listener);
    const engineHandle = engine.on(groupUpdatedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  bindAbilityGroupDeletedListener(listener: AbilityGroupDeletedListener): ListenerHandle {
    const mockHandle = super.bindAbilityGroupDeletedListener(listener);
    const engineHandle = engine.on(groupDeletedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  bindAbilityStatusUpdatedListener(listener: AbilityStatusUpdatedListener): ListenerHandle {
    const mockHandle = super.bindAbilityStatusUpdatedListener(listener);
    const engineHandle = engine.on(statusUpdatedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  bindButtonLayoutUpdatedListener(listener: ButtonLayoutUpdatedListener): ListenerHandle {
    const mockHandle = super.bindButtonLayoutUpdatedListener(listener);
    const engineHandle = engine.on(layoutUpdatedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  bindButtonLayoutDeletedListener(listener: ButtonLayoutDeletedListener): ListenerHandle {
    const mockHandle = super.bindButtonLayoutDeletedListener(listener);
    const engineHandle = engine.on(layoutDeletedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  requestEditMode(active: boolean): void {
    engine.trigger(requestEditModeCallbackName, active);
  }
  resetAllAbilitiesToDefaults(): void {
    engine.trigger(resetAbilitiesCallbackName);
  }

  createAbilityLayout(): Promise<number> {
    return engine.call(createLayoutCallbackName);
  }
  deleteAbilityLayout(layoutID: number): void {
    engine.trigger(deleteLayoutCallbackName, layoutID);
  }
  selectAbilityLayoutGroup(layoutID: number, groupID: number): void {
    engine.trigger(selectGroupCallbackName, layoutID, groupID);
  }
  selectAbilityLayoutGroupCycle(layoutID: number, groupIDs: number[]): void {
    engine.trigger(setGroupCycleCallbackName, layoutID, groupIDs);
  }
  selectNextAbilityLayoutGroup(layoutID: number): void {
    engine.trigger(selectNextGroupCallbackName, layoutID);
  }
  selectPrevAbilityLayoutGroup(layoutID: number): void {
    engine.trigger(selectPrevGroupCallbackName, layoutID);
  }
  createAbilityGroup(name: string): Promise<number> {
    return engine.call(createGroupCallbackName, name);
  }
  deleteAbilityGroup(groupID: number): void {
    engine.trigger(deleteGroupCallbackName, groupID);
  }
  renameAbilityGroup(groupID: number, name: string): void {
    engine.trigger(renameGroupCallbackName, groupID, name);
  }
  setVisibleAbilitySlots(groupID: number, count: number): void {
    engine.trigger(setVisibleSlotsCallbackName, groupID, count);
  }
  clearAbility(groupID: number, pos: number): void {
    engine.trigger(replaceAbilityCallbackName, groupID, pos, -1);
  }
  executeAbility(groupID: number, pos: number): void {
    engine.trigger(executeAbilityCallbackName, groupID, pos);
  }
  moveAbility(groupID: number, srcPos: number, destPos: number): void {
    engine.trigger(moveAbilityCallbackName, groupID, srcPos, destPos);
  }
  setAbility(groupID: number, pos: number, abilityID: number): void {
    engine.trigger(replaceAbilityCallbackName, groupID, pos, abilityID);
  }
}

class BrowserAbilityFunctions extends AbilityFunctionsBase {
  requestEditMode(active: boolean): void {}
  resetAllAbilitiesToDefaults(): void {}

  createAbilityLayout(): Promise<number> {
    return Promise.resolve(0);
  }
  deleteAbilityLayout(layoutID: number): void {}
  selectAbilityLayoutGroup(layoutID: number, groupID: number): void {}
  selectAbilityLayoutGroupCycle(layoutID: number, groupIDs: number[]): void {}
  selectNextAbilityLayoutGroup(layoutID: number): void {}
  selectPrevAbilityLayoutGroup(layoutID: number): void {}

  createAbilityGroup(name: string): Promise<number> {
    return Promise.resolve(0);
  }
  deleteAbilityGroup(groupID: number): void {}
  renameAbilityGroup(groupID: number, name: string): void {}
  setVisibleAbilitySlots(groupID: number, count: number): void {}

  clearAbility(groupID: number, pos: number): void {}
  executeAbility(groupID: number, pos: number): void {}
  moveAbility(groupID: number, srcPos: number, destPos: number): void {}
  setAbility(groupID: number, pos: number, abilityID: number): void {}
}

export const impl: AbilityFunctions & AbilityMocks = engine.isAttached
  ? new CoherentAbilityFunctions()
  : new BrowserAbilityFunctions();
