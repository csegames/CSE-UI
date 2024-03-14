/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { HealthBarState } from '..';
import { CharacterKind } from '@csegames/library/dist/hordetest/game/types/CharacterKind';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';
import { EntityResource, findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';

const Container = 'WorldSpace-HealthBar-EnemyHealthBar-Container';
const NameOfPlayer = 'WorldSpace-HealthBar-EnemyHealthBar-NameOfPlayer';
const BarContainer = 'WorldSpace-HealthBar-EnemyHealthBar-BarContainer';
const Bar = 'WorldSpace-HealthBar-EnemyHealthBar-Bar';
const Backfill = 'WorldSpace-HealthBar-EnemyHealthBar-Backfill';
const Icon = 'WorldSpace-HealthBar-EnemyHealthBar-Icon';
const BarrierIcon = 'WorldSpace-HealthBar-EnemyHealthBar-BarrierIcon';

interface BorderStyle {
  icon: JSX.Element | null;
  healthBarBorderColor: string;
}

export interface Props {
  state: HealthBarState;
}

export interface State {
  backFillPercentage: number;
}

export class EnemyHealthBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const health = findEntityResource(props.state.resources, EntityResourceIDs.Health);
    this.state = { backFillPercentage: health ? (health.current / health.max) * 100 : 0 };
  }

  public render() {
    const { state } = this.props;
    const borderType: BorderStyle = this.getBorderStyle(
      state.rank,
      state.isShielded ? 0x1d2c5d : state.barColor,
      'fs-icon-' + state.healthBarIcon,
      state.barColor
    );
    const nameStyle = borderType.icon ? '22px' : '';

    const health = findEntityResource(this.props.state.resources, EntityResourceIDs.Health);
    return health && health.current > 0 ? (
      <div className={Container} id={state.id.toString()}>
        <div className={NameOfPlayer} style={{ paddingRight: `${nameStyle}` }}>
          {state.name}
        </div>
        {borderType.icon}
        {this.getBorderedHealthBar(state, borderType, health)}
        {this.getShieldIcon()}
      </div>
    ) : null;
  }

  private getBorderedHealthBar(state: HealthBarState, borderType: BorderStyle, health: EntityResource) {
    const shieldedClass = state.isShielded ? 'Shielded' : '';
    const borderColor = state.isShielded ? '004495' : borderType.healthBarBorderColor;

    return (
      <div
        className={`${BarContainer} ${CharacterKind[this.props.state.rank]}`}
        id={state.id.toString()}
        style={{ outline: `solid 2px #${borderColor}` }}
      >
        <div className={Backfill} style={{ width: `${this.state.backFillPercentage}%` }} />
        <div className={`${Bar} ${shieldedClass}`} style={{ width: `${(health.current / health.max) * 100}%` }} />
      </div>
    );
  }

  private getShieldIcon(): JSX.Element {
    if (!this.props.state.isShielded) {
      return null;
    }

    return (
      <div className={BarrierIcon}>
        <span className={'fs-icon-hp-bar-shield'} style={{ position: `absolute`, padding: `10%` }} />
      </div>
    );
  }

  private getBorderStyle(
    enemyType: CharacterKind,
    outlineColor: number,
    iconImage: string,
    iconColor: number
  ): BorderStyle {
    let borderStyle: BorderStyle = { icon: null, healthBarBorderColor: '#642402' };
    switch (enemyType) {
      case CharacterKind.EliteNPC:
        // EliteNPC
        return borderStyle;
      case CharacterKind.StrongEliteNPC:
        // StrongEliteNPC
        borderStyle.healthBarBorderColor = outlineColor.toString(16).padStart(6, '0');
        return borderStyle;
      case CharacterKind.MiniBossNPC:
        // MiniBossNPC
        borderStyle.icon = (
          <div
            className={Icon}
            style={{
              color: `#${iconColor.toString(16).padStart(6, '0')}`,
              outline: `solid 2px #${iconColor.toString(16).padStart(6, '0')}`
            }}
          >
            <span className={iconImage} style={{ position: `absolute`, padding: `10%` }} />
          </div>
        );
        borderStyle.healthBarBorderColor = outlineColor.toString(16).padStart(6, '0');
        return borderStyle;
      case CharacterKind.UniqueNPC:
        // UniqueNPC
        borderStyle.icon = (
          <div
            className={Icon}
            style={{
              color: `#${iconColor.toString(16).padStart(6, '0')}`,
              outline: `solid 2px #${iconColor.toString(16).padStart(6, '0')}`
            }}
          >
            <span className={iconImage} style={{ position: `absolute`, padding: `10%` }} />
          </div>
        );
        borderStyle.healthBarBorderColor = outlineColor.toString(16).padStart(6, '0');
        return borderStyle;
      default:
        return borderStyle;
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const oldHealth = findEntityResource(prevProps.state.resources, EntityResourceIDs.Health);
    const newHealth = findEntityResource(this.props.state.resources, EntityResourceIDs.Health);

    if (!newHealth) {
      return;
    }

    if (!oldHealth || oldHealth.current !== newHealth.current || oldHealth.max !== newHealth.max) {
      this.setState({
        backFillPercentage: (newHealth.current / newHealth.max) * 100
      });
    }
  }
}
