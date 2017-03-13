/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-03 16:12:25
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-03 17:16:16
 */

import * as React from 'react';
import BanesAndBoons from '../../components/BanesAndBoons';
import { RacesState } from '../../services/session/races';
import { FactionsState } from '../../services/session/factions';
import { PlayerClassesState } from '../../services/session/playerClasses';
import { BanesAndBoonsStyle } from '../BanesAndBoons';
import { TraitSummaryStyle } from '../BanesAndBoons/TraitSummary';
import { TraitStyle } from '../BanesAndBoons/Trait';
import { Race, Faction, Archetype } from 'camelot-unchained';
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
  fetchTraits
} from '../../services/session/banesAndBoons';

export interface BanesAndBoonsContainerProps {
  banesAndBoons: BanesAndBoonsState;
  race: RacesState;
  faction: FactionsState;
  playerClass: PlayerClassesState;
  styles: Partial<BanesAndBoonsStyle>;
  traitSummaryStyles: Partial<TraitSummaryStyle>;
  baneStyles: Partial<TraitStyle>;
  boonStyles: Partial<TraitStyle>;
  dispatch: any
}

export interface BanesAndBoonsContainerState {
}

class BanesAndBoonsContainer extends React.Component<BanesAndBoonsContainerProps, BanesAndBoonsContainerState> {
  constructor(props: BanesAndBoonsContainerProps) {
    super(props);
  }
  private componentDidMount() {
    // Initialize all Banes & Boons
    const { banesAndBoons, dispatch, playerClass, race, faction } = this.props;
    if (banesAndBoons.initial) {
      dispatch(fetchTraits({
        playerClass: Archetype[playerClass.selected.id],
        race: Race[race.selected.id],
        faction: Faction[faction.selected.id]
      }));
    }
  };
  private onSelectBoonClick = (boon: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    dispatch(onSelectBoon({ boon: boon }));
  };
  private onSelectBaneClick = (bane: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    dispatch(onSelectBane({ bane: bane }));
  };
  private onCancelBoon = (boon: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    dispatch(onCancelBoonClick({ boon: boon }));
  };
  private onCancelBane = (bane: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    dispatch(onCancelBaneClick({ bane: bane }));
  };
  private onResetClick = () => {
    const { dispatch, playerClass, race, faction } = this.props;
    dispatch(fetchTraits({
      playerClass: Archetype[playerClass.selected.id],
      race: Race[race.selected.id],
      faction: Faction[faction.selected.id]
    }));
  };
  render() {
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
      totalPoints
    } = this.props.banesAndBoons;
    const { styles, traitSummaryStyles, baneStyles, boonStyles, dispatch } = this.props;
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
        allPrerequisites={allPrerequisites}
        allExclusives={allExclusives}
        onBaneClick={this.onSelectBaneClick}
        onBoonClick={this.onSelectBoonClick}
        onCancelBaneClick={this.onCancelBane}
        onCancelBoonClick={this.onCancelBoon}
        onResetClick={this.onResetClick}
        onSelectRankBoon={(boon: BanesAndBoonsInfo) => dispatch(onSelectRankBoon({ boon: boon }))}
        onSelectRankBane={(bane: BanesAndBoonsInfo) => dispatch(onSelectRankBane({ bane: bane }))}
        onCancelRankBoon={(boon: BanesAndBoonsInfo) => dispatch(onCancelRankBoon({ boon: boon }))}
        onCancelRankBane={(bane: BanesAndBoonsInfo) => dispatch(onCancelRankBane({ bane: bane }))}
        styles={styles}
        traitSummaryStyles={traitSummaryStyles}
        baneStyles={baneStyles}
        boonStyles={boonStyles}
      />
    )
  }
}

export default BanesAndBoonsContainer;
