/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import BanesAndBoons from '../../components/BanesAndBoons';
import { RacesState } from '../../services/session/races';
import { FactionsState } from '../../services/session/factions';
import { PlayerClassesState } from '../../services/session/playerClasses';
import { Race, Faction, Archetype } from '@csegames/camelot-unchained';
import {
  BanesAndBoonsInfo,
  BanesAndBoonsState,
  onSelectBane,
  onSelectBoon,
  onSelectRankBoon,
  onSelectRankBane,
  onCancelRankBoon,
  onCancelRankBane,
  onCancelBaneClick,
  onCancelBoonClick,
  resetBaneOrBoon,
} from '../../services/session/banesAndBoons';

export interface BanesAndBoonsContainerProps {
  apiHost: string;
  banesAndBoons: BanesAndBoonsState;
  race: RacesState;
  faction: FactionsState;
  playerClass: PlayerClassesState;
  dispatch: any;
}

export interface BanesAndBoonsContainerState {
}

class BanesAndBoonsContainer extends React.Component<BanesAndBoonsContainerProps, BanesAndBoonsContainerState> {
  constructor(props: BanesAndBoonsContainerProps) {
    super(props);
  }

  public render() {
    const {
      traits,
      addedBanes,
      addedBoons,
      generalBoons,
      playerClassBoons,
      raceBoons,
      factionBoons,
      generalBanes,
      playerClassBanes,
      raceBanes,
      factionBanes,
      allPrerequisites,
      allExclusives,
      totalPoints,
      minPoints,
      maxPoints,
    } = this.props.banesAndBoons;
    const { dispatch } = this.props;
    return (
      <BanesAndBoons
        generalBoons={generalBoons}
        playerClassBoons={playerClassBoons}
        raceBoons={raceBoons}
        factionBoons={factionBoons}
        generalBanes={generalBanes}
        playerClassBanes={playerClassBanes}
        raceBanes={raceBanes}
        factionBanes={factionBanes}
        totalPoints={totalPoints}
        traits={traits}
        addedBanes={addedBanes}
        addedBoons={addedBoons}
        minPoints={minPoints}
        maxPoints={maxPoints}
        allPrerequisites={allPrerequisites}
        allExclusives={allExclusives}
        onBaneClick={this.onSelectBaneClick}
        onBoonClick={this.onSelectBoonClick}
        onCancelBaneClick={this.onCancelBane}
        onCancelBoonClick={this.onCancelBoon}
        onReset={this.onResetClick}
        onSelectRankBoon={(boon: BanesAndBoonsInfo) => dispatch(onSelectRankBoon({ boon }))}
        onSelectRankBane={(bane: BanesAndBoonsInfo) => dispatch(onSelectRankBane({ bane }))}
        onCancelRankBoon={(boon: BanesAndBoonsInfo) => dispatch(onCancelRankBoon({ boon }))}
        onCancelRankBane={(bane: BanesAndBoonsInfo) => dispatch(onCancelRankBane({ bane }))}
      />
    );
  }

  private onSelectBoonClick = (boon: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    dispatch(onSelectBoon({ boon }));
  }

  private onSelectBaneClick = (bane: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    dispatch(onSelectBane({ bane }));
  }

  private onCancelBoon = (boon: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    dispatch(onCancelBoonClick({ boon }));
  }

  private onCancelBane = (bane: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    dispatch(onCancelBaneClick({ bane }));
  }

  private onResetClick = (initType: 'banes' | 'boons' | 'both') => {
    const { dispatch, playerClass, race, faction } = this.props;
    dispatch(resetBaneOrBoon({
      apiHost: this.props.apiHost,
      playerClass: Archetype[playerClass.selected.id],
      race: Race[race.selected.id],
      faction: Faction[faction.selected.id],
      initType,
    }));
  }
}

export default BanesAndBoonsContainer;
