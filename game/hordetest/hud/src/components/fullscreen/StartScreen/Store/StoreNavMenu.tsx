/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { StoreRoute } from './index';
import { Header } from 'components/fullscreen/Header';

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: Colus;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    width: 60%;
    height: 3px;
    background: linear-gradient(to right, transparent, rgba(36, 55, 97, 1), transparent);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 60%;
    height: 3px;
    background: linear-gradient(to right, transparent, rgba(36, 55, 97, 1), transparent);
  }

  opacity: 0;
  margin-top: -5%;
  animation: slideIn 0.5s forwards ;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-top: -5%;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
`;

const HeaderStyles = css`
  padding: 20px 30px;
`;

export interface Props {
  selectedRoute: StoreRoute;
  onSelectRoute: (route: StoreRoute) => void;
}

export function StoreNavMenu(props: Props) {
  function onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  function onClick(route: StoreRoute) {
    props.onSelectRoute(route);
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
  }

  function renderNavItem(route: StoreRoute, extraJSX?: JSX.Element | JSX.Element[]) {
    return (
      <Header
        className={HeaderStyles}
        isSelected={route === props.selectedRoute}
        onClick={() => onClick(route)}
        onMouseEnter={onMouseEnter}>
          {StoreRoute[route].toTitleCase()}
          {extraJSX || ''}
      </Header>
    );
  }

  return (
    <Container>
      {renderNavItem(StoreRoute.Featured)}
      {renderNavItem(StoreRoute.Weapons)}
      {renderNavItem(StoreRoute.Skins)}
    </Container>
  );
}
