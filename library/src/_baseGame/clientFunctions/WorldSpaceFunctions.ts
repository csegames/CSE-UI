/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../listenerHandle';
import { EventEmitter } from '../types/EventEmitter';

export type ProgressBarListener = (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  percent: number
) => void;

export type WorldUIUpdatedListener = (
  cell: number,
  x: number,
  y: number,
  width: number,
  height: number,
  html: string
) => void;

export type WorldUIRemovedListener = (cell: number) => void;

export interface WorldSpaceMocks {
  triggerProgressBar(cell: number, x: number, y: number, width: number, height: number, percent: number): void;
  triggerWorldUIUpdate(cell: number, x: number, y: number, width: number, height: number, html: string): void;
  triggerWorldUIRemoval(cell: number): void;
}

export interface WorldSpaceFunctions {
  bindProgressBarListener(onProgressBarUpdate: ProgressBarListener): ListenerHandle;
  bindWorldUIUpdatedListener(onWorldUIUpdate: WorldUIUpdatedListener): ListenerHandle;
  bindWorldUIRemovedListener(onWorldUIRemoved: WorldUIRemovedListener): ListenerHandle;
}

const progressBarEventName = 'updateProgressBar';
const updateWorldUIEventName = 'updateWorldUI';
const removeWorldUIEventName = 'removeWorldUI';

class WorldSpaceFunctionsBase implements WorldSpaceFunctions, WorldSpaceMocks {
  private readonly events = new EventEmitter();

  bindProgressBarListener(listener: ProgressBarListener): ListenerHandle {
    return this.events.on(progressBarEventName, listener);
  }
  bindWorldUIRemovedListener(listener: WorldUIRemovedListener): ListenerHandle {
    return this.events.on(removeWorldUIEventName, listener);
  }
  bindWorldUIUpdatedListener(listener: WorldUIUpdatedListener): ListenerHandle {
    return this.events.on(updateWorldUIEventName, listener);
  }
  triggerProgressBar(cell: number, x: number, y: number, width: number, height: number, percent: number): void {
    this.events.trigger(progressBarEventName, cell, x, y, width, height, percent);
  }
  triggerWorldUIRemoval(cell: number): void {
    this.events.trigger(removeWorldUIEventName, cell);
  }
  triggerWorldUIUpdate(cell: number, x: number, y: number, width: number, height: number, html: string): void {
    this.events.trigger(updateWorldUIEventName, cell, x, y, width, height, html);
  }
}

class CoherentWorldSpaceFunctions extends WorldSpaceFunctionsBase {
  bindProgressBarListener(listener: ProgressBarListener): ListenerHandle {
    const mockHandle = super.bindProgressBarListener(listener);
    const engineHandle = engine.on(progressBarEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindWorldUIRemovedListener(listener: WorldUIRemovedListener): ListenerHandle {
    const mockHandle = super.bindWorldUIRemovedListener(listener);
    const engineHandle = engine.on(removeWorldUIEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindWorldUIUpdatedListener(listener: WorldUIUpdatedListener): ListenerHandle {
    const mockHandle = super.bindWorldUIUpdatedListener(listener);
    const engineHandle = engine.on('updateWorldUI', listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserWorldSpaceFunctions extends WorldSpaceFunctionsBase {}

export const impl: WorldSpaceFunctions & WorldSpaceMocks = engine.isAttached
  ? new CoherentWorldSpaceFunctions()
  : new BrowserWorldSpaceFunctions();
