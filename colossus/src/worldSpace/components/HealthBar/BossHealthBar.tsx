/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { HealthBarState } from '..';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';
import { findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';

const ICON_SIZE_PX = 36;
const ARROW_WIDTH_PX = 24;
const ARROW_HEIGHT_PX = 8;
const Container = 'WorldSpace-HealthBar-BossHealthBar-Container';
const CharacterName = 'WorldSpace-HealthBar-BossHealthBar-CharacterName';
const IconOuter = 'WorldSpace-HealthBar-BossHealthBar-IconOuter';
const IconBackground = 'WorldSpace-HealthBar-BossHealthBar-IconBackground';

const Icon = 'WorldSpace-HealthBar-BossHealthBar-Icon';

export interface Props {
  state: HealthBarState;
}

export class BossHealthBar extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    const health = findEntityResource(this.props.state.resources, EntityResourceIDs.Health);
    if (!health || health.current <= 0) {
      return null;
    }

    return (
      <div className={Container}>
        <div className={CharacterName}>{this.props.state.name}</div>
        <div className={IconOuter}>
          <svg className={IconBackground} width={ICON_SIZE_PX} height={ICON_SIZE_PX}>
            <circle cx={ICON_SIZE_PX * 0.5} cy={ICON_SIZE_PX * 0.5} r={Math.floor(ICON_SIZE_PX * 0.46)} fill='black' />
          </svg>
          <span className={`${Icon} fs-icon-${this.props.state.healthBarIcon}`} />
        </div>
        <svg width={ARROW_WIDTH_PX} height={ARROW_HEIGHT_PX}>
          <polygon points={`0,0 ${ARROW_WIDTH_PX},0 ${ARROW_WIDTH_PX * 0.5},${ARROW_HEIGHT_PX}`} fill='white' />
        </svg>
      </div>
    );
  }
}
