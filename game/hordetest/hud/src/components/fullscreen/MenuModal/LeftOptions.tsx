/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';

import { MyUserContext } from 'context/MyUserContext';
import { SetDisplayName } from '../SetDisplayName';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;1

const MenuTitle = styled.div`
  font-family: Colus;
  font-size: 24px;
  color: #3d3d3d;
  padding-top: 22px;
  padding-bottom: 22px;
  padding-left: 40px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-family: Lato;
  font-weight: bold;
  color: white;
  font-size: 18px;
  background: transparent;
  transition: background 0.2s, padding-left 0.2s;
  cursor: pointer;
  height: 60px;
  padding-left: 40px;

  &.exit {
    color: #EE1C25;
  }

  &:hover {
    background: linear-gradient(to right, #273a64, transparent);
    padding-left: 60px;
  }
`;

export interface Props {
}

export function LeftOptions(props: Props) {
  const myUserContext = useContext(MyUserContext);

  function onSettingsClick() {
    game.trigger('navigate', 'settings');
    game.trigger('hide-menu-modal');
  }

  function onExitClick() {
    game.quit();
  }

  function showChangeDisplayName() {
    game.trigger('show-middle-modal', <SetDisplayName onDisplayNameSet={onDisplayNameSet} />, false, true);
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP);
  }

  function showCreditsScreen() {
    game.trigger('show-credits-screen');
  }

  function onDisplayNameSet() {
    myUserContext.refetch();
  }

  function onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  return (
    <Container>
      <MenuTitle>Menu</MenuTitle>
      {/* <Item>Battle Log</Item> */}
      <Item onClick={onSettingsClick} onMouseEnter={onMouseEnter}>Settings</Item>
      <Item onClick={showChangeDisplayName} onMouseEnter={onMouseEnter}>Change Display Name</Item>
      <Item onClick={showCreditsScreen} onMouseEnter={onMouseEnter}>Credits</Item>
      {/* <Item>Select Game Mode</Item> */}
      {/* <Item>Support</Item> */}
      {/* <Item>Legal</Item>
      <Item>News</Item> */}
      <Item className='exit' onClick={onExitClick} onMouseEnter={onMouseEnter}>Exit Game</Item>
    </Container>
  );
}
