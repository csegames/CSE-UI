/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { clamp } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { EntityList } from '../../../../redux/entitiesSlice';
import {
  PlayerEntityStateModel,
  findEntityResource
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { CharacterKind } from '@csegames/library/dist/hordetest/game/types/CharacterKind';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';

const bossHealthBarsContainerClass = 'BossHealthBars-BossHealthBarsContainer';
const bossHealthBarContainerClass = 'BossHealthBars-BossHealthBarContainer';
const bossHealthBarLabelClass = 'BossHealthBars-BossHealthBarLabel';
const bossHealthBarClass = 'BossHealthBars-BossHealthBar';

const bossHealthBarInnerClass = 'BossHealthBars-BossHealthBarInner';
const bossHealthBarBackfillClass = 'BossHealthBars-BossHealthBarBackfill';
const bossHealthBarShieldcontainer = 'BossHealthBars-ShieldContainer';
const bossHealthBarShieldIconOuter = 'BossHealthBars-ShieldIconOuter';
const bossHealthBarShieldIcon = 'BossHealthBars-ShieldIcon';
const bossHealthBarAndName = 'BossHealthBars-BossHealthBarAndName';

interface BossHealthBarProps {
  label: string;
  percent: number;
  isShielded: boolean;
}

class BossHealthBar extends React.Component<BossHealthBarProps, {}> {
  constructor(props: BossHealthBarProps) {
    super(props);
  }

  public render(): JSX.Element {
    // This calculation is used for both the main health bar component and a matched "backfill" bar.
    // The backfill bar uses an animated transition such that when the width changes, the main bar
    // will instantly shrink, and the backfill bar will animate from the old width to the new width.
    // This gives that white "flash" effect when the boss's health drops.
    const barWidthStyle = `calc((100% - 0.278vmin) * ${clamp(this.props.percent, 0.0, 1)})`;
    const shieldedClass = this.props.isShielded ? 'Shielded' : '';
    return (
      <div className={bossHealthBarContainerClass}>
        <div className={bossHealthBarAndName}>
          <div className={bossHealthBarLabelClass}>{this.props.label}</div>
          <div className={`${bossHealthBarClass} ${shieldedClass}`}>
            <div className={bossHealthBarBackfillClass} style={{ width: barWidthStyle }} />
            <div className={`${bossHealthBarInnerClass} ${shieldedClass}`} style={{ width: barWidthStyle }} />
          </div>
        </div>
        {this.getShieldIcon()}
      </div>
    );
  }

  private getShieldIcon(): JSX.Element {
    if (!this.props.isShielded) {
      return null;
    }

    return (
      <div className={bossHealthBarShieldcontainer}>
        <div className={bossHealthBarShieldIconOuter}>
          <span className={`${bossHealthBarShieldIcon} fs-icon-hp-bar-shield`} />
        </div>
      </div>
    );
  }
}

interface ComponentProps {}

interface InjectedProps {
  bosses: EntityList;
}

type Props = ComponentProps & InjectedProps;

class ABossHealthBars extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    if (this.props.bosses && Object.keys(this.props.bosses).length > 0) {
      return (
        <div className={bossHealthBarsContainerClass} id='BossHealthBars'>
          {this.getBosses()}
        </div>
      );
    } else {
      return null;
    }
  }

  private getBosses(): JSX.Element[] {
    let result: JSX.Element[] = [];
    // sort by entity id first so that the render order is deterministic
    const bossEntityList: string[] = Object.keys(this.props.bosses).sort();
    for (let entityID of bossEntityList) {
      const boss = this.props.bosses[entityID];
      if (boss.characterKind == CharacterKind.MiniBossNPC || !boss.iconClass) {
        continue;
      }

      result.push(
        <BossHealthBar
          key={boss.entityID}
          label={boss.name}
          percent={this.getBossHealthBarPercent(boss)}
          isShielded={boss.isShielded}
        />
      );
    }

    return result;
  }

  private getBossHealthBarPercent(boss: PlayerEntityStateModel): number {
    const health = findEntityResource(boss.resources, EntityResourceIDs.Health);

    // if dead show an empty bar
    if (boss.isAlive == false || !health) {
      return 0;
    }

    // ensure if the boss is almost dead that we at least show a tiny sliver of life in the UI
    return Math.max(0.01, health.current / health.max);
  }
}

function mapStateToProps(state: RootState) {
  return {
    bosses: state.entities.bosses
  };
}

export const BossHealthBars = connect(mapStateToProps)(ABossHealthBars);
