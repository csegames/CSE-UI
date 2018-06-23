/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, events, utils } from '@csegames/camelot-unchained';
import styled, { css } from 'react-emotion';

export interface GameMenuStyle {
  GameMenu: React.CSSProperties;
  gameMenuHeader: React.CSSProperties;
  gameMenuBody: React.CSSProperties;
  menuButton: React.CSSProperties;
  optionsButton: React.CSSProperties;
  closeButton: React.CSSProperties;
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: all;
  width: 300px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid ${utils.lightenColor('#202020', 30)};
`;

const Header = styled('div')`
  padding: 5px 0;
  text-align: center;
  background-color: #202020;
  color: white;
  border-bottom: 1px solid ${utils.lightenColor('#202020', 30)};
`;

const Body = styled('div')`
  padding: 5px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Footer = styled('div')`
  display: flex;
  justify-content: center;
  padding: 5px 0;
  background-color: #202020;
  color: white;
  border-top: 1px solid ${utils.lightenColor('#202020', 30)}
`;

const MenuButton = styled('button')`
  margin: 0;
  height: 30px;
  font-size: 17px;
`;

const OptionsButton = css`
  margin: 0 0 5px 0;
`;

const CloseButton = styled('button')`
  margin: 0;
`;

export const GameMenuDimensions = {
  width: 300,
  height: 200,
};

export interface GameMenuProps {
}

export interface GameMenuState {
  // Used to show game menu or GameMenu screen
  visible: boolean;
}

export class GameMenu extends React.Component<GameMenuProps, GameMenuState> {
  constructor(props: GameMenuProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    return this.state.visible ? (
      <Container>
        <Header>
          MENU
        </Header>
        <Body>
          <MenuButton
            className={OptionsButton}
            onClick={this.onOptionsClick}>
            SETTINGS
          </MenuButton>
          <MenuButton onClick={this.onQuitGameClick}>QUIT GAME</MenuButton>
        </Body>
        <Footer>
          <CloseButton onClick={this.fireVisibilityEvent}>CLOSE MENU</CloseButton>
        </Footer>
      </Container>
    ) : null;
  }

  public componentDidMount() {
    client.OnOpenUI(this.fireVisibilityEvent);
    client.OnCloseUI(this.fireVisibilityEvent);
    events.on('hudnav--navigate', this.handleVisibilityEvent);
  }

  private onOptionsClick = () => {
    events.fire('hudnav--navigate', 'settings');
    events.fire('hudnav--navigate', 'gamemenu');
  }

  private onQuitGameClick = () => {
    client.Quit();
  }

  private handleVisibilityEvent = (name: string) => {
    if (name === 'gamemenu') {
      this.setState((state, props) => {
        if (state.visible) {
          client.ReleaseInputOwnership();
          return {
            visible: false,
            showOptions: false,
          };
        }
        return {
          visible: true,
        };
      });
    }
  }

  private fireVisibilityEvent = () => {
    events.fire('hudnav--navigate', 'gamemenu');
  }
}

export default GameMenu;

