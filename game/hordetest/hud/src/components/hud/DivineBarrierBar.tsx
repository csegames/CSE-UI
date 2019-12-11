/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: relative;
  width: 200px;
  height: 37px;
  opacity: 0;
  transition: opacity 0.3s;

  &.active {
    opacity: 1;
  }
`;

const BarContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  -webkit-mask-image: url(../images/hud/divine-barrier/barrier-bar.svg);
  -webkit-mask-size: contain;
`;

const Bar = styled.div`
  height: 100%;
  width: ${(props: { width: number & React.HTMLProps<HTMLDivElement> }) => props.width}%;
  background-color: #3bccff;
  transition: width 0.1s linear;
`;

const Border = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 6px;
`;

export interface Props {
}

export interface State {
  divineBarrier: CurrentMax;
  isActive: boolean;
}

export class DivineBarrierBar extends React.Component<Props, State> {
  private evh: EventHandle;
  private activeTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      divineBarrier: cloneDeep(hordetest.game.selfPlayerState.blood),
      isActive: false,
    };
  }

  public render() {
    const { divineBarrier } = this.state;
    return (
      <Container className={this.state.isActive ? 'active' : ''}>
        <BarContainer>
          <Bar width={(divineBarrier.current / divineBarrier.max * 100)} />
        </BarContainer>
        <Border src='images/hud/divine-barrier/barrier-bar-border-01.svg' />
      </Container>
    );
  }

  public componentDidMount() {
    this.evh = hordetest.game.selfPlayerState.onUpdated(() => {
      if (!this.state.divineBarrier.current.floatEquals(hordetest.game.selfPlayerState.blood.current) ||
          !this.state.divineBarrier.max.floatEquals(hordetest.game.selfPlayerState.blood.max)) {
        this.setState({ divineBarrier: cloneDeep(hordetest.game.selfPlayerState.blood) });
        this.playIsActive();
      }
    });
  }

  public componentWillUnmount() {
    this.evh.clear();
    this.evh = null;
  }

  private playIsActive = () => {
    if (this.activeTimeout) {
      window.clearTimeout(this.activeTimeout);
    }

    if (!this.state.isActive) {
      this.setState({ isActive: true });
    }

    const isMax = hordetest.game.selfPlayerState.blood.current === hordetest.game.selfPlayerState.blood.max;

    this.activeTimeout = window.setTimeout(() => {
      this.setState({ isActive: false });
      this.activeTimeout = null;
    }, isMax ? 1000 : 7000);
  }
}
