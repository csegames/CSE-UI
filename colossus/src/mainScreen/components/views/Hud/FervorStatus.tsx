/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityResource, findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';

const Root = 'FervorStatus-Root';
const Background = 'FervorStatus-Background';
const FlameOutline1 = 'FervorStatus-FlameOutline first';
const FlameOutline2 = 'FervorStatus-FlameOutline second';
const FlameOutline3 = 'FervorStatus-FlameOutline third';
const FlameClipper = 'FervorStatus-FlameClipper';
const FlameFill1 = 'FervorStatus-FlameFill first';
const FlameFill2 = 'FervorStatus-FlameFill second';
const FlameFill3 = 'FervorStatus-FlameFill third';

interface ReactProps {}

interface InjectedProps {
  resources: Dictionary<EntityResource>;
}

type Props = ReactProps & InjectedProps;

// TODO: These should probably come from the server some day instead of being hard-coded.
const fervorBreakpoints = [0, 16, 66, 99];

class AFervorStatus extends React.Component<Props> {
  public render() {
    // Show only if `resources` includes Fervor.
    const fervorResource = findEntityResource(this.props.resources, EntityResourceIDs.Fervor);
    if (!fervorResource) {
      return null;
    }
    const fervor = fervorResource.current;
    return (
      <div className={Root}>
        <div className={Background} />
        {this.renderFirstFlame(fervor)}
        {this.renderSecondFlame(fervor)}
        {this.renderThirdFlame(fervor)}
      </div>
    );
  }

  private renderFirstFlame(fervor: number): React.ReactNode {
    const isLit = fervor > 0 ? 'lit' : '';
    const fillRatio = Math.min(1, fervor / fervorBreakpoints[1]);
    // Fill between 14% and 63%.
    const fillHeight = `${Math.max(0, 14 + fillRatio * 49)}%`;

    return (
      <div className={`${FlameOutline1} ${isLit}`}>
        <div className={FlameClipper} style={{ height: fillHeight }}>
          <div className={FlameFill1} />
        </div>
      </div>
    );
  }

  private renderSecondFlame(fervor: number): React.ReactNode {
    const isLit = fervor >= fervorBreakpoints[1] ? 'lit' : '';
    const fillRatio = Math.min(1, (fervor - fervorBreakpoints[1]) / (fervorBreakpoints[2] - fervorBreakpoints[1]));
    // Fill between 14% and 88%.
    const fillHeight = `${Math.max(0, 14 + fillRatio * 74)}%`;

    return (
      <div className={`${FlameOutline2} ${isLit}`}>
        <div className={FlameClipper} style={{ height: fillHeight }}>
          <div className={FlameFill2} />
        </div>
      </div>
    );
  }

  private renderThirdFlame(fervor: number): React.ReactNode {
    const isLit = fervor >= fervorBreakpoints[2] ? 'lit' : '';
    const fillRatio = Math.min(1, (fervor - fervorBreakpoints[2]) / (fervorBreakpoints[3] - fervorBreakpoints[2]));
    // Fill between 14% and 68%.
    const fillHeight = `${Math.max(0, 14 + fillRatio * 54)}%`;

    return (
      <div className={`${FlameOutline3} ${isLit}`}>
        <div className={FlameClipper} style={{ height: fillHeight }}>
          <div className={FlameFill3} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps,
    resources: state.player.resources
  };
}

export const FervorStatus = connect(mapStateToProps)(AFervorStatus);
