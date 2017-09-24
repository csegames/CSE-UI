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
import reducer from './services/session';
import {PlayerState, doThing, initializePlayerSession} from './services/session/player';
import {BodyParts} from '../../lib/PlayerStatus';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export interface ContainerProps {
  containerClass?: string;
  isMini?: boolean;
}

export interface PlayerHealthProps extends ContainerProps {
  dispatch: (action: any) => any;
  player: PlayerState;
}

export interface PlayerHealthState {
}

class PlayerHealth extends React.Component<PlayerHealthProps, PlayerHealthState> {

  constructor(props: PlayerHealthProps) {
    super(props);
  }

  public render() {
    const hide = this.props.player.playerStatus.name === '';
    if (hide) return null;
    const dead = this.props.player.playerStatus.blood.current <= 0 ||
      this.props.player.playerStatus.health[BodyParts.Torso].current <= 0;
    return (
      <div className={`Playerhealth ${this.props.containerClass}`}
       onClick={() =>  hasClientAPI() || dead ? '' : this.props.dispatch(doThing())}>
        <PlayerStatusComponent
          containerClass='PlayerHealth'
          playerStatus={this.props.player.playerStatus}
          events={this.props.player.events}
        />
      </div>
    );
  }

  public componentDidMount() {
    this.props.dispatch(initializePlayerSession());
  }
}

const PlayerComp = connect((state) => {
   return {
    player: state.player,
  };
})(PlayerHealth);

class Container extends React.Component<ContainerProps,{}> {
  public render() {
    return (
      <Provider store={store}>
        <PlayerComp {...(this.props as any)}/>
      </Provider>
    );
  }
}

export default Container;
