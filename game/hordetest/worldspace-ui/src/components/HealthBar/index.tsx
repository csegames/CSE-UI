/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { HealthBarState } from '..';
import { EnemyHealthBar } from './EnemyHealthBar';
import { FriendlyHealthBar } from './FriendlyHealthBar';

export interface Props {
  state: HealthBarState;
}

export function HealthBar(props: Props) {
  if (props.state.isEnemy) {
    return <EnemyHealthBar state={props.state} />;
  }

  return <FriendlyHealthBar state={props.state} />
}
