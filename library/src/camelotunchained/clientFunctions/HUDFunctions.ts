/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NotificationListener } from '../../_baseGame/clientFunctions/ViewFunctions';
import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { KeyActionsModel } from '../game/GameClientModels/KeyActions';
import Store from '../../_baseGame/utils/local-storage';
import { Dictionary } from '../../_baseGame/types/ObjectMap';
import { GroupPOIType, HUDWidgetState } from '../game/types/HUDTypes';
import { MapDataType } from '../../_baseGame/GameClientModels/AnimationData';

const setCursorOverrideURLCallbackName = 'system.setCursorOverrideURL';

// All valid keys for use with this local store should be defined here.
const keyHUDWidgetStates = 'WidgetStates';
const keyHUDEditorOffset = 'HUDEditorOffset';
const keyPOIsToHide = 'POIsToHide';
const keyGroupPOIsToHide = 'GroupPOIsToHide';
const keyNameplateStyle = 'NameplateStyle';
const keyPartyLayout = 'PartyLayout';
const keyUIScale = 'UIScale';
const keyShowGameInfoAtStartup = 'ShowGameInfoAtStartup';
const keyMinimapState = 'MinimapState';

export const MIN_UI_SCALE = 0.5;
export const MAX_UI_SCALE = 1.5;

function clampUIScale(value: unknown): number {
  if (typeof value !== 'number' || !isFinite(value)) return 1;
  return Math.max(MIN_UI_SCALE, Math.min(value, MAX_UI_SCALE));
}

export type NameplateStyle = 'fancy' | 'simple';
export type PartyLayout = 'horizontal' | 'vertical';

export interface MinimapState {
  zoom: number;
}

export type AnchorVisibilityChangedListener = (anchorID: number, visible: boolean) => void;
export type KeyActionsUpdateListener = (keyActions: KeyActionsModel) => void;
export type PartyLayoutChangedListener = (layout: PartyLayout) => void;
export type UIScaleChangedListener = (scale: number) => void;

export interface HUDFunctions {
  bindAnchorVisibilityChangedListener(listener: AnchorVisibilityChangedListener): ListenerHandle;
  bindKeyActionsUpdateListener(listener: KeyActionsUpdateListener): ListenerHandle;
  bindToggleHUDEditorListener(listener: NotificationListener): ListenerHandle;
  bindPartyLayoutChangedListener(listener: PartyLayoutChangedListener): ListenerHandle;
  bindUIScaleChangedListener(listener: UIScaleChangedListener): ListenerHandle;

  getWidgets(): Dictionary<HUDWidgetState>;
  updateWidgetState(widgetID: string, widget: HUDWidgetState): void;
  clearWidgetState(widgetID: string): void;
  clearAllWidgetStates(): void;
  getHUDEditorOffset(): [number, number];
  setHUDEditorOffset(offset: [number, number]): void;
  getPOIsToHide(): MapDataType[];
  setPOITypeVisibility(type: MapDataType, show: boolean): void;
  getGroupPOIsToHide(): GroupPOIType[];
  setGroupPOITypeVisibility(type: GroupPOIType, show: boolean): void;

  getNameplateStyle(): NameplateStyle;
  setNameplateStyle(style: NameplateStyle): void;

  getPartyLayout(): PartyLayout;
  setPartyLayout(layout: PartyLayout): void;

  getUIScale(): number;
  setUIScale(scale: number): void;

  getShowGameInfoAtStartup(): boolean;
  setShowGameInfoAtStartup(value: boolean): void;

  getMinimapState(): MinimapState;
  setMinimapState(state: MinimapState): void;

  /** Pass an empty string to unset the override. */
  setCursorOverrideURL(url: string): void;
}

class CoherentHUDFunctions implements HUDFunctions {
  private store = new Store('CUHUD');
  private partyLayoutListeners: PartyLayoutChangedListener[] = [];
  private uiScaleListeners: UIScaleChangedListener[] = [];

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

  bindPartyLayoutChangedListener(listener: PartyLayoutChangedListener): ListenerHandle {
    this.partyLayoutListeners.push(listener);
    return {
      close: () => {
        this.partyLayoutListeners = this.partyLayoutListeners.filter((l) => l !== listener);
      }
    };
  }

