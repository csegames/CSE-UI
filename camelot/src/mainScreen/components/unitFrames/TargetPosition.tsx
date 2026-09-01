/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getTokenizedStringTableValue, StringIDGeneralDistanceInMeters } from '../../helpers/stringTableHelpers';
import { RootState } from '../../redux/store';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { floatEquals } from '@csegames/library/dist/_baseGame/utils/mathExtensions';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { FactionDef } from '../../dataSources/manifest/factionManifest';
import { getFactionData } from '../../gameData/factionData';

// CSS classes
const Root = 'HUD-UnitFramePosition-Root';
const Distance = 'HUD-UnitFramePosition-Distance';
const DirectionalIndicator = 'HUD-UnitFramePosition-DirectionalIndicator';
const DirectionalIndicatorRadius = 'HUD-UnitFramePosition-DirectionalIndicatorRadius';
const DirectionalIndicatorRadiusInner = 'HUD-UnitFramePosition-DirectionalIndicatorRadiusInner';

interface ReactProps {
  isFriendly: boolean;
  faction: Faction;
}

interface InjectedProps {
  factions: Dictionary<FactionDef>;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

interface State {
  bearing: number;
  distance: string;
  animationHandle: ListenerHandle;
}

type Props = ReactProps & InjectedProps;

class ATargetPosition extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      bearing: 0,
      distance: '',
      animationHandle: clientAPI.startAnimation(this.animate.bind(this))
    };
  }

  render(): JSX.Element {
    if (!this.state.distance) return null;

    const faction = this.props.factions[Faction[this.props.faction]];

    const factionData = getFactionData(faction.id);

    return (
      <div className={Root}>
        <div className={DirectionalIndicator} style={{ borderColor: factionData.borderColor }}>
          <div className={DirectionalIndicatorRadius} style={{ transform: `rotate(${this.state.bearing}deg)` }}>
            <img className={DirectionalIndicatorRadiusInner} src={factionData.compassNeedleImage} />
          </div>
        </div>
        <div className={Distance}>{this.state.distance}</div>
      </div>
    );
  }

  componentWillUnmount(): void {
    this.state.animationHandle.close();
  }

  private animate(data: AnimationData, _: DOMHighResTimeStamp): void {
    if (this.props.isFriendly) {
      this.updateState(data.friendlyTargetBearing, data.friendlyTargetDistance);
    } else {
      this.updateState(data.enemyTargetBearing, data.enemyTargetDistance);
    }
  }

  private updateState(bearing: number, rawDistance: number): void {
    if (isNaN(bearing) || isNaN(rawDistance)) {
      this.setState({ bearing: 0, distance: '' });
      return;
    }

    const distance = getTokenizedStringTableValue(StringIDGeneralDistanceInMeters, this.props.stringTable, {
      DISTANCE: rawDistance.toFixed(0)
    });
    if (distance !== this.state.distance || !floatEquals(bearing, this.state.bearing, 2)) {
      this.setState({ bearing, distance });
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { factions } = state.gameDefs;
  return {
    ...ownProps,
    factions,
    stringTable: state.stringTable.stringTable
  };
};

export const TargetPosition = connect(mapStateToProps)(ATargetPosition);
