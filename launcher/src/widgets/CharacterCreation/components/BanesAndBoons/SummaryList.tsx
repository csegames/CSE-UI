/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import TraitSummary from './TraitSummary';
import SummaryListHeader from './SummaryListHeader';
import ResetAlert from './ResetAlert';
import { colors } from '../../styleConstants';
import { TraitMap, TraitIdMap, BanesAndBoonsInfo } from '../../services/session/banesAndBoons';
import { Sound, playSound } from '../../../../lib/Sound';

const Container = styled.div`
  height: 100%;
  width: 48vw;
  padding: 0 15px;
  opacity: 0;
  animation: slideBotToTop 1.5s forwards;
  @keyframes slideBotToTop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const InnerSummaryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: calc(100% - 120px);
  background-color: ${colors.transparentBg};
  overflow: auto;
  padding: 0 15px;
  &::-webkit-scrollbar: {
    width: 5px;
    border-radius: 2px;
  }
`;

const AddedBoonSummaryWrapper = styled.div`
  flex: 1;
`;

const AddedBaneSummaryWrapper = styled.div`
  flex: 1;
  margin-left: 15px;
`;

export interface SummaryListProps {
  traits: TraitMap;
  addedBanes: TraitIdMap;
  addedBoons: TraitIdMap;
  flexOfBoonBar: number;
  flexOfBaneBar: number;
  banePoints: number;
  boonPoints: number;
  minPoints: number;
  maxPoints: number;
  totalPoints: number;

  showResetAllAlertDialog: boolean;
  showResetBoonAlertDialog: boolean;
  showResetBaneAlertDialog: boolean;

  onReset: (initType: 'banes' | 'boons' | 'both') => void;
  onHideAllAlertDialog: () => void;
  onResetBoonsClick: () => void;
  onResetBanesClick: () => void;
  onCancelBoonClick: (boon: BanesAndBoonsInfo) => void;
  onCancelBaneClick: (bane: BanesAndBoonsInfo) => void;
  onCancelRankBoon: (boon: BanesAndBoonsInfo) => void;
  onCancelRankBane: (bane: BanesAndBoonsInfo) => void;
}

export interface SummaryListState {}

class SummaryList extends React.Component<SummaryListProps, SummaryListState> {
  public render() {
    const {
      banePoints,
      boonPoints,
      minPoints,
      maxPoints,
      totalPoints,
      showResetAllAlertDialog,
      showResetBoonAlertDialog,
      showResetBaneAlertDialog
    } = this.props;
    return (
      <Container>
        <SummaryListHeader
          flexOfBoonBar={this.props.flexOfBoonBar}
          flexOfBaneBar={this.props.flexOfBaneBar}
          banePoints={banePoints}
          boonPoints={boonPoints}
          minPoints={minPoints}
          maxPoints={maxPoints}
          totalPoints={totalPoints}
          onResetAllClick={this.onResetAllClick.bind(this)}
          onResetBoonsClick={this.onResetBoonsClick.bind(this)}
          onResetBanesClick={this.onResetBanesClick.bind(this)}
        />
        <InnerSummaryWrapper>
          <AddedBoonSummaryWrapper>
            {Object.keys(this.props.addedBoons)
              .slice(0)
              .reverse()
              .map((key: string, index: number) => (
                <div key={index} id={`boon-summary-${index}`}>
                  <TraitSummary
                    key={index}
                    trait={this.props.traits[key]}
                    onCancelClick={this.props.onCancelBoonClick}
                    onCancelRankTrait={this.props.onCancelRankBoon}
                    type='Boon'
                  />
                </div>
              ))}
          </AddedBoonSummaryWrapper>
          <AddedBaneSummaryWrapper>
            {Object.keys(this.props.addedBanes)
              .slice(0)
              .reverse()
              .map((key: string, index: number) => (
                <TraitSummary
                  key={index}
                  trait={this.props.traits[key]}
                  onCancelClick={this.props.onCancelBaneClick}
                  onCancelRankTrait={this.props.onCancelRankBoon}
                  type='Bane'
                />
              ))}
          </AddedBaneSummaryWrapper>
        </InnerSummaryWrapper>
        <ResetAlert
          showResetAllAlertDialog={showResetAllAlertDialog}
          showResetBaneAlertDialog={showResetBaneAlertDialog}
          showResetBoonAlertDialog={showResetBoonAlertDialog}
          onResetClick={this.onResetClick.bind(this)}
          onCancelClick={this.onCancelClick.bind(this)}
        />
      </Container>
    );
  }

  private onCancelClick() {
    this.props.onHideAllAlertDialog();
  }

  private onResetBoonsClick() {
    playSound(Sound.Select);
    this.props.onResetBoonsClick();
  }

  private onResetBanesClick() {
    playSound(Sound.Select);
    this.props.onResetBanesClick();
  }

  private onResetAllClick() {
    playSound(Sound.Select);
    this.props.onResetBoonsClick();
    this.props.onResetBanesClick();
  }

  private onResetClick(initType: 'banes' | 'boons' | 'both') {
    playSound(Sound.ResetTraits);
    this.props.onHideAllAlertDialog();
    switch (initType) {
      case 'banes': {
        window.setTimeout(() => {
          this.props.onReset('banes');
        }, 100);
        break;
      }
      case 'boons': {
        window.setTimeout(() => {
          this.props.onReset('boons');
        }, 100);
        break;
      }
      case 'both': {
        window.setTimeout(() => {
          this.props.onReset('both');
        }, 100);
        break;
      }
    }
  }
}

export default SummaryList;
