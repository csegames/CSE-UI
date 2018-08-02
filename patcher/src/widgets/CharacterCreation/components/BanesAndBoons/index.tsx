/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

import SummaryList from './SummaryList';
import TraitListContainer from './TraitListContainer';
import { BanesAndBoonsInfo, TraitMap, TraitIdMap } from '../../services/session/banesAndBoons';

const Container = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: url(../images/bg.jpg) repeat-x top center fixed;
  background-color: rgba(49, 49, 49, 0.3);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
`;

export interface BanesAndBoonsProps {
  generalBoons: TraitIdMap;
  playerClassBoons: TraitIdMap;
  raceBoons: TraitIdMap;
  factionBoons: TraitIdMap;
  generalBanes: TraitIdMap;
  playerClassBanes: TraitIdMap;
  raceBanes: TraitIdMap;
  factionBanes: TraitIdMap;
  traits: TraitMap;
  addedBanes: TraitIdMap;
  addedBoons: TraitIdMap;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;
  totalPoints: number;
  minPoints: number;
  maxPoints: number;
  onReset: (initType: 'banes' | 'boons' | 'both') => void;
  onBoonClick: (boon: BanesAndBoonsInfo) => void;
  onBaneClick: (bane: BanesAndBoonsInfo) => void;
  onCancelBoonClick: (boon: BanesAndBoonsInfo) => void;
  onCancelBaneClick: (bane: BanesAndBoonsInfo) => void;
  onSelectRankBoon: (boon: BanesAndBoonsInfo) => void;
  onSelectRankBane: (bane: BanesAndBoonsInfo) => void;
  onCancelRankBoon: (boon: BanesAndBoonsInfo) => void;
  onCancelRankBane: (bane: BanesAndBoonsInfo) => void;
}

export interface BanesAndBoonsState {
  flexOfBoonBar: number;
  flexOfBaneBar: number;
  showResetBoonAlertDialog: boolean;
  showResetBaneAlertDialog: boolean;
  showResetAllAlertDialog: boolean;
  helpEnabled: boolean;
}

class BanesAndBoons extends React.Component<BanesAndBoonsProps, BanesAndBoonsState> {
  constructor(props: BanesAndBoonsProps) {
    super(props);
    this.state = {
      flexOfBoonBar: 1,
      flexOfBaneBar: 1,
      showResetBoonAlertDialog: false,
      showResetBaneAlertDialog: false,
      showResetAllAlertDialog: false,
      helpEnabled: false,
    };
  }

  public render() {
    const { traits, addedBoons, addedBanes } = this.props;
    const allBoons = [
      ...Object.keys(this.props.playerClassBoons).map((id: string) => traits[id]),
      ...Object.keys(this.props.raceBoons).map((id: string) => traits[id]),
      ...Object.keys(this.props.factionBoons).map((id: string) => traits[id]),
      ...Object.keys(this.props.generalBoons).map((id: string) => traits[id]).sort((a, b) => a.points - b.points),
    ];
    const allBanes = [
      ...Object.keys(this.props.playerClassBanes).map((id: string) => traits[id]),
      ...Object.keys(this.props.raceBanes).map((id: string) => traits[id]),
      ...Object.keys(this.props.factionBanes).map((id: string) => traits[id]),
      ...Object.keys(this.props.generalBanes).map((id: string) => traits[id])
        .sort((a, b) => (a.points * -1) - (b.points * -1)),
    ];
    const boonPoints = Object.keys(addedBoons).length > 0 && Object.keys(addedBoons).map((id: string) =>
      traits[id].points).reduce((a, b) => a + b) || 0;
    const banePoints = Object.keys(addedBanes).length > 0 && Object.keys(addedBanes).map((id: string) =>
      traits[id].points * -1).reduce((a, b) => a + b) || 0;
    return (
      <Container>
        <TraitListContainer
          type={'boon'}
          traitsList={allBoons}
          minPoints={this.props.minPoints}
          maxPoints={this.props.maxPoints}
          boonPoints={boonPoints}
          banePoints={banePoints}
          traits={traits}
          addedBoons={addedBoons}
          addedBanes={addedBanes}
          allPrerequisites={this.props.allPrerequisites}
          allExclusives={this.props.allExclusives}
          onBoonClick={this.props.onBoonClick}
          onBaneClick={this.props.onBaneClick}
          onCancelBoonClick={this.props.onCancelBoonClick}
          onCancelBaneClick={this.props.onCancelBaneClick}
          onSelectRankBoon={this.props.onSelectRankBoon}
          onSelectRankBane={this.props.onSelectRankBane}
          onCancelRankBoon={this.props.onCancelRankBoon}
          onCancelRankBane={this.props.onCancelRankBane}
        />
        <SummaryList
          traits={traits}
          addedBoons={addedBoons}
          addedBanes={addedBanes}
          boonPoints={boonPoints}
          banePoints={banePoints}
          showResetAllAlertDialog={this.state.showResetAllAlertDialog}
          showResetBoonAlertDialog={this.state.showResetBoonAlertDialog}
          showResetBaneAlertDialog={this.state.showResetBaneAlertDialog}
          minPoints={this.props.minPoints}
          maxPoints={this.props.maxPoints}
          totalPoints={this.props.totalPoints}
          flexOfBoonBar={this.state.flexOfBoonBar}
          flexOfBaneBar={this.state.flexOfBaneBar}
          onHideAllAlertDialog={this.onHideAllAlertDialog}
          onCancelBoonClick={this.props.onCancelBoonClick}
          onCancelBaneClick={this.props.onCancelBaneClick}
          onCancelRankBoon={this.props.onCancelRankBoon}
          onCancelRankBane={this.props.onCancelRankBane}
          onReset={this.props.onReset}
          onResetBoonsClick={this.onResetBoonsClick}
          onResetBanesClick={this.onResetBanesClick}
        />
        <TraitListContainer
          type={'bane'}
          traitsList={allBanes}
          minPoints={this.props.minPoints}
          maxPoints={this.props.maxPoints}
          boonPoints={boonPoints}
          banePoints={banePoints}
          traits={traits}
          addedBoons={addedBoons}
          addedBanes={addedBanes}
          allPrerequisites={this.props.allPrerequisites}
          allExclusives={this.props.allExclusives}
          onBoonClick={this.props.onBoonClick}
          onBaneClick={this.props.onBaneClick}
          onCancelBoonClick={this.props.onCancelBoonClick}
          onCancelBaneClick={this.props.onCancelBaneClick}
          onSelectRankBoon={this.props.onSelectRankBoon}
          onSelectRankBane={this.props.onSelectRankBane}
          onCancelRankBoon={this.props.onCancelRankBoon}
          onCancelRankBane={this.props.onCancelRankBane}
        />
      </Container>
    );
  }

  public componentDidMount() {
    const { totalPoints } = this.props;
    const shouldAffectBoonBar = totalPoints * -1 < 0;
    const shouldAffectBaneBar = totalPoints * -1 > 0;
    if (shouldAffectBoonBar) {
      this.setState({ flexOfBoonBar: totalPoints + 0.5, flexOfBaneBar: 1 });
    }
    if (shouldAffectBaneBar) {
      this.setState({ flexOfBaneBar: (totalPoints * -1) + 0.5, flexOfBoonBar: 1 });
    }
    if (totalPoints === 0) {
      this.setState({ flexOfBaneBar: 1, flexOfBoonBar: 1 });
    }
  }

  public componentWillUpdate(nextProps: BanesAndBoonsProps) {
    if (nextProps.totalPoints !== this.props.totalPoints) {
      const shouldAffectBoonBar = nextProps.totalPoints * -1 < 0;
      const shouldAffectBaneBar = nextProps.totalPoints * -1 > 0;
      if (shouldAffectBoonBar) {
        this.setState({ flexOfBoonBar: nextProps.totalPoints + 0.5, flexOfBaneBar: 1 });
      }
      if (shouldAffectBaneBar) {
        this.setState({ flexOfBaneBar: (nextProps.totalPoints * -1) + 0.5, flexOfBoonBar: 1 });
      }
      if (nextProps.totalPoints === 0) {
        this.setState({ flexOfBaneBar: 1, flexOfBoonBar: 1 });
      }
    }
  }

  private onResetBoonsClick = () => {
    this.setState({ showResetBoonAlertDialog: true });
  }

  private onResetBanesClick = () => {
    this.setState({ showResetBaneAlertDialog: true });
  }

  private onHideAllAlertDialog = () => {
    this.setState({ showResetAllAlertDialog: false, showResetBoonAlertDialog: false, showResetBaneAlertDialog: false });
  }
}

export default BanesAndBoons;
