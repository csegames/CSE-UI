/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import styled, { css } from 'react-emotion';
import { characterBodyPartIcons } from '../../lib/constants';

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
  display: flex;
`;

const HealthCompContainer = styled('div')`
  display: flex;
  align-items: center;
  margin-right: 25px;
`;

const HealthCompInfo = styled('div')`
  display: flex;
  flex-direction: column;
`;

const HealthCompSecondaryText = styled('div')`
  margin: 0;
  padding: 0;
  color: #6F7581;
  font-size: 12px;
`;

const Icon = styled('div')`
  font-size: 24px;
`;

const FlipIcon = css`
  transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
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

class BodyPartHealth extends React.Component<BodyPartHealthProps, {}> {
  public render() {
    return (
      <HealthInfoContainer>
        {Object.keys(healthBodyParts).map((healthComponent: string, i: number) => {
          const isRightPart = _.includes(healthComponent.toLowerCase(), 'right');
          const name = healthComponent.substr(0).toUpperCase() + healthComponent.substr(1, healthComponent.length);
          return (
            <HealthCompContainer>
              <Icon className={classNames(isRightPart ? FlipIcon : '', characterBodyPartIcons[name])} />
              <HealthCompInfo>
                <HealthCompSecondaryText>
                  hp {this.getMaxHealthForBodyPart(healthBodyParts[healthComponent]) || 'N/A'}
                </HealthCompSecondaryText>
              </HealthCompInfo>
            </HealthCompContainer>
          );
        })}
      </HealthInfoContainer>
    );
  }

  public shouldComponentUpdate(nextProps: BodyPartHealthProps) {
    return !_.isEqual(this.props, nextProps);
  }

  private getMaxHealthForBodyPart = (healthComponent: HealthBodyParts) => {
    const { maxHealthParts } = this.props;
    switch (healthComponent) {
      case HealthBodyParts.Head: return maxHealthParts['HEAD'];
      case HealthBodyParts.Torso: return maxHealthParts['TORSO'];
      case HealthBodyParts.LeftArm: return maxHealthParts['LEFTARM'];
      case HealthBodyParts.RightArm: return maxHealthParts['RIGHTARM'];
      case HealthBodyParts.LeftLeg: return maxHealthParts['LEFTLEG'];
      case HealthBodyParts.RightLeg: return maxHealthParts['RIGHTLEG'];
    }
  }
}

export default BodyPartHealth;
