/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// These SCSS imports get translated and put into the `dist/css/` folder by
// mini-css-extract-plugin at compile time.  A reference to the final CSS file
// is then automatically added to the HTML for this entry point.
import '../shared/Shared-Styles.scss';
import './MainScreen-Styles.scss';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as Sentry from '@sentry/browser';

import { game } from '@csegames/library/dist/_baseGame';
import { Provider as ReduxProvider } from 'react-redux';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { store } from './redux/store';
import { BaseHUD } from './components/BaseHUD';
import { LoadingScreen } from './components/loading';
import { AbilitiesService } from './dataSources/abilitiesService';
import { AnnouncementsService } from './dataSources/announcementsService';
import { BuildModeService } from './dataSources/buildModeService';
import { CharactersService } from './dataSources/charactersService';
import { CombatService } from './dataSources/combatService';
import { EntityStateService } from './dataSources/entityStateService';
import { GameDefsService } from './dataSources/gameDefsService';
import { GameInfoService } from './dataSources/gameInfoService';
import { HUDService } from './dataSources/hudService';
import { InventoryService } from './dataSources/inventoryService';
import { KeyActionsService } from './dataSources/keyActionsService';
import { KeybindsService } from './dataSources/keybindsService';
import { LoadingService } from './dataSources/loadingService';
import { PartyService } from './dataSources/partyService';
import { ManifestDefService } from './dataSources/manifest/manifestDefService';
import { PerformanceWarningsDataService } from './dataSources/performanceWarningsDataService';
import { ZonesService } from './dataSources/zonesService';
import { NetworkService } from './dataSources/networkService';
import { ImagePreloader } from '../shared/components/ImagePreloader';
import { WarbandService } from './dataSources/warbandService';
import { CraftingService } from './dataSources/craftingService';
import { GuildService } from './dataSources/guildService';
import { QuestService } from './dataSources/questService';
import { ClockService } from './dataSources/clockService';
import { TradeService } from './dataSources/tradeService';
import { NotificationsService } from './dataSources/notificationsService';
import { ZoneInstanceService } from './dataSources/zoneInstanceService';

initializeSentry();

ReactDom.render(
  <ErrorBoundary>
    <ReduxProvider store={store}>
      {/** TODO: Should all the services go into a single wrapper?  Going to be a bit of a list at the end of the day. */}
      <AbilitiesService />
      <AnnouncementsService />
      <BuildModeService />
      <CharactersService />
      <ClockService />
      <CombatService />
      <CraftingService />
      <EntityStateService />
      <GameDefsService />
      <GameInfoService />
      <GuildService />
      <HUDService />
      <InventoryService />
      <KeyActionsService />
      <KeybindsService />
      <LoadingService />
      <ManifestDefService />
      <NetworkService />
      <NotificationsService />
      <PartyService />
      <PerformanceWarningsDataService />
      <QuestService />
      <TradeService />
      <WarbandService />
      <ZonesService />
      <ZoneInstanceService />
      <ImagePreloader />
      <BaseHUD />
      <LoadingScreen />
    </ReduxProvider>
  </ErrorBoundary>,
  document.getElementById('mainScreen')
);

function initializeSentry() {
  if (game.isPublicBuild) {
    Sentry.init({
      dsn: 'https://f7710348f19c4a0f8f8cd83ea0aa343f@o175825.ingest.sentry.io/1259561',
      attachStacktrace: true
    });

    Sentry.setUser({ characterID: game.characterID });
  }
}
