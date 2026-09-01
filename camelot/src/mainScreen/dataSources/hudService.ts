/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  HUDWidgetRegistration,
  registerWidget,
  setNameplateStyle,
  setUIScale,
  updateGroupPOIsToHide,
  updatePOIsToHide,
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
import { guildRegistry } from '../components/guild/Guild';
import { vendorRegistry } from '../components/vendor/Vendor';
import { bankRegistry } from '../components/bank/Bank';
import { levelBarsRegistry } from '../components/levelBars/LevelBars';
import { tradeRegistry } from '../components/trade/Trade';
import { tradeRequestsRegistry } from '../components/trade/TradeRequests';
import { serverMessagesRegistry } from '../components/serverMessages/ServerMessages';
import { store } from '../redux/store';
import { repairWarningRegistry } from '../components/repairWarning/RepairWarning';
import { questLogRegistry } from '../components/quests/QuestLog';
import { questTrackerRegistry } from '../components/quests/QuestTracker';
import { levelNotificationsRegistry, questNotificationsRegistry } from '../components/NotificationToasts';

// We need this at the file level to handle the cases where registerHUDWidget() is
// called before the HUDService is initialized.
export function registerHUDWidget(registration: HUDWidgetRegistration): void {
  store.dispatch(registerWidget(registration));
}

export class HUDService extends ExternalDataSource {
  protected override bind(): Promise<ListenerHandle[]> {
    this.DEBUGRegisterWidgets();

    // Pull data from LocalStorage and send it to Redux.
    const widgets = clientAPI.getWidgets();
    this.dispatch(updateWidgetStates(widgets));

    const poisToHide = clientAPI.getPOIsToHide();
    this.dispatch(updatePOIsToHide(poisToHide));

    const groupPOIsToHide = clientAPI.getGroupPOIsToHide();
    this.dispatch(updateGroupPOIsToHide(groupPOIsToHide));

    this.dispatch(setNameplateStyle(clientAPI.getNameplateStyle()));
    this.dispatch(setPartyLayoutHorizontal(clientAPI.getPartyLayout() === 'horizontal'));
    this.dispatch(setUIScale(clientAPI.getUIScale()));

    this.dispatch(setInitialized({ topic: LoadingTopic.HUDWidgets, result: true }));

    return Promise.resolve([
      clientAPI.bindPartyLayoutChangedListener((layout) => {
        this.dispatch(setPartyLayoutHorizontal(layout === 'horizontal'));
      }),
      clientAPI.bindUIScaleChangedListener((scale) => {
        this.dispatch(setUIScale(scale));
      })
    ]);
  }

  private DEBUGRegisterWidgets() {
    registerHUDWidget(abilityBookRegistry);
    registerHUDWidget(abilityCastingRegistry);
    registerHUDWidget(bankRegistry);
    registerHUDWidget(chatRegistry);
    registerHUDWidget(craftingRegistry);
    registerHUDWidget(enemyTargetUnitFrameRegistry);
    registerHUDWidget(equippedRegistry);
    registerHUDWidget(friendlyTargetUnitFrameRegistry);
    registerHUDWidget(gameInfoRegistry);
    registerHUDWidget(gameMenuRegistry);
    registerHUDWidget(guildRegistry);
    registerHUDWidget(hudNavMenuRegistry);
    registerHUDWidget(inventoryRegistry);
    registerHUDWidget(levelBarsRegistry);
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
    registerHUDWidget(tradeRegistry);
    registerHUDWidget(tradeRequestsRegistry);
    registerHUDWidget(vendorRegistry);
    registerHUDWidget(warbandRegistry);
    registerHUDWidget(warningIconsRegistry);
    registerHUDWidget(worldMapRegistry);
    registerHUDWidget(zoneNameRegistry);
  }
}
