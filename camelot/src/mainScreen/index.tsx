/**
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

import { ErrorBoundary } from '@csegames/library/dist/_baseGame/types/ErrorBoundary';
import { game } from '@csegames/library/dist/_baseGame';
import { Provider as ReduxProvider } from 'react-redux';
import { store, RootState } from './redux/store';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import BaseHUD from './components/BaseHUD';
import { registerClientSlashCommands } from './slashCommands/clientCommands';
import { registerGeneralSlashCommands } from './slashCommands/generalCommands';
import { registerUISlashCommands } from './slashCommands/uiCommands';
import { AbilitiesService } from './dataSources/abilitiesService';
import { AlertsService } from './dataSources/alertsService';
import { AnnouncementsService } from './dataSources/announcementsService';
import { BuildModeService } from './dataSources/buildModeService';
import { ChatService } from './dataSources/chatService';
import { CombatService } from './dataSources/combatService';
import { EntityStateService } from './dataSources/entityStateService';
import { EquippedItemsService } from './dataSources/equippedItemsService';
import { GameDefsService } from './dataSources/gameDefsService';
import { HUDService } from './dataSources/hudService';
import { InventoryService } from './dataSources/inventoryService';
import { KeyActionsService } from './dataSources/keyActionsService';
import { KeybindsService } from './dataSources/keybindsService';
import { ScenarioService } from './dataSources/scenarioService';
import { SelfPlayerStateService } from './dataSources/selfPlayerStateService';
import { WarbandService } from './dataSources/warbandService';
import { ZonesService } from './dataSources/zonesService';
import { LoadingScreen } from '../loadingScreen/components/LoadingScreen';
import { ManifestDefService } from './dataSources/manifest/manifestDefService';

initializeSentry();

const slashCommands = new SlashCommandRegistry<RootState>(() => store.getState());
const handles = registerClientSlashCommands(slashCommands);
handles.push(...registerGeneralSlashCommands(slashCommands));
handles.push(...registerUISlashCommands(slashCommands));

ReactDom.render(
  <ErrorBoundary>
    <ReduxProvider store={store}>
      {/** TODO: Should all the services go into a single wrapper?  Going to be a bit of a list at the end of the day. */}
      <AbilitiesService />
      <AlertsService />
      <AnnouncementsService />
      <BuildModeService />
      <ChatService />
      <CombatService />
      <EntityStateService />
      <EquippedItemsService />
      <GameDefsService />
      <HUDService />
      <InventoryService />
      <KeyActionsService />
      <KeybindsService />
      <ManifestDefService />
      <ScenarioService />
      <SelfPlayerStateService />
      <WarbandService />
      <ZonesService />

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
