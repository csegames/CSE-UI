/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

export interface BodyPartHealthStyles {
  healthInfoContainer: React.CSSProperties;
  healthCompContainer: React.CSSProperties;
  healthCompInfo: React.CSSProperties;
  healthCompPrimaryText: React.CSSProperties;
  healthCompSecondaryText: React.CSSProperties;
  icon: React.CSSProperties;
  flipIcon: React.CSSProperties;
}

// #region HealthInfoContainer constants
const HEALTH_INFO_CONTAINER_ORNAMENT_HEIGHT = 26;
const HEALTH_INFO_CONTAINER_ORNAMENT_VERTICAL_ALIGNMENT = -30;
// #endregion
const HealthInfoContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
  width: 50%;
  &:before {
    content: '';
    width: 100%;
    height: ${HEALTH_INFO_CONTAINER_ORNAMENT_HEIGHT}px;
    top: ${HEALTH_INFO_CONTAINER_ORNAMENT_VERTICAL_ALIGNMENT}px;
    position: absolute;
    right: 0;
    left: 0;
    background: url(../images/paperdoll/ornament-health-mid-top.png) no-repeat;
    background-size: contain;
  }
  &:after {
    content: '';
    width: 100%;
    height: ${HEALTH_INFO_CONTAINER_ORNAMENT_HEIGHT}px;
    bottom: ${HEALTH_INFO_CONTAINER_ORNAMENT_VERTICAL_ALIGNMENT}px;
    position: absolute;
    right: 0;
    left: 0;
    background: url(../images/paperdoll/ornament-health-mid-bot.png) no-repeat;
    background-size: contain;
  }

  @media (max-width: 2560px) {
    &:before {
      height: ${HEALTH_INFO_CONTAINER_ORNAMENT_HEIGHT * MID_SCALE}px;
      top: ${HEALTH_INFO_CONTAINER_ORNAMENT_VERTICAL_ALIGNMENT * MID_SCALE}px;
    }

    &:after {
      height: ${HEALTH_INFO_CONTAINER_ORNAMENT_HEIGHT * MID_SCALE}px;
      bottom: ${HEALTH_INFO_CONTAINER_ORNAMENT_VERTICAL_ALIGNMENT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    &:before {
      height: ${HEALTH_INFO_CONTAINER_ORNAMENT_HEIGHT * HD_SCALE}px;
      top: ${HEALTH_INFO_CONTAINER_ORNAMENT_VERTICAL_ALIGNMENT * HD_SCALE}px;
    }

    &:after {
      height: ${HEALTH_INFO_CONTAINER_ORNAMENT_HEIGHT * HD_SCALE}px;
      bottom: ${HEALTH_INFO_CONTAINER_ORNAMENT_VERTICAL_ALIGNMENT * HD_SCALE}px;
    }
  }
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HealthCompContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props: { marginBottom: number }) => props.marginBottom}px;
`;

const HealthCompInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

// #region HealthCompSecondaryText constants
const HEALTH_COMP_SECONDARY_TEXT_FONT_SIZE = 28;
// #endregion
const HealthCompSecondaryText = styled.div`
  margin: 0;
  padding: 0;
  color: #707475;
  font-size: ${HEALTH_COMP_SECONDARY_TEXT_FONT_SIZE}px;
  font-family: TitilliumWeb;

  @media (max-width: 2560px) {
    font-size: ${HEALTH_COMP_SECONDARY_TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${HEALTH_COMP_SECONDARY_TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region Icon constants
const ICON_FONT_SIZE = 28;
const ICON_MARGIN_RIGHT = 10;
// #endregion
const Icon = styled.div`
  font-size: ${ICON_FONT_SIZE}px;
  margin-right: ${ICON_MARGIN_RIGHT}px;
  font-family: TitilliumWeb;
  color: #707475;
  &.isRightPart {
    transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
  }

  @media (max-width: 2560px) {
    font-size: ${ICON_FONT_SIZE * MID_SCALE}px;
    margin-right: ${ICON_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ICON_FONT_SIZE * HD_SCALE}px;
    margin-right: ${ICON_MARGIN_RIGHT * HD_SCALE}px;
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
  bodyPart: BodyPart;
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
    if (camelotunchained.game.selfPlayerState.health[bodyPart]) {
      return camelotunchained.game.selfPlayerState.health[bodyPart].max;
    }

    return 'N/A';
  }
}

class BodyPartHealth extends React.Component<BodyPartHealthProps, {}> {
  public render() {
    return (
      <HealthInfoContainer>
        <SectionContainer>
          <BodyPartItem
            marginBottom={5}
            isRightPart={false}
            bodyPart={window.BodyPart.LeftArm}
            iconName={'icon-health-arm'}
          />
          <BodyPartItem isRightPart={true} bodyPart={window.BodyPart.RightArm} iconName={'icon-health-arm'} />
        </SectionContainer>

        <SectionContainer>
          <BodyPartItem marginBottom={5} isRightPart={false} bodyPart={window.BodyPart.Head} iconName={'icon-health-head'} />
          <BodyPartItem isRightPart={false} bodyPart={window.BodyPart.Torso} iconName={'icon-health-torso'} />
        </SectionContainer>

        <SectionContainer>
          <BodyPartItem
            marginBottom={5}
            isRightPart={false}
            bodyPart={window.BodyPart.LeftLeg}
            iconName={'icon-health-leg'}
          />
          <BodyPartItem isRightPart={true} bodyPart={window.BodyPart.RightLeg} iconName={'icon-health-leg'} />
        </SectionContainer>
      </HealthInfoContainer>
    );
  }

  public shouldComponentUpdate(nextProps: BodyPartHealthProps) {
    return !_.isEqual(this.props, nextProps);
  }
}

export default BodyPartHealth;
