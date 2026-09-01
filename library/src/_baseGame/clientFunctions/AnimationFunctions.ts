/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { AnimationData } from '../GameClientModels/AnimationData';
import { ListenerHandle } from '../listenerHandle';

export type AnimationCallback = (animData: AnimationData, timestamp: DOMHighResTimeStamp) => void;

export interface AnimationFunctions {
  startAnimation(callback: AnimationCallback): ListenerHandle;
}

export interface AnimationMocks {
  setMockAnimationData(data: AnimationData): void;
  clearMockAnimationData(data: AnimationData): void;
}

interface CallbackInfo {
  id: number;
  canceled: boolean;
  func: AnimationCallback;
}

abstract class AnimationFunctionsBase implements AnimationFunctions, AnimationMocks {
  private mockData?: AnimationData;
  private nextCallbackID: number = 1;
  private requestedFrame: number | null = null;
  private callbacks: Map<number, AnimationCallback> = new Map();

  public startAnimation(callback: AnimationCallback): ListenerHandle {
    const id = this.nextCallbackID++;
    this.callbacks.set(id, callback);
    if (!this.requestedFrame) {
      this.requestedFrame = window.requestAnimationFrame(this.run.bind(this));
    }
    return { close: () => this.cancelAnimation(id) };
  }

  protected abstract getData(): AnimationData | undefined;

  private cancelAnimation(id: number): void {
    this.callbacks.delete(id);
    if (this.callbacks.size == 0 && this.requestedFrame) {
      window.cancelAnimationFrame(this.requestedFrame);
      this.requestedFrame = null;
    }
  }

  private run(timestamp: DOMHighResTimeStamp): void {
    const data = this.mockData ?? this.getData();
    for (const callback of this.callbacks.values()) {
      callback(data, timestamp);
    }
    this.requestedFrame = window.requestAnimationFrame(this.run.bind(this));
  }

  public setMockAnimationData(data: AnimationData) {
    this.mockData = data;
  }
  public clearMockAnimationData(data: AnimationData) {
    this.mockData = undefined;
  }
}

// Declaration of the global that coherent injects into the scene
declare global {
  var animationData: AnimationData | undefined;
}

class CoherentAnimationFunctions extends AnimationFunctionsBase {
  public override getData(): AnimationData | undefined {
    return animationData;
  }
}

class BrowserAnimationFunctions extends AnimationFunctionsBase {
  public override getData(): AnimationData | undefined {
    return undefined;
  }
}

export const impl: AnimationFunctions & AnimationMocks = engine.isAttached
  ? new CoherentAnimationFunctions()
  : new BrowserAnimationFunctions();
