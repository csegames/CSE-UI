/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import {
  HUDLayer,
  HUDWidgetRegistration,
  addAllConditionalWidgetsExiting,
  addConditionalWidgetExiting,
  toggleConditionalWidget
} from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { Menu } from './menu/Menu';
import { WIDGET_ID_SETTINGS } from './Settings';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { ConnectionStatus } from '@csegames/library/dist/_baseGame/types/ConnectionStatus';
import { FactionButton } from './FactionButton';
import { WithWebInterface } from '../redux/withWebInterface';
import { onToggleUIEditMode } from '../helpers/hudEditModeHelpers';

const Root = 'HUD-GameMenu-Root';
const Container = 'HUD-GameMenu-Container';
const MenuButton = 'HUD-GameMenu-MenuButton';

const StringIDGameMenuTitle = 'GameMenuTitle';
const StringIDGameMenuSettings = 'GameMenuSettings';
const StringIDGameMenuLogOut = 'GameMenuLogOut';
const StringIDGameMenuQuit = 'GameMenuQuit';
const StringIDGameMenuEditUI = 'GameMenuEditUI';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  connectionStatus: ConnectionStatus;
  isEditingHUD: boolean;
  activeConditionalWidgetIDs: string[];
}

type Props = ReactProps & InjectedProps;

class AGameMenu extends WithWebInterface(React.Component<Props & DispatchProp>) {
  render(): JSX.Element {
    const isLoggedOut =
      this.props.connectionStatus !== ConnectionStatus.Connected &&
      this.props.connectionStatus !== ConnectionStatus.Offline;

    return (
      <div className={Root}>
        <Menu
          isDragCopy={this.props.isDragCopy}
          title={getStringTableValue(StringIDGameMenuTitle, this.props.stringTable)}
          menuID={WIDGET_ID_GAME_MENU}
          closeSelf={this.closeSelf.bind(this)}
          escapable
        >
          <div className={Container}>
            <FactionButton className={MenuButton} onClick={this.openSettings.bind(this)}>
              {getStringTableValue(StringIDGameMenuSettings, this.props.stringTable)}
            </FactionButton>
            {!isLoggedOut && (
              <FactionButton className={MenuButton} onClick={this.editUI.bind(this)}>
                {getStringTableValue(StringIDGameMenuEditUI, this.props.stringTable)}
              </FactionButton>
            )}
            {!isLoggedOut && (
              <FactionButton className={MenuButton} onClick={this.logOut.bind(this)}>
                {getStringTableValue(StringIDGameMenuLogOut, this.props.stringTable)}
              </FactionButton>
            )}
            <FactionButton className={MenuButton} onClick={this.quitGame.bind(this)}>
              {getStringTableValue(StringIDGameMenuQuit, this.props.stringTable)}
            </FactionButton>
          </div>
        </Menu>
      </div>
    );
  }

  closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_GAME_MENU));
  }

  private openSettings(): void {
    this.closeSelf();
    this.props.dispatch(toggleConditionalWidget(WIDGET_ID_SETTINGS));
    clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_SELECT);
  }

  private editUI(): void {
    this.closeSelf();
    onToggleUIEditMode(this.props.isEditingHUD, this.props.activeConditionalWidgetIDs, this.props.dispatch);
  }

  private logOut(): void {
    this.props.dispatch?.(addAllConditionalWidgetsExiting());
    this.closeSelf();
    clientAPI.disconnect();
    clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_SELECT);
    clientAPI.setCharacter('').then(() => this.resetGraphQL());
  }

  private quitGame(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_SELECT);
    clientAPI.quit();
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    connectionStatus: state.loading.connectionStatus,
    isEditingHUD: state.hud.isEditingHUD,
    activeConditionalWidgetIDs: state.hud.activeConditionalWidgetIDs
  };
};

const GameMenu = connect(mapStateToProps)(AGameMenu);

export const WIDGET_ID_GAME_MENU = 'Game Menu';
export const gameMenuRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_GAME_MENU,
  nameStringID: 'HUDEditorWidgetNameGameMenu',
  nativeWidgetID: 'gamemenu',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 0
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.Top,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <GameMenu isDragCopy={isDragCopy} />;
  }
};
