/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { Item } from '../game/types/Items';
import { Euler3f, Vec3f } from '../../camelotunchained/graphql/schema';
import { MoveItemRequestLocationType } from '../webAPI/definitions';

const inventoryUpdatedEvent = 'inventory.updated'; // refreshes an inventory (primary, bank, wallet, etc)
const performItemActionCallbackName = 'performItemAction';
const useInventoryItemCallbackName = 'useInventoryItem';
const moveItemCallbackName = 'moveItem';
const setContainerColorCallbackName = 'setContainerColor';

export type InventoryUpdatedListener = (name: string, content: Item[]) => void;

export interface InventoryMocks {
  triggerInventoryUpdated(name: string, content: Item[]): void;
}

export interface InventoryFunctions {
  bindInventoryUpdatedListener(listener: InventoryUpdatedListener): ListenerHandle;

  performItemAction(
    itemInstanceID: string,
    itemEntityID: string,
    actionID: string,
    worldPosition: Vec3f | null,
    rotation: Euler3f | null,
    boneAlias: number
  ): void;

  useInventoryItem(itemInstanceID: string, targetItemInstanceID?: string): void;

  moveItem(
    moveItemID: string,
    unitCount: number,
    entityIDFrom: string,
    characterIDFrom: string,
    boneAliasFrom: number,
    locationTo: MoveItemRequestLocationType,
    entityIDTo: string,
    characterIDTo: string,
    positionTo: number,
    containerIDTo: string,
    drawerIndexTo: number,
    gearSlotIDTo: number,
    worldPositionTo: Vec3f,
    rotationTo: Euler3f,
    boneAliasTo: number
  ): void;

  setContainerColor(itemID: string, color: number);
}

abstract class InventoryFunctionsBase implements InventoryFunctions, InventoryMocks {
  private readonly events = new EventEmitter();

  bindInventoryUpdatedListener(listener: InventoryUpdatedListener): ListenerHandle {
    return this.events.on(inventoryUpdatedEvent, listener);
  }

  triggerInventoryUpdated(errorMessage: string): void {
    this.events.trigger(inventoryUpdatedEvent, errorMessage);
  }

  abstract performItemAction(
    itemInstanceID: string,
    itemEntityID: string,
    actionID: string,
    worldPosition: Vec3f | null,
    rotation: Euler3f | null,
    boneAlias: number
  ): void;

  abstract useInventoryItem(itemInstanceID: string, targetItemInstanceID?: string): void;

  abstract moveItem(
    moveItemID: string,
    unitCount: number,
    entityIDFrom: string,
    characterIDFrom: string,
    boneAliasFrom: number,
    locationTo: MoveItemRequestLocationType,
    entityIDTo: string,
    characterIDTo: string,
    positionTo: number,
    containerIDTo: string,
    drawerIndexTo: number,
    gearSlotIDTo: number,
    worldPositionTo: Vec3f,
    rotationTo: Euler3f,
    boneAliasTo: number
  ): void;

  abstract setContainerColor(itemID: string, color: number);
}

class CoherentInventoryFunctions extends InventoryFunctionsBase {
  bindInventoryUpdatedListener(listener: InventoryUpdatedListener): ListenerHandle {
    const mockHandle = super.bindInventoryUpdatedListener(listener);
    const engineHandle = engine.on(inventoryUpdatedEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  performItemAction(
    itemInstanceID: string,
    itemEntityID: string,
    actionID: string,
    worldPosition: Vec3f | null,
    rotation: Euler3f | null,
    boneAlias: number
  ): void {
    engine.trigger(
      performItemActionCallbackName,
      itemInstanceID,
      itemEntityID,
      actionID,
      worldPosition?.x ?? 0,
      worldPosition?.y ?? 0,
      worldPosition?.z ?? 0,
      rotation?.roll ?? 0,
      rotation?.pitch ?? 0,
      rotation?.yaw ?? 0,
      boneAlias
    );
  }

  useInventoryItem(itemInstanceID: string, targetItemInstanceID?: string): void {
    engine.trigger(useInventoryItemCallbackName, itemInstanceID, targetItemInstanceID);
  }

  moveItem(
    moveItemID: string,
    unitCount: number,
    entityIDFrom: string,
    characterIDFrom: string,
    boneAliasFrom: number,
    locationTo: MoveItemRequestLocationType,
    entityIDTo: string,
    characterIDTo: string,
    positionTo: number,
    containerIDTo: string,
    drawerIndexTo: number,
    gearSlotIDTo: number,
    worldPositionTo: Vec3f,
    rotationTo: Euler3f,
    boneAliasTo: number
  ): void {
    engine.trigger(
      moveItemCallbackName,
      moveItemID,
      unitCount,
      entityIDFrom ?? '0000000000000000000000',
      characterIDFrom ?? '0000000000000000000000',
      boneAliasFrom,
      locationTo,
      entityIDTo ?? '0000000000000000000000',
      characterIDTo ?? '0000000000000000000000',
      positionTo,
      containerIDTo ?? '0000000000000000000000',
      drawerIndexTo ?? '',
      gearSlotIDTo,
      worldPositionTo?.x ?? 0,
      worldPositionTo?.y ?? 0,
      worldPositionTo?.z ?? 0,
      rotationTo?.roll ?? 0,
      rotationTo?.pitch ?? 0,
      rotationTo?.yaw ?? 0,
      boneAliasTo
    );
  }

  setContainerColor(itemID: string, color: number): void {
    engine.trigger(setContainerColorCallbackName, itemID, color);
  }
}

export interface SelectedIngredient {
  itemInstanceID: string;
  quantity: number;
  slot: number;
}

class BrowserInventoryFunctions extends InventoryFunctionsBase {
  performItemAction(
    itemInstanceID: string,
    itemEntityID: string,
    actionID: string,
    worldPosition: Vec3f | null,
    rotation: Euler3f | null,
    boneAlias: number
  ): void {}

  useInventoryItem(itemInstanceID: string, targetItemInstanceID?: string): void {}

  moveItem(
    moveItemID: string,
    unitCount: number,
    entityIDFrom: string,
    characterIDFrom: string,
    boneAliasFrom: number,
    locationTo: MoveItemRequestLocationType,
    entityIDTo: string,
    characterIDTo: string,
    positionTo: number,
    containerIDTo: string,
    drawerIndexTo: number,
    gearSlotIDTo: number,
    worldPositionTo: Vec3f,
    rotationTo: Euler3f,
    boneAliasTo: number
  ): void {}

  setContainerColor(itemID: string, color: number): void {}
}

export const impl: InventoryFunctions & InventoryMocks = engine.isAttached
  ? new CoherentInventoryFunctions()
  : new BrowserInventoryFunctions();
