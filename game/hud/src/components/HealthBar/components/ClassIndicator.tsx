/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Faction } from '@csegames/camelot-unchained';

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${(props: any) => props.top.toFixed(1)}px;
  left: ${(props: any) => props.left.toFixed(1)}px;
  background: url(${(props: any) => props.backgroundImg}) no-repeat;
  background-size: cover;
  color: white;
  width: ${(props: any) => props.width.toFixed(1)}px;
  height: ${(props: any) => props.height.toFixed(1)}px;
  border-radius: ${(props: any) => props.borderRadius.toFixed(1)}px;
  font-size: ${({ scale }: {scale: number}) => (30 * scale).toFixed(1)}px;
`;

export interface ClassIndicatorProps {
  faction: Faction;
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: number;
  scale: number;
}

export interface ClassIndicatorState {

}

class ClassIndicator extends React.PureComponent<ClassIndicatorProps, ClassIndicatorState> {
  public render() {
    const factionBackground = this.getFactionIndicator();
    const { top, left, width, height, borderRadius, scale } = this.props;
    return (
      <Container
        top={top}
        left={left}
        width={width}
        height={height}
        borderRadius={borderRadius}
        backgroundImg={factionBackground}
        scale={scale}
      >
        {Faction[this.props.faction].charAt(0)}
      </Container>
    );
  }

  private getFactionIndicator = () => {
    let factionBackground = '';
    switch (this.props.faction) {
      case Faction.Arthurian: {
        factionBackground = 'images/healthbar/regular/class_bg_arthurian.png';
        break;
      }
      case Faction.TDD: {
        factionBackground = 'images/healthbar/regular/class_bg_tdd.png';
        break;
      }
      case Faction.Viking: {
        factionBackground = 'images/healthbar/regular/class_bg_viking.png';
        break;
      }
      default: {
        factionBackground = 'images/healthbar/regular/class_bg_arthurian.png';
        break;
      }
    }
    return factionBackground;
  }
}

export default ClassIndicator;
