/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {
  HUDWidgetRegistration,
  registerWidget,
  setUIScale,
  updateGroupPOIsToHide,
  updatePOIsToHide,
  updatePersonalMapMarkers,
  setPersonalMapMarker,
  setPersonalMapMarkerVisible,
  updateWidgetStates
} from '../redux/hudSlice';
import { setPartyLayoutHorizontal } from '../redux/partySlice';
import { LoadingTopic, setInitialized } from '../redux/loadingSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { abilityBookRegistry } from '../components/abilityBook/AbilityBook';
import { abilityCastingRegistry } from '../components/AbilityCasting';
import { chatRegistry } from '../components/chat/Chat';
import { compassRegistry } from '../components/compass/Compass';
import { equippedRegistry } from '../components/Equipped';
import {
  enemyTargetUnitFrameRegistry,
  friendlyTargetUnitFrameRegistry
} from '../components/unitFrames/TargetUnitFrame';
import { gameInfoRegistry } from '../components/GameInfo';
import { gameMenuRegistry } from '../components/GameMenu';
import { hudNavMenuRegistry } from '../components/HUDNavMenu';
import { inventoryRegistry } from '../components/inventory/Inventory';
import { partyRegistry } from '../components/party/Party';
// Placement widget is disabled for now — item placement mode (deployables/siege) isn't used currently.
// import { placementRegistry } from '../components/Placement';
import { respawnRegistry } from '../components/Respawn';
import { selfUnitFrameRegistry } from '../components/unitFrames/SelfUnitFrame';
import { settingsRegistry } from '../components/Settings';
import { warningIconsRegistry } from '../components/WarningIcons';
import { worldMapRegistry } from '../components/WorldMap';
import { zoneNameRegistry } from '../components/zoneName/ZoneName';
import { miniMapRegistry } from '../components/MiniMap';
import { mailRegistry } from '../components/mail/Mail';
import { warbandRegistry } from '../components/warband/Warband';
import { craftingRegistry } from '../components/crafting/Crafting';
import { socialRegistry } from '../components/social/Social';
import { vendorRegistry } from '../components/vendor/Vendor';
import { bankRegistry } from '../components/bank/Bank';
import { classProgressionBarRegistry } from '../components/levelBars/ClassProgressionBar';
import { realmRenownProgressionBarRegistry } from '../components/levelBars/RealmRenownProgressionBar';
import { tradeRegistry } from '../components/trade/Trade';
import { tradeRequestsRegistry } from '../components/trade/TradeRequests';
import { serverMessagesRegistry } from '../components/serverMessages/ServerMessages';
import { store } from '../redux/store';
import { repairWarningRegistry } from '../components/playerWarningIcons/PlayerWarningIcons';
import { questLogRegistry } from '../components/quests/QuestLog';
import { questTrackerRegistry } from '../components/quests/QuestTracker';
import { tradeskillTrackerRegistry } from '../components/tradeskillTracker/TradeskillTracker';
import { levelNotificationsRegistry, questNotificationsRegistry } from '../components/NotificationToasts';
import { ModalParams } from '../redux/modalsSlice';
import { CharacterResetModal } from '../components/abilityBook/CharacterResetModal';
import { HUDWidgetState } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';

// Saves from the removed visibility toggle can still carry `visible: false`.
type LegacyHUDWidgetState = HUDWidgetState & { visible?: boolean };

function convertLegacyHiddenWidgets(widgets: Record<string, LegacyHUDWidgetState>): Record<string, HUDWidgetState> {
  const converted: Record<string, HUDWidgetState> = {};
  for (const [widgetID, { visible, ...widgetState }] of Object.entries(widgets)) {
    converted[widgetID] = visible === false ? { ...widgetState, opacity: 0 } : widgetState;
  }
  return converted;
}

// We need this at the file level to handle the cases where registerHUDWidget() is
// called before the HUDService is initialized.
export function registerHUDWidget(registration: HUDWidgetRegistration): void {
  store.dispatch(registerWidget(registration));
}

