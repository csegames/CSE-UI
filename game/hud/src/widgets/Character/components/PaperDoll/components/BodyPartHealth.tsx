/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-22 22:31:54
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-17 17:52:29
 */

import * as React from 'react';
import * as _ from 'lodash';

import { css, StyleDeclaration, StyleSheet } from 'aphrodite';
import { characterHealthIcons } from '../../../lib/constants';

export interface BodyPartHealthStyles extends StyleDeclaration {
  healthInfoContainer: React.CSSProperties;
  healthCompContainer: React.CSSProperties;
  healthCompInfo: React.CSSProperties;
  healthCompPrimaryText: React.CSSProperties;
  healthCompSecondaryText: React.CSSProperties;
}

export const defaultBodyPartHealthStyle: BodyPartHealthStyles = {
  healthInfoContainer: {
    display: 'flex',
  },

  healthCompContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '25px',
  },

  healthCompInfo: {
    display: 'flex',
    flexDirection: 'column',
  },

  healthCompPrimaryText: {
    margin: '0 5px 0 0',
    padding: 0,
    color: '#6F7581',
    fontSize: '24px',
    fontWeight: 'bold',
  },

  healthCompSecondaryText: {
    margin: 0,
    padding: 0,
    color: '#6F7581',
    fontSize: '12px',
  },
};

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

const healthBodyParts = {
  head: HealthBodyParts.Head,
  torso: HealthBodyParts.Torso,
  leftArm: HealthBodyParts.LeftArm,
  rightArm: HealthBodyParts.RightArm,
  leftLeg: HealthBodyParts.LeftLeg,
  rightLeg: HealthBodyParts.RightLeg,
};

class BodyPartHealth extends React.Component<BodyPartHealthProps, {}> {
  public render() {
    const ss = StyleSheet.create({...defaultBodyPartHealthStyle, ...this.props.styles});
    return (
      <div className={css(ss.healthInfoContainer)}>
        {Object.keys(healthBodyParts).map((healthComponent: string, i: number) => {
          return (
            <div key={i} className={css(ss.healthCompContainer)}>
              <div className={characterHealthIcons[healthComponent]}
                style={{
                  fontSize: '24px',
                  transform: _.includes(healthComponent.toLowerCase(), 'right') ? 'scaleX(-1)' : '',
                  webkitTransform: _.includes(healthComponent.toLowerCase(), 'right') ? 'scaleX(-1)' : '',
                }}
              />
              <div className={css(ss.healthCompInfo)}>
                <p className={css(ss.healthCompSecondaryText)}>
                  hp {this.getMaxHealthForBodyPart(healthBodyParts[healthComponent]) || 'N/A'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
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
