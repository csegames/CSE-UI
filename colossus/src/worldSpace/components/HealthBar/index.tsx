/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { HealthBarState } from '..';
import { EnemyHealthBar } from './EnemyHealthBar';
import { UserHealthBar } from './UserHealthBar';
import { ItemHealthBar } from './ItemHealthBar';
import { EnemyItemHealthBar } from './EnemyItemHealthBar';
import { HealthBarKind } from '@csegames/library/dist/hordetest/game/types/HealthBarKind';
import { BossHealthBar } from './BossHealthBar';

export interface Props {
  state: HealthBarState;
}

export function HealthBar(props: Props) {
  switch (props.state.kind) {
    case HealthBarKind.EnemyPlayer: {
      return <EnemyHealthBar state={props.state} />;
    }

    case HealthBarKind.FriendlyUser:
    case HealthBarKind.EnemyUser: {
      return <UserHealthBar state={props.state} />;
    }

    case HealthBarKind.Item: {
      return <ItemHealthBar state={props.state} />;
    }

    case HealthBarKind.EnemyItem: {
      return <EnemyItemHealthBar state={props.state} />;
    }

    case HealthBarKind.BossPlayer: {
      return <BossHealthBar state={props.state} />;
    }

    default: {
      return null;
    }
  }
}
