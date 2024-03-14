/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SelfPlayerStateModel } from '@csegames/library/dist/_baseGame/GameClientModels/SelfPlayerState';
import { updatePlayerDelta } from '../redux/playerSlice';
import { addIfChanged } from '../redux/reduxUtils';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../redux/externalDataSource';

export class SelfPlayerStateService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([clientAPI.bindSelfPlayerStateListener(this.handleSelfPlayerStateUpdate.bind(this))]);
  }

  private handleSelfPlayerStateUpdate(newState: SelfPlayerStateModel) {
    const oldState = this.reduxState.player;
    const delta: Partial<SelfPlayerStateModel> = {};

    // Extract all fields.
    const {
      characterID,
      zoneID,
      entityID,
      controlledEntityID,
      facing,
      cameraFacing,
      respawn,
      requestEnemyTarget,
      requestFriendlyTarget
    } = newState;

    // Diff fields that need diffed.
    addIfChanged(delta, { characterID }, [characterID], [oldState.characterID]);
    addIfChanged(delta, { zoneID }, [zoneID], [oldState.zoneID]);
    addIfChanged(delta, { entityID }, [entityID], [oldState.entityID]);
    addIfChanged(delta, { controlledEntityID }, [controlledEntityID], [oldState.controlledEntityID]);
    addIfChanged(delta, { facing }, [facing.pitch, facing.yaw], [oldState.facing.pitch, oldState.facing.yaw]);
    addIfChanged(
      delta,
      { cameraFacing },
      [cameraFacing.pitch, cameraFacing.yaw],
      [oldState.cameraFacing.pitch, oldState.cameraFacing.yaw]
    );

    // Until we move these functions out of Redux, just always update to the latest versions.
    // We have to bind the functions to the state, or else they lose their internal "this" pointer.
    Object.assign(delta, {
      respawn: respawn.bind(newState),
      requestEnemyTarget: requestEnemyTarget.bind(newState),
      requestFriendlyTarget: requestFriendlyTarget.bind(newState)
    });

    if (Object.keys(delta).length > 0) {
      this.dispatch(updatePlayerDelta(delta));
    }
  }
}
