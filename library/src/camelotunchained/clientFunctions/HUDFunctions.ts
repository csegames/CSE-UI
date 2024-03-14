/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NotificationListener } from '../../_baseGame/clientFunctions/ViewFunctions';
import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { KeyActionsModel } from '../game/GameClientModels/KeyActions';

export type AnchorVisibilityChangedListener = (anchorID: number, visible: boolean) => void;
export type KeyActionsUpdateListener = (keyActions: KeyActionsModel) => void;

export interface HUDFunctions {
  bindAnchorVisibilityChangedListener(listener: AnchorVisibilityChangedListener): ListenerHandle;
  bindKeyActionsUpdateListener(listener: KeyActionsUpdateListener): ListenerHandle;
  bindToggleHUDEditorListener(listener: NotificationListener): ListenerHandle;
}

class CoherentHUDFunctions implements HUDFunctions {
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
}

export const impl: HUDFunctions = engine.isAttached ? new CoherentHUDFunctions() : new BrowserHUDFunctions();
