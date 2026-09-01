/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { EventEmitter } from '../types/EventEmitter';

export type NotificationListener = () => void;
export type WidgetEventListener = (name: string) => void;

export interface ViewEventMocks {
  triggerShowWidget(name: string): void;
  triggerHideWidget(name: string): void;
  triggerToggleWidget(name: string): void;
}

export interface ViewFunctions {
  setInitializationComplete(): void;
  bindShowWidgetListener(listener: NotificationListener, name: string): ListenerHandle;
  bindShowWidgetListener(listener: WidgetEventListener): ListenerHandle;
  bindHideWidgetListener(listener: NotificationListener, name: string): ListenerHandle;
  bindHideWidgetListener(listener: WidgetEventListener): ListenerHandle;
  bindToggleWidgetListener(listener: NotificationListener, name: string): ListenerHandle;
  bindToggleWidgetListener(listener: WidgetEventListener): ListenerHandle;
  requestTextInput(on: boolean): void;
}

const showWidgetEventName = 'widget.show';
const hideWidgetEventName = 'widget.hide';
const toggleWidgetEventName = 'widget.toggle';

class ViewFunctionsBase implements ViewFunctions, ViewEventMocks {
  private readonly events = new EventEmitter();

  setInitializationComplete(): void {
    console.info('Initialization complete');
  }

  bindShowWidgetListener(listener: WidgetEventListener | NotificationListener, name?: string): ListenerHandle {
    return this.bindWidgetEventListener(showWidgetEventName, listener, name);
  }

  bindHideWidgetListener(listener: WidgetEventListener | NotificationListener, name?: string): ListenerHandle {
    return this.bindWidgetEventListener(hideWidgetEventName, listener, name);
  }

  bindToggleWidgetListener(listener: WidgetEventListener | NotificationListener, name?: string): ListenerHandle {
    return this.bindWidgetEventListener(toggleWidgetEventName, listener, name);
  }

  triggerShowWidget(name: string): void {
    this.events.trigger(showWidgetEventName, name);
  }

  triggerHideWidget(name: string): void {
    this.events.trigger(hideWidgetEventName, name);
  }

  triggerToggleWidget(name: string): void {
    this.events.trigger(toggleWidgetEventName, name);
  }

  requestTextInput(on: boolean): void {}

  private bindWidgetEventListener(
    eventName: string,
    listener: WidgetEventListener | NotificationListener,
    name?: string
  ): ListenerHandle {
    if (name === undefined) {
      return this.bindWidgetEventInternal(eventName, listener);
    }
    return this.bindWidgetEventInternal(eventName, (ev) => {
      if (ev === name) (listener as NotificationListener)();
    });
  }

  protected bindWidgetEventInternal(eventName: string, listener: WidgetEventListener): ListenerHandle {
    return this.events.on(eventName, listener);
  }
}

class CoherentViewFunctions extends ViewFunctionsBase {
  override setInitializationComplete(): void {
    super.setInitializationComplete();
    engine.trigger('OnReadyForDisplay');
  }

  protected override bindWidgetEventInternal(eventName: string, listener: WidgetEventListener): ListenerHandle {
    const jsHandle = super.bindWidgetEventInternal(eventName, listener);
    const engineHandle = engine.on(eventName, listener);
    return {
      close() {
        jsHandle.close();
        engineHandle.clear();
      }
    };
  }

  override requestTextInput(on: boolean): void {
    engine.trigger('OnTextInputTypeChanged', on ? 1 : 0);
  }
}

class BrowserViewFunctions extends ViewFunctionsBase {}

export const impl: ViewFunctions & ViewEventMocks = engine.isAttached
  ? new CoherentViewFunctions()
  : new BrowserViewFunctions();
