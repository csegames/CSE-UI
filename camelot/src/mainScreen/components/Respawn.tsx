/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  HUDHorizontalAnchor,
  HUDLayer,
  HUDVerticalAnchor,
  HUDWidgetRegistration,
  addMenuWidgetExiting
} from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { Button } from './Button';

const Root = 'HUD-Respawn-Root';
const Text = 'HUD-Respawn-Text';

interface ReactProps {}

interface InjectedProps {
  dispatch?: Dispatch;
  respawn: (spawnLocationID: string) => void;
}

type Props = ReactProps & InjectedProps;

class ARespawn extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Root}>
        <span className={Text}>You Died!</span>
        <Button onClick={this.respawn.bind(this)}>Respawn</Button>
      </div>
    );
  }

  respawn(): void {
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_RESPAWN));
    this.props.respawn('-1');
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    respawn: state.player.respawn
  };
};

const Respawn = connect(mapStateToProps)(ARespawn);

export const WIDGET_NAME_RESPAWN = 'Respawn';
export const respawnRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_RESPAWN,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 0
  },
  layer: HUDLayer.Menus,
  render: () => {
    return <Respawn />;
  }
};
