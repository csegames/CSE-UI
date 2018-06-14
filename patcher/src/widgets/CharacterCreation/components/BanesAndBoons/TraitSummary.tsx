/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as events  from '@csegames/camelot-unchained/lib/events';

import { BanesAndBoonsInfo } from '../../services/session/banesAndBoons';
import { colors } from '../../styleConstants';

const BANE = 'Bane';
const BOON = 'Boon';

export interface TraitSummaryProps {
  trait: BanesAndBoonsInfo;
  onCancelClick: Function;
  type: 'Bane' | 'Boon';
  onCancelRankTrait: Function;
}

const AddedSummaryContainer = styled('div')`
  position: relative;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: rgba(49, 49, 49, 0.7);
`;

const Name = styled('div')`
  font-size: 1.1em;
  line-height: 1.1em;
  margin-bottom: 5px;
  margin-top: 0;
`;

const Points = styled('div')`
  margin: 0;
  color: orange;
  margin-left: 5px;
`;

const TitleContainer = styled('div')`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const Description = styled('div')`
  color: #CCC;
  margin-bottom: 0;
`;

const Category = styled('div')`
  margin-top: 0;
  margin-bottom: 0;
  margin-right: 5px;
`;

const Icon = styled('img')`
  width: 60px;
  height: 60px;
`;

const AdditionalInfoContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const Divider = styled('div')`
  font-size: 1em;
  margin: 0;
  color: #8F8F8F;
`;

const RemoveButton = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${colors.banePrimary};
  }
`;

class TraitSummary extends React.Component<TraitSummaryProps, {}> {

  public render() {
    const { trait, type } = this.props;

    const traitColor = trait.category === 'Class' ? colors.classTrait : trait.category === 'Race' ?
      colors.raceTrait : trait.category === 'Faction' ? colors.factionTrait : '#636262';

    return (
      <AddedSummaryContainer id={trait.required ? 'required-trait' : ''}>
        {!trait.required &&
        <RemoveButton onClick={this.onCancelClick}>
          X
        </RemoveButton>
        }
        <TitleContainer>
          <div>
            <Name style={{ color: type === BOON ? colors.boonPrimary : colors.banePrimary }}>
              {trait.name}
            </Name>
            <AdditionalInfoContainer>
              <Category style={{ color: traitColor }}>
                {trait.required ? 'Required' : trait.category ? trait.category : 'General'} {type}
              </Category>
              <Divider>|</Divider>
              <Points>
                Value: {type === BANE ? trait.points * -1 : trait.points}
              </Points>
            </AdditionalInfoContainer>
          </div>
          <Icon src={trait.icon} />
        </TitleContainer>
        <Description>{trait.description}</Description>
      </AddedSummaryContainer>
    );
  }
  
  private onCancelClick = () => {
    const { trait, onCancelClick, onCancelRankTrait } = this.props;
    events.fire('play-sound', 'select');
    if (trait.ranks) {
      if (trait.rank === 0) onCancelClick(trait);
      onCancelRankTrait(trait);
    } else {
      onCancelClick(trait);
    }
  }
}

export default TraitSummary;
