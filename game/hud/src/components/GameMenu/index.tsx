/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, events } from '@csegames/camelot-unchained';
import styled, { css } from 'react-emotion';
import { CloseButton } from 'UI/CloseButton';

const OuterContainer = styled('div')`
  position: relative;
`;

const Container = styled('div')` {
  position: relative;
  pointer-events: all;
  width: 257px;
  height: 152px;
  margin:0 auto;
  background-color: gray;
  color: white;
  background: url(images/gamemenu/gamemenu-bg-grey.png) no-repeat;
  z-index: 1;
  border: 1px solid #6e6c6c;
  box-shadow: 0 0 30px 0 #000;
`;

const MenuTitle = styled('div')` {
  text-align: center;
  background: url(images/gamemenu/gamemenu-top-title.png) center top no-repeat;
  margin: 0 auto -9px auto;
  position: relative;
  z-index: 89;
  width: 256px;
  height: 23px;
  h6 {
    color: rgb(132,132,132);
    font-size: 9px;
    text-transform: uppercase;
    padding: 8px 0 0 0;
    margin: 0 0 0 0;
    letter-spacing: 2px;
    font-family: 'Caudex', serif;
  }
`;

const MenuCorner = styled('div')` {
  position: absolute;
  width: 100%;
  height: 100%;
  background:
  url(images/gamemenu/gamemenu-ornament-top-left.png) left 0 top 0 no-repeat,
  url(images/gamemenu/gamemenu-ornament-top-right.png) right 0 top 0 no-repeat,
  url(images/gamemenu/gamemenu-ornament-bottom-left.png) left 0 bottom 0 no-repeat,
  url(images/gamemenu/gamemenu-ornament-bottom-right.png) right 0 bottom 0 no-repeat;
  z-index: 1;
`;

const CloseButtonPosition = css`
  position: absolute;
  top: 6px;
  right: 7px;
`;

const MenuContent = styled('div')` {
  height: 115px;
  margin-top: 30px;
  max-height: 345px;
  padding: 10px 20px;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 50;
  position: absolute;
  width: 100%;
  width: calc(100% - 40px);
`;
const MenuButton = styled('div')`
  position: relative;
  background: url(images/gamemenu/button-big-off.png) no-repeat;
  height: 30px;
  width: 200px;
  margin: 12px 16px 0 16px;
  border: none;
  cursor: pointer;
  color: rgb(132,132,132);
  font-family: 'Caudex',serif;
  letter-spacing: 2px;
  font-size: 9px;
  text-transform: uppercase;
  margin: 0 auto 20px;
  display: block;
  line-height: 30px;
  text-align: center;
  &:hover {
    color: rgb(204,204,204);
    background: url(images/gamemenu/button-big-on.png) no-repeat;
    &::before {
      content: '';
      position: absolute;
      background-image: url(images/gamemenu/button-glow.png);
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-size: cover;
    }
  }
`;


export const GameMenuDimensions = {
  width: 257,
  height: 168,
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
      <OuterContainer>
        <MenuTitle><h6>Menu</h6></MenuTitle>
        <Container>
          <CloseButton onClick={this.fireVisibilityEvent} className={CloseButtonPosition} />
          <MenuCorner />
          <MenuContent>
              <MenuButton
                  onClick={this.onOptionsClick}>
                  Settings
              </MenuButton>
              <MenuButton
                  onClick={this.onQuitGameClick}>
                  Quit game
              </MenuButton>
          </MenuContent>
        </Container>
      </OuterContainer>

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

