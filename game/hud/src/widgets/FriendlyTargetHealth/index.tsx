/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk';
import {hasClientAPI} from 'camelot-unchained';

import PlayerStatusComponent from '../../components/PlayerStatusComponent';
import reducer, {SessionState} from './services/session';
import {PlayerState, doThing, initializePlayerSession} from './services/session/target';
import {BodyParts} from '../../lib/PlayerStatus';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export interface ContainerProps {
  containerClass?: string;
  isMini?: boolean;
}

export interface TargetHealthProps extends ContainerProps {
  dispatch: (action: any) => any;
  player: PlayerState;
}

export interface TargetHealthState {
}

function select(state: SessionState) {
  return {
    player: state.player,
  };
}

class TargetHealth extends React.Component<TargetHealthProps, TargetHealthState> {

  constructor(props: TargetHealthProps) {
    super(props);
  }

  public render() {
    const hide = this.props.player.playerStatus.name === '';

    const { position, targetPosition } = this.props.player.playerStatus;
    const a = position.x - targetPosition.x;
    const b = position.y - targetPosition.y;
    const distance = Math.ceil(Math.sqrt( a * a + b * b ) * 100) / 100;

    if (hide) return null;

    const dead = this.props.player.playerStatus.blood.current <= 0 ||
      this.props.player.playerStatus.health[BodyParts.Torso].current <= 0;

    return (
      <div
        className={`player-health ${this.props.containerClass}`}
        onClick={() =>  hasClientAPI() || dead ? '' : this.props.dispatch(doThing())}>
        <PlayerStatusComponent
          containerClass='TargetHealth'
          mirror={true}
          playerStatus={this.props.player.playerStatus}
          events={this.props.player.events}
        />
        <div className='player-health-distance'>
          {distance} m
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.props.dispatch(initializePlayerSession());
  }
}

const TargetComp = connect(select)(TargetHealth);

class Container extends React.Component<ContainerProps,{}> {
  public render() {
    return (
      <Provider store={store}>
        <TargetComp {...(this.props as any)} />
      </Provider>
    );
  }
}

export default Container;
