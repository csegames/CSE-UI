/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  HUDHorizontalAnchor,
  HUDLayer,
  HUDVerticalAnchor,
  HUDWidgetRegistration,
  addMenuWidgetExiting,
  toggleMenuWidget
} from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { Menu } from './menu/Menu';
import { WIDGET_NAME_SETTINGS } from './Settings';
import { Button } from './Button';

const Root = 'HUD-GameMenu-Root';
const Container = 'HUD-GameMenu-Container';
const MenuButton = 'HUD-GameMenu-MenuButton';

interface ReactProps {}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AGameMenu extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Root}>
        <Menu title='Menu' menuID={WIDGET_NAME_GAME_MENU} closeSelf={this.closeSelf.bind(this)} escapable>
          <div className={Container}>
            <Button className={MenuButton} onClick={this.openSettings.bind(this)}>
              Settings
            </Button>
            <Button className={MenuButton} onClick={this.quitGame.bind(this)}>
              Quit game
            </Button>
          </div>
        </Menu>
      </div>
    );
  }
  closeSelf(): void {
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_GAME_MENU));
  }
  openSettings(): void {
    this.closeSelf();
    this.props.dispatch(toggleMenuWidget({ widgetId: WIDGET_NAME_SETTINGS, escapableId: WIDGET_NAME_SETTINGS }));
  }
  quitGame(): void {
    game.quit();
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

const GameMenu = connect(mapStateToProps)(AGameMenu);

export const WIDGET_NAME_GAME_MENU = 'Game Menu';
export const gameMenuRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_GAME_MENU,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 0
  },
  layer: HUDLayer.Menus,
  render: () => {
    return <GameMenu />;
  }
};
