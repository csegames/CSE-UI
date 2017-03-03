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
  onUpdateRankBoons,
  onUpdateRankBanes,
  onCancelBaneClick,
  onCancelBoonClick,
  onUpdatePlayerClassBanes,
  onUpdatePlayerClassBoons,
  onUpdateGeneralBanes,
  onUpdateGeneralBoons,
  onUpdateRaceBanes,
  onUpdateRaceBoons,
  onUpdateFactionBanes,
  onUpdateFactionBoons,
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
  }
  private onUpdateTrait = (trait: BanesAndBoonsInfo, traitType: 'bane' | 'boon', updateType: 'select' | 'cancel') => {
    // This function should be useful when adding in ranks and dependencies
    const { dispatch } = this.props;
    if (traitType === 'boon') {
      switch (trait.category) {
        case 'Class':
          dispatch(onUpdatePlayerClassBoons(updateType, trait));
          return;
        case 'Race':
          dispatch(onUpdateRaceBoons(updateType, trait));
          return;
        case 'Faction':
          dispatch(onUpdateFactionBoons(updateType, trait));
          return;
        default:
          dispatch(onUpdateGeneralBoons(updateType, trait));
          return;
      }
    } else {
      switch (trait.category) {
        case 'Class':
          dispatch(onUpdatePlayerClassBanes(updateType, trait));
          return;
        case 'Race':
          dispatch(onUpdateRaceBanes(updateType, trait));
          return;
        case 'Faction':
          dispatch(onUpdateFactionBanes(updateType, trait));
          return;
        default:
          dispatch(onUpdateGeneralBanes(updateType, trait));
          return;
      }
    }
  };
  private onSelectBoonClick = (boon: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    if (boon.ranks) {
      if (boon.rank === 0) dispatch(onSelectBoon(boon));
      dispatch(onUpdateRankBoons('select', boon))
    } else {
      dispatch(onSelectBoon(boon));
      this.onUpdateTrait(boon, 'boon', 'select');
    }
  };
  private onSelectBaneClick = (bane: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    if (bane.ranks) {
      if (bane.rank === 0) dispatch(onSelectBane(bane));
      dispatch(onUpdateRankBanes('select', bane))
    } else {
      dispatch(onSelectBane(bane));
      this.onUpdateTrait(bane, 'bane', 'select');
    }
  };
  private onCancelBoon = (boon: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    if (boon.ranks) {
      if (boon.rank === 0) dispatch(onCancelBoonClick(boon));
      dispatch(onUpdateRankBoons('cancel', boon));
    } else {
      dispatch(onCancelBoonClick(boon));
      this.onUpdateTrait(boon, 'boon', 'cancel');
    }
  };
  private onCancelBane = (bane: BanesAndBoonsInfo) => {
    const { dispatch } = this.props;
    if (bane.ranks){
      if (bane.rank === 0) dispatch(onCancelBaneClick(bane));
      dispatch(onUpdateRankBanes('cancel', bane));
    } else {
      dispatch(onCancelBaneClick(bane));
      this.onUpdateTrait(bane, 'bane', 'cancel');
    }
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
    const { styles, traitSummaryStyles, baneStyles, boonStyles } = this.props;
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
        addedBanes={addedBanes}
        addedBoons={addedBoons}
        allPrerequisites={allPrerequisites}
        allExclusives={allExclusives}
        onBaneClick={this.onSelectBaneClick}
        onBoonClick={this.onSelectBoonClick}
        onCancelBaneClick={this.onCancelBane}
        onCancelBoonClick={this.onCancelBoon}
        onResetClick={this.onResetClick}
        onUpdateRankBoon={onUpdateRankBoons}
        onUpdateRankBane={onUpdateRankBanes}
        styles={styles}
        traitSummaryStyles={traitSummaryStyles}
        baneStyles={baneStyles}
        boonStyles={boonStyles}
      />
    )
  }
}

export default BanesAndBoonsContainer;
