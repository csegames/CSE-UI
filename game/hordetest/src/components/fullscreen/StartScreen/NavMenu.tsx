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
}

export interface Props {
  selectedRoute: StartScreenRoute;
  onSelectRoute: (route: StartScreenRoute) => void;
}

export function NavMenu(props: Props) {
  function renderRouteButton(route: StartScreenRoute, extraJSX?: JSX.Element | JSX.Element[]) {
    const isSelected = props.selectedRoute === route;
    return (
      <Header
        isSelected={isSelected}
        onClick={() => props.onSelectRoute(route)}>
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
            {renderRouteButton(StartScreenRoute.BattlePass)}
            {renderRouteButton(StartScreenRoute.Store)}
            {inputContext.isConsole && <ButtonIcon className='icon-xb-rb' />}
          </Container>
        );
      }}
    </InputContext.Consumer>
  );
}