export class HUDService extends ExternalDataSource {
  protected override bind(): Promise<ListenerHandle[]> {
    this.DEBUGRegisterWidgets();

    // Pull data from LocalStorage and send it to Redux.
    const widgets = convertLegacyHiddenWidgets(clientAPI.getWidgets());
    this.dispatch(updateWidgetStates(widgets));

    const poisToHide = clientAPI.getPOIsToHide();
    this.dispatch(updatePOIsToHide(poisToHide));

    const groupPOIsToHide = clientAPI.getGroupPOIsToHide();
    this.dispatch(updateGroupPOIsToHide(groupPOIsToHide));

    const personalMapMarkers = clientAPI.getPersonalMapMarkers();
    this.dispatch(updatePersonalMapMarkers(personalMapMarkers));

    this.dispatch(setPersonalMapMarkerVisible(clientAPI.getPersonalMapMarkerVisibility()));

    this.dispatch(setPartyLayoutHorizontal(clientAPI.getPartyLayout() === 'horizontal'));
    this.dispatch(setUIScale(clientAPI.getUIScale()));

    this.dispatch(setInitialized({ topic: LoadingTopic.HUDWidgets, result: true }));

    return Promise.resolve([
      clientAPI.bindPartyLayoutChangedListener((layout) => {
        this.dispatch(setPartyLayoutHorizontal(layout === 'horizontal'));
      }),
      clientAPI.bindUIScaleChangedListener((scale) => {
        this.dispatch(setUIScale(scale));
      }),
      clientAPI.bindPersonalMapMarkerChangedListener((zoneID, marker) => {
        this.dispatch(setPersonalMapMarker({ zoneID, marker }));
      }),
      clientAPI.bindPersonalMapMarkerVisibilityChangedListener((visible) => {
        this.dispatch(setPersonalMapMarkerVisible(visible));
      })
    ]);
  }

  private DEBUGRegisterWidgets() {
    registerHUDWidget(abilityBookRegistry);
    registerHUDWidget(abilityCastingRegistry);
    registerHUDWidget(bankRegistry);
    registerHUDWidget(chatRegistry);
    registerHUDWidget(compassRegistry);
    registerHUDWidget(craftingRegistry);
    registerHUDWidget(enemyTargetUnitFrameRegistry);
    registerHUDWidget(equippedRegistry);
    registerHUDWidget(friendlyTargetUnitFrameRegistry);
    registerHUDWidget(gameInfoRegistry);
    registerHUDWidget(gameMenuRegistry);
    registerHUDWidget(hudNavMenuRegistry);
    registerHUDWidget(inventoryRegistry);
    registerHUDWidget(classProgressionBarRegistry);
    registerHUDWidget(realmRenownProgressionBarRegistry);
    registerHUDWidget(mailRegistry);
    registerHUDWidget(levelNotificationsRegistry);
    registerHUDWidget(miniMapRegistry);
    registerHUDWidget(partyRegistry);
    registerHUDWidget(questNotificationsRegistry);
    // registerHUDWidget(placementRegistry);
    registerHUDWidget(questLogRegistry);
    registerHUDWidget(questTrackerRegistry);
    registerHUDWidget(repairWarningRegistry);
    registerHUDWidget(respawnRegistry);
    registerHUDWidget(selfUnitFrameRegistry);
    registerHUDWidget(serverMessagesRegistry);
    registerHUDWidget(settingsRegistry);
    registerHUDWidget(socialRegistry);
    registerHUDWidget(tradeRegistry);
    registerHUDWidget(tradeRequestsRegistry);
    registerHUDWidget(tradeskillTrackerRegistry);
    registerHUDWidget(vendorRegistry);
    registerHUDWidget(warbandRegistry);
    registerHUDWidget(warningIconsRegistry);
    registerHUDWidget(worldMapRegistry);
    registerHUDWidget(zoneNameRegistry);
  }
}

interface ClientManagedModalData {
  showParams: ModalParams;
}

// Key: client modal ID, as sent via the clientAPI.bind(Show/Hide/Toggle)WidgetListener pipeline.
export const clientManagedModals: Record<string, ClientManagedModalData> = {
  ['skill_reset']: {
    showParams: {
      id: 'skill_reset',
      content: (params: ModalParams) => <CharacterResetModal />
    }
  }
};
