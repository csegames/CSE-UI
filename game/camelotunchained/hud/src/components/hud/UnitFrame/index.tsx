/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import DistanceText from './DistanceText';
import { PlayerFrame } from './PlayerFrame';
import { NonPlayerFrame } from './NonPlayerFrame';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export interface UnitFrameProps {
  entityState: Omit<PlayerState | SiegeState | ResourceNodeState,
   'isReady' | 'updateEventName' | 'onUpdated' | 'onReady'>;

  // If set, then treat this health bar as a target frame
  target?: 'enemy' | 'friendly';

  // If true, then render as a warband frame
  warband?: boolean;
}

export class UnitFrame extends React.Component<UnitFrameProps> {

  public render() {
    const { target } = this.props;
    return (
      <Container data-input-group='block' className='unitFrame_Container'>
        {this.renderFrame()}
        {target && <DistanceText targetType={target} />}
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: UnitFrameProps) {
    if (Object.is(this.props, nextProps)) {
      return false;
    }

    if (Object.is(this.props.entityState, nextProps.entityState)) {
      return false;
    }

    return true;
  }

  public renderFrame = () => {
    switch (this.props.entityState.type) {
      case 'player': {
        return <PlayerFrame player={this.props.entityState as PlayerState} target={this.props.target} />;
      }
      default:
        return <NonPlayerFrame entity={this.props.entityState as any} target={this.props.target} />;
    }
  }
}
