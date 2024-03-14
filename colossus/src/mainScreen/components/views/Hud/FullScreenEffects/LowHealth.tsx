/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';
import { EntityResource, findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';

export const LOW_HEALTH_PERCENT = 20;

const Container = 'FullScreenEffects-LowHealth-Container';

interface ComponentProps {}

interface InjectedProps {
  resources: ArrayMap<EntityResource>;
  lifeState: LifeState;
}

type Props = ComponentProps & InjectedProps;

class ALowHealthFullScreenEffects extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const health = findEntityResource(this.props.resources, EntityResourceIDs.Health);
    const healthPercent = health ? (health.current / health.max) * 100 : 100;
    const borderColorType = this.props.lifeState == LifeState.Downed ? ' down' : '';

    return healthPercent <= LOW_HEALTH_PERCENT ? (
      <div id='LowHealthFullScreenEffect_HUD' className={`${Container} ${borderColorType}`} />
    ) : null;
  }
}

function mapStateToProps(state: RootState, ownProps: ComponentProps) {
  return {
    resources: state.player.resources,
    lifeState: state.player.lifeState
  };
}

export const LowHealthFullScreenEffects = connect(mapStateToProps)(ALowHealthFullScreenEffects);
