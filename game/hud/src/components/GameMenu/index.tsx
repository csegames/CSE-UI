/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-24 18:27:28
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-25 10:55:33
 */

import * as React from 'react';
import {client, events, utils} from 'camelot-unchained';
import {StyleSheet, css, StyleDeclaration} from 'aphrodite';

export interface GameMenuStyle extends StyleDeclaration {
  GameMenu: React.CSSProperties;
  gameMenuHeader: React.CSSProperties;
  gameMenuBody: React.CSSProperties;
  menuButton: React.CSSProperties;
  optionsButton: React.CSSProperties;
  closeButton: React.CSSProperties;
}

export const GameMenuDimensions = {
  width: 300,
  height: 200,
};

export const defaultGameMenuStyle: GameMenuStyle = {
  GameMenu: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    pointerEvents: 'all',
    width: '300px',
    height: '200px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  gameMenuHeader: {
    padding: '5px 0',
    textAlign: 'center',
    backgroundColor: '#202020',
    color: 'white',
    borderBottom: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  gameMenuBody: {
    padding: '5px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  gameMenuFooter: {
    display: 'flex',
    justifyContent: 'center',
    padding: '5px 0',
    backgroundColor: '#202020',
    color: 'white',
    borderTop: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  menuButton: {
    margin: '0',
    height: '30px',
    fontSize: '17px',
  },

  optionsButton: {
    margin: '0 0 5px 0',
  },

  closeButton: {
    margin: 0,
  },
};

export interface GameMenuProps {
  styles?: Partial<GameMenuStyle>;
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
    const ss = StyleSheet.create(defaultGameMenuStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return this.state.visible ? (
      <div className={css(ss.GameMenu, custom.GameMenu)}>
        <div className={css(ss.GameMenu, custom.GameMenu)}>
          <div className={css(ss.gameMenuHeader, custom.gameMenuHeader)}>
            MENU
          </div>
          <div className={css(ss.gameMenuBody, custom.gameMenuBody)}>
            <button
              className={css(ss.menuButton, custom.menuButton, ss.optionsButton, custom.optionsButton)}
              onClick={this.onOptionsClick}>
              OPTIONS
            </button>
            <button className={css(ss.menuButton, custom.menuButton)} onClick={this.onQuitGameClick}>QUIT GAME</button>
          </div>
          <div className={css(ss.gameMenuFooter, custom.gameMenuFooter)}>
            <button className={css(ss.closeButton, custom.closeButton)} onClick={this.fireVisibilityEvent}>
              CLOSE MENU
            </button>
          </div>
        </div>
      </div>
    ) : null;
  }

  public componentDidMount() {
    client.OnOpenUI(this.fireVisibilityEvent);
    client.OnCloseUI(this.fireVisibilityEvent);
    events.on('hudnav--navigate', this.handleVisibilityEvent);
  }

  private onOptionsClick = () => {
    events.fire('hudnav--navigate', 'options');
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

