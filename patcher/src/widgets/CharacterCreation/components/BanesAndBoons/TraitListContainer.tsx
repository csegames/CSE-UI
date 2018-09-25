/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

import Bane from './Bane';
import Boon from './Boon';
import { BanesAndBoonsInfo, TraitIdMap, TraitMap } from '../../services/session/banesAndBoons';
import { colors } from '../../styleConstants';

const Container = styled('div')`
  flex: 1;
  flex-direction: column;
  padding-bottom: 15px;
  background-color: colors.transparentBg;
  border: 1px solid ${colors.lightGray};
  overflow: visible;
`;

const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 15px;
  padding-left: 15px;
`;

const Title = styled('div')`
  font-size: 1.7em;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: ${(props: any) => props.textAlign};
  color: ${(props: any) => props.color};
`;

const RangePointsText = styled('div')`
  margin: 0;
  font-size: 1em;
  color: #EEE;
`;

const InnerWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: ${(props: any) => props.alignItems};
  flex: 1;
  height: 50vh;
  width: 24vw;
  overflow-y: auto;
  padding-top: 20px;
  padding-left: 15px;
  padding-right: 15px;
  border-bottom: 1px solid #454545;
  border-top: 1px solid #454545;
  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const TraitsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: ${(props: any) => props.alignItems};
  justify-content: ${(props: any) => props.justifyContent};
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
      <Container>
        <HeaderContainer>
          <Title style={{ color: colors.boonPrimary }}>{type === 'boon' ? 'Boons' : 'Banes'}</Title>
          <div>
            <RangePointsText id={`${this.props.type}-minPoints`}>
              Minimum Total Points Needed: {this.props.minPoints / 2}
            </RangePointsText>
            <RangePointsText id={`${this.props.type}-maxPoints`}>
              Maximum Total Points Allowed: {this.props.maxPoints / 2}
            </RangePointsText>
          </div>
        </HeaderContainer>
        <InnerWrapper alignItems={type === 'boon' ? 'flex-start' : 'flex-end'}>
          <TraitsContainer>
            {this.props.traitsList.map((trait: BanesAndBoonsInfo, index: number) => {
              return (
                <div key={index} id={`${this.props.type}-${index}`}>
                  {this.props.type === 'boon' ?
                    <Boon
                      trait={trait}
                      addedBoons={this.props.addedBoons}
                      boonPoints={this.props.boonPoints}
                      traits={this.props.traits}
                      onBoonClick={this.props.onBoonClick}
                      onCancelBoon={this.props.onCancelBoonClick}
                      allPrerequisites={this.props.allPrerequisites}
                      allExclusives={this.props.allExclusives}
                      onSelectRankBoon={this.props.onSelectRankBoon}
                      onCancelRankBoon={this.props.onCancelRankBoon}
                      maxPoints={this.props.maxPoints}
                    /> :
                      <Bane
                        trait={trait}
                        addedBanes={this.props.addedBanes}
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
                  }
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
