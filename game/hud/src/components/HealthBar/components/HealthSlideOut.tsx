/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { BodyParts } from 'lib/PlayerStatus';

const Container = styled('div')`
  position: absolute;
  right: ${(props: any) => props.right.toFixed(1)}px;
  top: 86px;
  height: ${(props: any) => props.height.toFixed(1)}px;
  width: 71px;
  background: url(images/healthbar/regular/slide_out.png);
  transition: right 0.5s;
  -webkit-transition: right 0.5s;
`;

const ValuesContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${(props: any) => props.height.toFixed(1)}px;
  width: 50px;
  margin-left: ${(props: any) => props.marginLeft.toFixed(1)}px;
`;

const Value = styled('div')`
  color: white;
  width: 100%;
  text-align: center;
  font-size: 16px;
  line-height: 16px;
  -webkit-transition: opacity 0.5s;
`;

export interface HealthSlideOutProps {
  isVisible: boolean;
  height: number;
  right: number;
  bodyPartsCurrentHealth: number[];
  currentStamina: number;
  valueOpacity: number;
}

export interface HealthSlideOutState {

}

class HealthSlideOut extends React.Component<HealthSlideOutProps, HealthSlideOutState> {
  public render() {
    const { bodyPartsCurrentHealth, currentStamina } = this.props;
    return (
      <Container right={this.props.right} height={this.props.height}>
        <ValuesContainer marginLeft={10} height={45}>
          <Value style={{ opacity: this.props.valueOpacity }}>{bodyPartsCurrentHealth[BodyParts.RightArm]}</Value>
          <Value style={{ opacity: this.props.valueOpacity }}>{bodyPartsCurrentHealth[BodyParts.LeftArm]}</Value>
        </ValuesContainer>
        <ValuesContainer marginLeft={18} height={48}>
          <Value style={{ opacity: this.props.valueOpacity }}>{bodyPartsCurrentHealth[BodyParts.Head]}</Value>
        </ValuesContainer>
        <ValuesContainer marginLeft={18} height={48}>
          <Value style={{ opacity: this.props.valueOpacity }}>{bodyPartsCurrentHealth[BodyParts.Torso]}</Value>
        </ValuesContainer>
        <ValuesContainer marginLeft={10} height={45}>
          <Value style={{ opacity: this.props.valueOpacity }}>{bodyPartsCurrentHealth[BodyParts.RightLeg]}</Value>
          <Value style={{ opacity: this.props.valueOpacity }}>{bodyPartsCurrentHealth[BodyParts.LeftLeg]}</Value>
        </ValuesContainer>
        <ValuesContainer marginLeft={10} height={20}>
          <Value style={{ opacity: this.props.valueOpacity }}>{currentStamina}</Value>
        </ValuesContainer>
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: HealthSlideOutProps) {
    return this.props.isVisible || nextProps.isVisible && (
      !_.isEqual(nextProps.bodyPartsCurrentHealth, this.props.bodyPartsCurrentHealth) ||
      nextProps.currentStamina !== this.props.currentStamina || nextProps.right !== this.props.right
    );
  }
}

export default HealthSlideOut;
