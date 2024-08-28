/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { HUDWidgetRegistration, registerWidget, updateWidgetStates } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { InitTopic, setInitialized } from '../redux/initializationSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../redux/externalDataSource';
import { abilityBookRegistry } from '../components/abilityBook/AbilityBook';
import { abilityBuilderRegistry } from '../components/abilityBuilder/AbilityBuilder';
import { buildRegistry } from '../components/Build';
import { chatRegistry } from '../components/chat/Chat';
import { compassRegistry } from '../components/Compass';
import { equippedRegistry } from '../components/equipped/Equipped';
import { enemyTargetUnitFrameRegistry, friendlyTargetUnitFrameRegistry } from '../components/TargetUnitFrame';
import { gameInfoRegistry } from '../components/GameInfo';
import { gameMenuRegistry } from '../components/GameMenu';
import { hudNavMenuRegistry } from '../components/HUDNavMenu';
import { inventoryRegistry } from '../components/inventory/Inventory';
import { joinScenarioRegistry } from '../components/joinScenario/JoinScenario';
import { openBuildRegistry } from '../components/OpenBuild';
import { placementRegistry } from '../components/Placement';
import { respawnRegistry } from '../components/Respawn';
import { selfDamageNumbersRegistry } from '../components/SelfDamageNumbers';
import { selfUnitFrameRegistry } from '../components/SelfUnitFrame';
import { settingsRegistry } from '../components/Settings';
import { warbandMembersRegistry } from '../components/WarbandMembers';
import { zoneNameRegistry } from '../components/ZoneName';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

// We need all of this at the file level to handle the cases where registerHUDWidget() is
// called before the HUDService is initialized.
let aDispatch: Dispatch = null;
let pendingRegistrations: Dictionary<HUDWidgetRegistration> = {};

export function registerHUDWidget(registration: HUDWidgetRegistration): void {
  pendingRegistrations[registration.name] = registration;

  applyRegistrations();
}

function applyRegistrations(): void {
  if (aDispatch) {
    Object.values(pendingRegistrations).forEach((reg: HUDWidgetRegistration) => {
      aDispatch(registerWidget(reg));
    });
    pendingRegistrations = {};
  }
}

export class HUDService extends ExternalDataSource {
  protected override bind(): Promise<ListenerHandle[]> {
    this.DEBUGRegisterWidgets();

    // Pull data from LocalStorage and send it to Redux.
    const widgets = clientAPI.getWidgets();
    this.dispatch(updateWidgetStates(widgets));

    // Iterate pendingRegistrations and send those to Redux.
    applyRegistrations();

    this.dispatch(setInitialized({ topic: InitTopic.HUDWidgets, result: true }));

    return Promise.resolve([]);
  }

  protected override onReduxUpdate(reduxState: RootState, dispatch: Dispatch<AnyAction>): void {
    super.onReduxUpdate(reduxState, dispatch);
    aDispatch = dispatch;
  }

  private DEBUGRegisterWidgets() {
    registerHUDWidget(abilityBookRegistry);
    registerHUDWidget(abilityBuilderRegistry);
    registerHUDWidget(buildRegistry);
    registerHUDWidget(chatRegistry);
    registerHUDWidget(compassRegistry);
    registerHUDWidget(enemyTargetUnitFrameRegistry);
    registerHUDWidget(equippedRegistry);
    registerHUDWidget(friendlyTargetUnitFrameRegistry);
    registerHUDWidget(gameInfoRegistry);
    registerHUDWidget(gameMenuRegistry);
    registerHUDWidget(hudNavMenuRegistry);
    registerHUDWidget(inventoryRegistry);
    registerHUDWidget(joinScenarioRegistry);
    registerHUDWidget(openBuildRegistry);
    registerHUDWidget(placementRegistry);
    registerHUDWidget(respawnRegistry);
    registerHUDWidget(selfDamageNumbersRegistry);
    registerHUDWidget(selfUnitFrameRegistry);
    registerHUDWidget(settingsRegistry);
    registerHUDWidget(warbandMembersRegistry);
    registerHUDWidget(zoneNameRegistry);
  }
}
