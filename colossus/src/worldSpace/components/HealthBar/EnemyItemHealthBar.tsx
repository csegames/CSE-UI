/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { HealthBarState } from '..';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';
import { findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';

const Container = 'WorldSpace-HealthBar-EnemyItemHealthBar-Container';
const NameOfItem = 'WorldSpace-HealthBar-EnemyItemHealthBar-NameOfItem';
const BarContainer = 'WorldSpace-HealthBar-EnemyItemHealthBar-BarContainer';

const Bar = 'WorldSpace-HealthBar-EnemyItemHealthBar-Bar';

export interface Props {
  state: HealthBarState;
}

export function EnemyItemHealthBar(props: Props) {
  const { state } = props;
  const health = findEntityResource(state.resources, EntityResourceIDs.Health);
  if (!health) {
    return null;
  }

  const barWidthPercent = Math.min(100, Math.max(0, (health.current / health.max) * 100));
  return health.current > 0 ? (
    <div className={Container}>
      <div className={NameOfItem}>{state.name}</div>
      <div className={BarContainer}>
        <div className={Bar} style={{ width: `${barWidthPercent}%` }} />
      </div>
    </div>
  ) : null;
}
