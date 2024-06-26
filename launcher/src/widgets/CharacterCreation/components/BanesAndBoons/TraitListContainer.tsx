/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import Bane from './Bane';
import Boon from './Boon';
import { BanesAndBoonsInfo, TraitIdMap, TraitMap } from '../../services/session/banesAndBoons';
import { colors } from '../../styleConstants';

const Container = styled.div`
  z-index: 10;
  flex: 1;
  flex-direction: column;
  padding-bottom: 15px;
  background-color: colors.transparentBg;
  border: 1px solid ${colors.lightGray};
  overflow: visible;
  &.bane {
    animation: slideRightToLeft 1.5s forwards;
  }
  &.boon {
    animation: slideLeftToRight 1.5s forwards;
  }
  @keyframes slideLeftToRight {
    from {
      opacity: 0;
      transform: translateX(-20%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideRightToLeft {
    from {
      opacity: 0;
      transform: translateX(20%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 15px;
  padding-left: 15px;
`;

const Title = styled.div`
  font-family: 'Caudex';
  font-size: 1.7em;
  color: #d3a36f;
  margin-top: 10px;
  margin-bottom: 10px;
  &.bane {
    color: rgb(233, 65, 65);
  }
  &.boon {
    color: rgb(65, 172, 233);
  }
`;

const RangePointsText = styled.div`
  margin: 0;
  font-size: 0.8em;
  color: #eee;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 50vh;
  width: 24vw;
  overflow-y: auto;
  padding-top: 20px;
  padding-left: 15px;
  padding-right: 15px;
  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const TraitsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export interface TraitListContainerProps {
  type: 'bane' | 'boon';
  traitsList: BanesAndBoonsInfo[];
  minPoints: number;
  maxPoints: number;
  boonPoints: number;
  banePoints: number;
  traits: TraitMap;
  addedBoons: TraitIdMap;
  addedBanes: TraitIdMap;
  allAddedTraits: TraitIdMap;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;

  onBoonClick: (boon: BanesAndBoonsInfo) => void;
  onBaneClick: (bane: BanesAndBoonsInfo) => void;
  onCancelBoonClick: (boon: BanesAndBoonsInfo) => void;
  onCancelBaneClick: (bane: BanesAndBoonsInfo) => void;
  onSelectRankBoon: (boon: BanesAndBoonsInfo) => void;
  onSelectRankBane: (bane: BanesAndBoonsInfo) => void;
  onCancelRankBoon: (boon: BanesAndBoonsInfo) => void;
  onCancelRankBane: (bane: BanesAndBoonsInfo) => void;
}

class TraitListContainer extends React.Component<TraitListContainerProps> {
  public render() {
    const { type } = this.props;
    return (
      <Container className={`${this.props.type}`}>
        <HeaderContainer>
          <Title className={`${this.props.type}`}>{type === 'boon' ? 'Boons' : 'Banes'}</Title>
          <div>
            <RangePointsText id={`${this.props.type}-minPoints`}>
              Minimum Total Points Needed: {this.props.minPoints / 2}
            </RangePointsText>
            <RangePointsText id={`${this.props.type}-maxPoints`}>
              Maximum Total Points Allowed: {this.props.maxPoints / 2}
            </RangePointsText>
          </div>
        </HeaderContainer>
        <InnerWrapper style={{ alignItems: type === 'boon' ? 'flex-start' : 'flex-end' }}>
          <TraitsContainer>
            {this.props.traitsList.map((trait: BanesAndBoonsInfo, index: number) => {
              return (
                <div key={index} id={`${this.props.type}-${index}`}>
                  {this.props.type === 'boon' ? (
                    <Boon
                      trait={trait}
                      addedTraits={this.props.allAddedTraits}
                      boonPoints={this.props.boonPoints}
                      traits={this.props.traits}
                      onBoonClick={this.props.onBoonClick}
                      onCancelBoon={this.props.onCancelBoonClick}
                      allPrerequisites={this.props.allPrerequisites}
                      allExclusives={this.props.allExclusives}
                      onSelectRankBoon={this.props.onSelectRankBoon}
                      onCancelRankBoon={this.props.onCancelRankBoon}
                      maxPoints={this.props.maxPoints}
                    />
                  ) : (
                    <Bane
                      trait={trait}
                      addedTraits={this.props.allAddedTraits}
                      banePoints={this.props.banePoints}
                      traits={this.props.traits}
                      onBaneClick={this.props.onBaneClick}
                      onCancelBane={this.props.onCancelBaneClick}
                      allPrerequisites={this.props.allPrerequisites}
                      allExclusives={this.props.allExclusives}
                      onSelectRankBane={this.props.onSelectRankBane}
                      onCancelRankBane={this.props.onCancelRankBane}
                      maxPoints={this.props.maxPoints}
                    />
                  )}
                </div>
              );
            })}
          </TraitsContainer>
        </InnerWrapper>
      </Container>
    );
  }
}

export default TraitListContainer;
