/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NotificationListener } from '../../_baseGame/clientFunctions/ViewFunctions';
import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { KeyActionsModel } from '../game/GameClientModels/KeyActions';
import { Euler3f, Vec3f } from '../../camelotunchained/graphql/schema';
import { MoveItemRequestLocationType } from '../webAPI/definitions';
import Store from '../../_baseGame/utils/local-storage';
import { Dictionary } from '../../_baseGame/types/ObjectMap';
import { HUDWidgetState } from '../game/types/HUDTypes';

// All valid keys for use with this local store should be defined here.
const keyHUDWidgetStates = 'WidgetStates';
const keyHUDEditorOffset = 'HUDEditorOffset';

export type AnchorVisibilityChangedListener = (anchorID: number, visible: boolean) => void;
export type KeyActionsUpdateListener = (keyActions: KeyActionsModel) => void;

export interface HUDFunctions {
  bindAnchorVisibilityChangedListener(listener: AnchorVisibilityChangedListener): ListenerHandle;
  bindKeyActionsUpdateListener(listener: KeyActionsUpdateListener): ListenerHandle;
  bindToggleHUDEditorListener(listener: NotificationListener): ListenerHandle;

  performItemAction(
    itemInstanceID: string,
    itemEntityID: string,
    actionID: string,
    worldPosition: Vec3f,
    rotation: Euler3f,
    boneAlias: number
  ): void;

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

  getWidgets(): Dictionary<HUDWidgetState>;
  updateWidgetState(widgetID: string, widget: HUDWidgetState): void;
  clearWidgetState(widgetID: string): void;
  clearAllWidgetStates(): void;
  getHUDEditorOffset(): [number, number];
  setHUDEditorOffset(offset: [number, number]): void;
}

const performItemActionCallbackName = 'performItemAction';
const moveItemCallbackName = 'moveItem';
const setContainerColorCallbackName = 'setContainerColor';

class CoherentHUDFunctions implements HUDFunctions {
  private store = new Store('CUHUD');

  bindAnchorVisibilityChangedListener(listener: AnchorVisibilityChangedListener): ListenerHandle {
    const innerHandle = engine.on('anchorVisibilityChanged', listener);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }

  bindKeyActionsUpdateListener(listener: KeyActionsUpdateListener): ListenerHandle {
    const innerHandle = engine.on('keyActions.update', listener);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }

  bindToggleHUDEditorListener(listener: NotificationListener): ListenerHandle {
    const innerHandle = engine.on('toggleHUDEditor', listener);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }

  performItemAction(
    itemInstanceID: string,
    itemEntityID: string,
    actionID: string,
    worldPosition: Vec3f,
    rotation: Euler3f,
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

  public getWidgets(): Dictionary<HUDWidgetState> {
    const widgets = this.store.get<Dictionary<HUDWidgetState>>(keyHUDWidgetStates) ?? {};
    return widgets;
  }

  public updateWidgetState(widgetID: string, widget: HUDWidgetState): void {
    const widgets = this.store.get<Dictionary<HUDWidgetState>>(keyHUDWidgetStates) ?? {};
    widgets[widgetID] = widget;
    this.store.set(keyHUDWidgetStates, widgets);
  }

  public clearWidgetState(widgetID: string): void {
    const widgets = this.store.get<Dictionary<HUDWidgetState>>(keyHUDWidgetStates) ?? {};
    delete widgets[widgetID];
    this.store.set(keyHUDWidgetStates, widgets);
  }

  public clearAllWidgetStates(): void {
    this.store.set(keyHUDWidgetStates, {});
  }

  public getHUDEditorOffset(): [number, number] {
    const offset = this.store.get<[number, number]>(keyHUDEditorOffset) ?? [0, 0];
    return offset;
  }

  public setHUDEditorOffset(offset: [number, number]): void {
    this.store.set(keyHUDEditorOffset, offset);
  }
}

class BrowserHUDFunctions implements HUDFunctions {
  bindAnchorVisibilityChangedListener(listener: AnchorVisibilityChangedListener): ListenerHandle {
    return { close() {} };
  }

  bindKeyActionsUpdateListener(listener: KeyActionsUpdateListener): ListenerHandle {
    return { close() {} };
  }

  bindToggleHUDEditorListener(listener: NotificationListener): ListenerHandle {
    return { close() {} };
  }

  performItemAction(
    itemInstanceID: string,
    itemEntityID: string,
    actionID: string,
    worldPosition: Vec3f,
    rotation: Euler3f,
    boneAlias: number
  ): void {}

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

  getWidgets(): Dictionary<HUDWidgetState> {
    return {};
  }

  updateWidgetState(widgetID: string, widget: HUDWidgetState): void {}

  clearWidgetState(widgetID: string): void {}

  clearAllWidgetStates(): void {}

  getHUDEditorOffset(): [number, number] {
    return [0, 0];
  }

  setHUDEditorOffset(offset: [number, number]): void {}
}

export const impl: HUDFunctions = engine.isAttached ? new CoherentHUDFunctions() : new BrowserHUDFunctions();
