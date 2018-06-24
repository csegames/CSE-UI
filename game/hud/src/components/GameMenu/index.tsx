/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, events } from '@csegames/camelot-unchained';
import styled from 'react-emotion';

export interface GameMenuStyle {
  GameMenu: React.CSSProperties;
  gameMenuHeader: React.CSSProperties;
  gameMenuBody: React.CSSProperties;
  menuButton: React.CSSProperties;
  optionsButton: React.CSSProperties;
  closeButton: React.CSSProperties;
}

const OuterContainer = styled('div')`
  position: relative;
`;

const Container = styled('div')` {
  position: relative;
  pointer-events: all;
  width: 320px;
  height: 200px;
  padding: 0px;
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
  z-index: 999;
  width: 319px;
  height: 23px;
  h6 {
    color: #848484;
    font-size: 10px;
    text-transform: uppercase;
    padding: 7px 0 0 0;
    margin: 0 0 0 0;
    font-family: 'Caudex', serif;
  }
`;

const MenuCorner = styled('div')` {
  position: absolute;
  min-width: 320px;
  min-height: 200px;
  background:
  url(images/gamemenu/gamemenu-ornament-top-left.png) left 0 top 0 no-repeat,
  url(images/gamemenu/gamemenu-ornament-top-right.png) right 0 top 0 no-repeat,
  url(images/gamemenu/gamemenu-ornament-bottom-left.png) left 0 bottom 0 no-repeat,
  url(images/gamemenu/gamemenu-ornament-bottom-right.png) right 0 bottom 0 no-repeat;
  z-index: 1;
`;

const MenuContent = styled('div')` {
  height: 115px;
  margin-top: 30px;
  max-height: 345px;
  padding: 10px 20px;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 99;
  position: absolute;
  width: 100%;
  width: calc(100% - 40px);
`;
const MenuButton = styled('div')`
  background: url(images/gamemenu/button-big-off.png) no-repeat;
  width: 200px;
  height: 30px;;
  border: none;
  margin: 12px 16px 0 16px;
  cursor: pointer;
  color: #848484;
  font-family: 'Caudex', serif;
  font-size: 12px;
  text-transform: uppercase;
  margin: 0 auto 20px;
  display: block;
  line-height: 30px;
  text-align: center;
  &:hover {
    color: #968876;
    background: url(images/gamemenu/button-big-on.png) no-repeat;
  }
`;

const MenuFooter = styled('div')` {
  position: absolute;
  min-width: 320px;
  height: 55px;
  bottom: 0;
  left: 0;
  background: rgba(55, 52, 51, 0.3);
  border-top: 1px solid #3b3634;
`;

const MenuFooterButton = styled('div')`
  background: url(images/gamemenu/button-off.png) no-repeat;
  width: 95px;
  height: 30px;;
  border: none;
  margin: 12px 16px 0 16px;
  cursor: pointer;
  color: #848484;
  font-family: 'Caudex', serif;
  font-size: 12px;
  text-transform: uppercase;
  line-height: 30px;
  text-align: center;
  &:hover {
    color: #968876;
    background: url(images/gamemenu/button-on.png) no-repeat;
  }
`;

const MenuFooterBorder = styled('div')` {
  position: absolute;
  border: 1px solid #2e2b28;
  margin: 7px 10px 0;
  display: block;
  width: 300px;
  height: 40px;
  z-index: 3;
`;

const MenuButtonOuter = styled('div')` {
  position: absolute;
  width: 100%;
  z-index: 4;
  display: flex;
  justify-content: center;
`;

const MenuButtonLeft = styled('div')` {
  background: url(images/gamemenu/gamemenu-botnav-left-ornament.png) no-repeat;
  height: 55px;
  width: 75px
`;

const MenuButtonRight = styled('div')` {
  background: url(images/gamemenu/gamemenu-botnav-right-ornament.png) no-repeat;
  height: 55px;
  width: 75px
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
      <OuterContainer>
        <MenuTitle><h6>Menu</h6></MenuTitle>
        <MenuCorner />
        <Container>
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
          <MenuFooter>
              <MenuFooterBorder />
              <MenuButtonOuter>
                  <MenuButtonLeft />
                    <MenuFooterButton
                      onClick={this.fireVisibilityEvent}>
                      Close menu
                    </MenuFooterButton>
                  <MenuButtonRight />
              </MenuButtonOuter>
          </MenuFooter>
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

