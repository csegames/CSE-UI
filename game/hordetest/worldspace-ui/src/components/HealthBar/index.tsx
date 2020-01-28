/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { HealthBarState } from '..';
import { EnemyHealthBar } from './EnemyHealthBar';
import { FriendlyHealthBar } from './FriendlyHealthBar';
import { ItemHealthBar } from './ItemHealthBar';

export interface Props {
  state: HealthBarState;
}

export function HealthBar(props: Props) {
  switch (props.state.kind) {
    case HealthBarKind.EnemyPlayer: {
      return <EnemyHealthBar state={props.state} />;
    }

    case HealthBarKind.FriendlyPlayer: {
      return <FriendlyHealthBar state={props.state} />;
    }

    case HealthBarKind.Item: {
      return <ItemHealthBar state={props.state} />;
    }

    default: {
      return null;
    }
  }
}