  bindUIScaleChangedListener(listener: UIScaleChangedListener): ListenerHandle {
    this.uiScaleListeners.push(listener);
    return {
      close: () => {
        this.uiScaleListeners = this.uiScaleListeners.filter((l) => l !== listener);
      }
    };
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

  getPOIsToHide(): MapDataType[] {
    const types = this.store.get<MapDataType[]>(keyPOIsToHide) ?? [];
    return types;
  }
  setPOITypeVisibility(type: MapDataType, show: boolean): void {
    let types = this.getPOIsToHide();
    if (show) {
      if (types.includes(type)) {
        this.store.set(
          keyPOIsToHide,
          types.filter((t) => t !== type)
        );
      }
    } else {
      if (!types.includes(type)) {
        types.push(type);
        this.store.set(keyPOIsToHide, types);
      }
    }
  }

  getGroupPOIsToHide(): GroupPOIType[] {
    const types = this.store.get<GroupPOIType[]>(keyGroupPOIsToHide) ?? [];
    return types;
  }
  setGroupPOITypeVisibility(type: GroupPOIType, show: boolean): void {
    let types = this.getGroupPOIsToHide();
    if (show) {
      if (types.includes(type)) {
        this.store.set(
          keyGroupPOIsToHide,
          types.filter((t) => t !== type)
        );
      }
    } else {
      if (!types.includes(type)) {
        types.push(type);
        this.store.set(keyGroupPOIsToHide, types);
      }
    }
  }

  getNameplateStyle(): NameplateStyle {
    return this.store.get<NameplateStyle>(keyNameplateStyle) ?? 'fancy';
  }

  setNameplateStyle(style: NameplateStyle): void {
    this.store.set(keyNameplateStyle, style);
  }

  getPartyLayout(): PartyLayout {
    return this.store.get<PartyLayout>(keyPartyLayout) ?? 'vertical';
  }

  setPartyLayout(layout: PartyLayout): void {
    this.store.set(keyPartyLayout, layout);
    this.partyLayoutListeners.forEach((l) => l(layout));
  }

  getUIScale(): number {
    return clampUIScale(this.store.get<number>(keyUIScale));
  }

  setUIScale(scale: number): void {
    const clamped = clampUIScale(scale);
    this.store.set(keyUIScale, clamped);
    this.uiScaleListeners.forEach((l) => l(clamped));
  }

  getShowGameInfoAtStartup(): boolean {
    return this.store.get<boolean>(keyShowGameInfoAtStartup) ?? true;
  }

  setShowGameInfoAtStartup(value: boolean): void {
    this.store.set(keyShowGameInfoAtStartup, value);
  }

  getMinimapState(): MinimapState {
    return this.store.get<MinimapState>(keyMinimapState) ?? { zoom: 1.0 };
  }

  setMinimapState(state: MinimapState): void {
    this.store.set(keyMinimapState, state);
  }

  setCursorOverrideURL(url: string): void {
    engine.trigger(setCursorOverrideURLCallbackName, url);
  }
}

class BrowserHUDFunctions implements HUDFunctions {
  private store = new Store('CUHUD');
  private partyLayoutListeners: PartyLayoutChangedListener[] = [];
  private uiScaleListeners: UIScaleChangedListener[] = [];

  bindAnchorVisibilityChangedListener(listener: AnchorVisibilityChangedListener): ListenerHandle {
    return { close() {} };
  }

  bindKeyActionsUpdateListener(listener: KeyActionsUpdateListener): ListenerHandle {
    return { close() {} };
  }

  bindToggleHUDEditorListener(listener: NotificationListener): ListenerHandle {
    return { close() {} };
  }

  bindPartyLayoutChangedListener(listener: PartyLayoutChangedListener): ListenerHandle {
    this.partyLayoutListeners.push(listener);
    return {
      close: () => {
        this.partyLayoutListeners = this.partyLayoutListeners.filter((l) => l !== listener);
      }
    };
  }

  bindUIScaleChangedListener(listener: UIScaleChangedListener): ListenerHandle {
    this.uiScaleListeners.push(listener);
    return {
      close: () => {
        this.uiScaleListeners = this.uiScaleListeners.filter((l) => l !== listener);
      }
    };
  }

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

  getPOIsToHide(): MapDataType[] {
    return [];
  }

  setPOITypeVisibility(type: MapDataType, show: boolean): void {}

  getGroupPOIsToHide(): GroupPOIType[] {
    return [];
  }

  setGroupPOITypeVisibility(type: GroupPOIType, show: boolean): void {}

  getNameplateStyle(): NameplateStyle {
    return 'fancy';
  }

  setNameplateStyle(_style: NameplateStyle): void {}

  getPartyLayout(): PartyLayout {
    return this.store.get<PartyLayout>(keyPartyLayout) ?? 'vertical';
  }

  setPartyLayout(layout: PartyLayout): void {
    this.store.set(keyPartyLayout, layout);
    this.partyLayoutListeners.forEach((l) => l(layout));
  }

  getUIScale(): number {
    return clampUIScale(this.store.get<number>(keyUIScale));
  }

  setUIScale(scale: number): void {
    const clamped = clampUIScale(scale);
    this.store.set(keyUIScale, clamped);
    this.uiScaleListeners.forEach((l) => l(clamped));
  }

  getShowGameInfoAtStartup(): boolean {
    return this.store.get<boolean>(keyShowGameInfoAtStartup) ?? true;
  }

  setShowGameInfoAtStartup(value: boolean): void {
    this.store.set(keyShowGameInfoAtStartup, value);
  }

  getMinimapState(): MinimapState {
    return this.store.get<MinimapState>(keyMinimapState) ?? { zoom: 1.0 };
  }

  setMinimapState(state: MinimapState): void {
    this.store.set(keyMinimapState, state);
  }

  setCursorOverrideURL(url: string): void {}
}

export const impl: HUDFunctions = engine.isAttached ? new CoherentHUDFunctions() : new BrowserHUDFunctions();
