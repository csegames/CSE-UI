/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { HealthBarState } from '..';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';
import { findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';

const Container = 'WorldSpace-HealthBar-ItemHealthBar-Container';
const NameOfItem = 'WorldSpace-HealthBar-ItemHealthBar-NameOfItem';
const BarContainer = 'WorldSpace-HealthBar-ItemHealthBar-BarContainer';

const Bar = 'WorldSpace-HealthBar-ItemHealthBar-Bar';

export interface Props {
  state: HealthBarState;
}

export function ItemHealthBar(props: Props) {
  const { state } = props;
  const health = findEntityResource(state.resources, EntityResourceIDs.Health);

  return health && health.current > 0 ? (
    <div className={Container}>
      <div className={NameOfItem}>{state.name}</div>
      <div className={BarContainer}>
        <div className={Bar} style={{ width: `${(health.current / health.max) * 100}%` }} />
      </div>
    </div>
  ) : null;
}
