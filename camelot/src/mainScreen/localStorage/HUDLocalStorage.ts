/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Store } from '@csegames/library/dist/_baseGame/utils/local-storage';
import { HUDWidgetState } from '../redux/hudSlice';

class HUDLocalStore {
  private store = new Store('CUHUD');

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

export const hudLocalStore = new HUDLocalStore();

// All valid keys for use with this local store should be defined here.
const keyHUDWidgetStates = 'WidgetStates';
const keyHUDEditorOffset = 'HUDEditorOffset';
