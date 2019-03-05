/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  border-radius: 2px;
  border: 1px solid #c7c7c7;
  background-color: transparent;
`;

const Bar = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: ${(props: any) => props.backgroundColor};
`;

const Wound = styled.div`
  z-index: 10;
  height: 3px;
  width: 2px;
  background-color: white;
`;

export interface BodyPartHealthBarProps {
  value: number;
  maxValue: number;
  width: number;
}

export class BodyPartHealthBar extends React.PureComponent<BodyPartHealthBarProps> {
  public render() {
    const { value, maxValue, width } = this.props;
    const currentHealth = ((value / maxValue) * 100);
    const wounds = Math.floor(currentHealth) === 0 ? [1, 2, 3] : Math.floor(currentHealth) < 33 ? [1, 2] :
      Math.floor(currentHealth) < 66 ? [1] : [];
    const barColor = Math.floor(currentHealth) === 0 ? 'transparent' : Math.floor(currentHealth) < 33 ? '#D10000' :
      Math.floor(currentHealth) < 66 ? '#F9B800' : '#39ABCE';

    return (
      <Container style={{ width }}>
        <Bar
          style={{ height: `${(value / maxValue) * 100}%` }}
          backgroundColor={barColor}
        />
        {wounds.map(wound => <Wound key={wound} />)}
      </Container>
    );
  }
}

export default BodyPartHealthBar;

