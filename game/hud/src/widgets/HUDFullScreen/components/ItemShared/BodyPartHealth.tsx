/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { client, bodyParts } from '@csegames/camelot-unchained';

export interface BodyPartHealthStyles {
  healthInfoContainer: React.CSSProperties;
  healthCompContainer: React.CSSProperties;
  healthCompInfo: React.CSSProperties;
  healthCompPrimaryText: React.CSSProperties;
  healthCompSecondaryText: React.CSSProperties;
  icon: React.CSSProperties;
  flipIcon: React.CSSProperties;
}

const HealthInfoContainer = styled('div')`
  position: relative;
  display: flex;
  justify-content: space-around;
  width: 50%;
  &:before {
    content: '';
    width: 100%;
    height: 13px;
    position: absolute;
    top: -15px;
    right: 0;
    left: 0;
    background: url(images/paperdoll/ornament-health-mid-top.png) no-repeat;
    background-size: contain;
  }
  &:after {
    content: '';
    width: 100%;
    height: 13px;
    position: absolute;
    right: 0;
    bottom: -15px;
    left: 0;
    background: url(images/paperdoll/ornament-health-mid-bot.png) no-repeat;
    background-size: contain;
  }
`;

const SectionContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HealthCompContainer = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: ${(props: { marginBottom: number }) => props.marginBottom}px;
`;

const HealthCompInfo = styled('div')`
  display: flex;
  flex-direction: column;
`;

const HealthCompSecondaryText = styled('div')`
  margin: 0;
  padding: 0;
  color: #707475;
  font-size: 14px;
  font-family: TitilliumWeb;
`;

const Icon = styled('div')`
  font-size: 14px;
  font-family: TitilliumWeb;
  color: #707475;
  margin-right: 5px;
  &.isRightPart {
    transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
  }
`;

export interface MaxHealthPartsInfo {
  [bodyPart: string]: number;
}

export interface BodyPartHealthProps {
  styles?: Partial<BodyPartHealthStyles>;
  maxHealthParts: MaxHealthPartsInfo;
}

export enum HealthBodyParts {
  Head,
  Torso,
  LeftArm,
  RightArm,
  LeftLeg,
  RightLeg,
}

export const healthBodyParts = {
  head: HealthBodyParts.Head,
  torso: HealthBodyParts.Torso,
  leftArm: HealthBodyParts.LeftArm,
  rightArm: HealthBodyParts.RightArm,
  leftLeg: HealthBodyParts.LeftLeg,
  rightLeg: HealthBodyParts.RightLeg,
};

interface BodyPartItemProps {
  isRightPart: boolean;
  bodyPart: bodyParts;
  iconName: string;
  marginBottom?: number;
}

class BodyPartItem extends React.PureComponent<BodyPartItemProps> {
  public render() {
    const { isRightPart, iconName, marginBottom } = this.props;

    return (
      <HealthCompContainer marginBottom={marginBottom}>
        <Icon className={(isRightPart ? 'isRightPart' : '') + ` ${iconName}`} />
        <HealthCompInfo>
          <HealthCompSecondaryText>
            HP {this.getMaxHealth()}
          </HealthCompSecondaryText>
        </HealthCompInfo>
      </HealthCompContainer>
    );
  }

  private getMaxHealth = () => {
    const { bodyPart } = this.props;
    if (client.playerState.health[bodyPart]) {
      return client.playerState.health[bodyPart].max;
    }

    return 'N/A';
  }
}

class BodyPartHealth extends React.Component<BodyPartHealthProps, {}> {
  public render() {
    return (
      <HealthInfoContainer>
        <SectionContainer>
          <BodyPartItem marginBottom={5} isRightPart={false} bodyPart={bodyParts.LEFTARM} iconName={'icon-health-arm'} />
          <BodyPartItem isRightPart={true} bodyPart={bodyParts.RIGHTARM} iconName={'icon-health-arm'} />
        </SectionContainer>

        <SectionContainer>
          <BodyPartItem marginBottom={5} isRightPart={false} bodyPart={bodyParts.HEAD} iconName={'icon-health-head'} />
          <BodyPartItem isRightPart={false} bodyPart={bodyParts.TORSO} iconName={'icon-health-torso'} />
        </SectionContainer>

        <SectionContainer>
          <BodyPartItem marginBottom={5} isRightPart={false} bodyPart={bodyParts.LEFTLEG} iconName={'icon-health-leg'} />
          <BodyPartItem isRightPart={true} bodyPart={bodyParts.RIGHTLEG} iconName={'icon-health-leg'} />
        </SectionContainer>
      </HealthInfoContainer>
    );
  }

  public shouldComponentUpdate(nextProps: BodyPartHealthProps) {
    return !_.isEqual(this.props, nextProps);
  }
}

export default BodyPartHealth;
