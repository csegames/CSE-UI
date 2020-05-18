/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Header } from '../Header';
import { InputContext, InputContextState } from 'context/InputContext';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
  font-family: Colus;
`;

const ButtonIcon = styled.div`
  font-size: 30px;
  color: white;
  margin: 0 10px;
`;

export enum StartScreenRoute {
  Play,
  Champions,
  BattlePass,
  Store,
  Career,
  Leaderboards,
}

export interface Props {
  selectedRoute: StartScreenRoute;
  onSelectRoute: (route: StartScreenRoute) => void;
}

export function NavMenu(props: Props) {
  function onRouteClick(route: StartScreenRoute) {
    props.onSelectRoute(route);

    switch(route) {
      case StartScreenRoute.Champions: {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_CHAMPION_OPEN);
        break;
      }
      case StartScreenRoute.Career: {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_CAREER_OPEN);
        break;
      }
      case StartScreenRoute.Store: {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_STORE_OPEN);
        break;
      }
      default: {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
        break;
      }
    }
  }

  function onMouseEnterRoute() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  function renderRouteButton(route: StartScreenRoute, extraJSX?: JSX.Element | JSX.Element[]) {
    const isSelected = props.selectedRoute === route;
    return (
      <Header
        isSelected={isSelected}
        onClick={() => onRouteClick(route)}
        onMouseEnter={onMouseEnterRoute}>
          {StartScreenRoute[route].toTitleCase()}
          {extraJSX || ''}
      </Header>
    );
  }

  return (
    <InputContext.Consumer>
      {(inputContext: InputContextState) => {
        return (
          <Container>
            {inputContext.isConsole && <ButtonIcon className='icon-xb-lb' />}
            {renderRouteButton(StartScreenRoute.Play)}
            {renderRouteButton(StartScreenRoute.Champions)}
            {/* {renderRouteButton(StartScreenRoute.BattlePass)} */}
            {renderRouteButton(StartScreenRoute.Career)}
            {/* {renderRouteButton(StartScreenRoute.Leaderboards)} */}
            {renderRouteButton(StartScreenRoute.Store)}
            {inputContext.isConsole && <ButtonIcon className='icon-xb-rb' />}
          </Container>
        );
      }}
    </InputContext.Consumer>
  );
}
