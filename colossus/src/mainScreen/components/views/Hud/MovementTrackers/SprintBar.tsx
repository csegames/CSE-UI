/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { ResourceBar } from '../../../shared/ResourceBar';
import { EntityResource, findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';

const SprintBarPosition = 'MovementTrackers-SprintBar-Position';
const SprintBarContainerClass = 'MovementTrackers-SprintBar-Container';
const SprintBarClass = 'MovementTrackers-SprintBar-Bar';
const SprintIconClass = 'MovementTrackers-SprintBar-SprintIcon';

interface Props {
  resources: ArrayMap<EntityResource>;
}

interface State {
  isVisible: boolean;
}

class ASprintBar extends React.Component<Props, State> {
  private hideTimeout: number;

  constructor(props: Props) {
    super(props);

    const stamina = findEntityResource(this.props.resources, EntityResourceIDs.Stamina);
    this.state = {
      isVisible: stamina ? stamina.current < stamina.max : false
    };
  }

  public componentDidUpdate(prevProps: Props): void {
    const stamina = findEntityResource(this.props.resources, EntityResourceIDs.Stamina);
    const shouldBeVisible = stamina && stamina.current < stamina.max;
    if (shouldBeVisible && !this.state.isVisible) {
      this.cancelHideTimer();
      this.setState({ isVisible: true });
      return;
    }

    if (!shouldBeVisible && this.state.isVisible && !this.hideTimeout) {
      this.hideTimeout = window.setTimeout(() => {
        this.setState({ isVisible: false });
      }, 1500);
    }
  }

  public render() {
    const stamina = findEntityResource(this.props.resources, EntityResourceIDs.Stamina);
    const inlineStyle: React.CSSProperties = {};
    if (!this.state.isVisible) {
      inlineStyle.display = 'none';
    }

    return (
      <div className={SprintBarPosition}>
        <div className={SprintBarContainerClass} style={inlineStyle}>
          <div className={`${SprintIconClass} fs-icon-effects-speed-boost`} />
          <ResourceBar
            isSquare={false}
            unsquareText
            shouldPlayBackfill={false}
            type='orange'
            containerClasses={SprintBarClass}
            current={stamina?.current ?? 0}
            max={stamina?.max ?? 0}
            text={''}
            textStyles={''}
            hideText={true}
          />
        </div>
      </div>
    );
  }

  public componentWillUnmount() {
    this.cancelHideTimer();
  }

  private cancelHideTimer() {
    if (this.hideTimeout) {
      window.clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}

function mapStateToProps(state: RootState) {
  return {
    resources: state.player.resources
  };
}

export const SprintBar = connect(mapStateToProps)(ASprintBar);
