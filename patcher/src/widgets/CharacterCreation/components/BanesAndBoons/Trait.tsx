/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css, cx } from 'react-emotion';
import { BanesAndBoonsInfo, TraitMap, TraitIdMap } from '../../services/session/banesAndBoons';
import { events, Tooltip } from '@csegames/camelot-unchained';
import { colors } from '../../styleConstants';

const TraitView = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 50px;
  height: 50px;
  background-color: #4D4D4D;
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 0;
  margin-left: 0;
  user-select: none;
  border: ${(props: any) => `3px solid ${props.traitColor}`};
`;

const SelectedTrait = css`
  border: 3px solid #FFDFA5;
`;

const DisabledTrait = css`
  cursor: not-allowed;
`;

const Shadow = css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: background-color 0.3s;
  &:active {
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.8);
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
`;

const SelectedShadow = css`
  box-shadow: inset 0 0 30px #F4C066;
`;

const DisabledShadow = css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: background-color 0.3s;
  background-color: rgba(55, 55, 55, 0.7);
  &:hover {
    background-color: rgba(55, 55, 55, 0.7);
  }
`;

const Name = styled('div')`
  font-size: 1.3em;
  margin: 0 0 -4px 0;
`;

const Category = styled('div')`
  font-size: 1.2em;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: 5px;
`;

const Points = styled('div')`
  font-size: 1.2em;
  display: inline-block;
  color: orange;
  margin-left: 5px;
  margin-top: 0;
  margin-bottom: 0;
`;

const DependenciesContainer = styled('div')`
  display: flex;
  align-items: center;
  margin: 0;
`;

const DependencyText = styled('div')`
  margin: 0 0 -1px 5px;
`;

const RankText = styled('div')`
  font-size: 0.7em;
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  direction: ltr;
  margin: 0;
`;

const RegularText = styled('div')`
  margin: 0;
`;

const PointsCircle = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  width: 15px;
  height: 15px;
  border-radius: 1px;
  font-size: 0.7em;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
`;

const AdditionalInfoContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const Divider = styled('div')`
  font-size: 1.2em;
  margin: 0;
  color: #8F8F8F;
`;

const LeftSpacing = css`
  margin-left: 10px;
`;

const RightSpacing = css`
  margin-right: 10px;
`;

export interface TraitProps {
  type: 'Boon' | 'Bane';
  trait: BanesAndBoonsInfo;
  traits: TraitMap;
  onTraitClick: Function;
  onCancelTrait: Function;
  onSelectRankTrait: Function;
  onCancelRankTrait: Function;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;
  addedTraits: TraitIdMap;
  primaryColor: string;
  maxPoints: number;
  totalPoints: number;
  shouldBeDefault?: boolean;
}

class Trait extends React.Component<TraitProps, {}> {
  constructor(props: TraitProps) {
    super(props);
  }

  public render() {
    const {
      type,
      trait,
      traits,
      allPrerequisites,
      allExclusives,
      addedTraits,
      primaryColor,
      maxPoints,
      totalPoints,
      shouldBeDefault,
    } = this.props;

    const preReqs = trait.prerequisites && trait.prerequisites.map((preReq: string) => allPrerequisites[preReq]);

    const shouldBeDisabledBecausePreReqs = preReqs && preReqs.filter((preReq: string) =>
      addedTraits[preReq]).length !== preReqs.length;

    const addedRankTrait = trait.ranks && (addedTraits[trait.ranks[trait.rank - 1]] || addedTraits[trait.ranks[trait.rank]]);

    const exclusivityGroup = allExclusives[trait.id] ? trait.exclusivityGroup : [];

    const shouldBeDisabledBecauseExclusives = exclusivityGroup && exclusivityGroup.length > 0 &&
      exclusivityGroup.filter((exclusive: string) => addedTraits[exclusive] &&
      !addedTraits[trait.id]).length >= trait.maxAllowed;

    const shouldBeDisabled = shouldBeDisabledBecausePreReqs || shouldBeDisabledBecauseExclusives || trait.required ||
    (trait.points <= -1 && totalPoints + (trait.points * -1) > (maxPoints / 2) && !trait.selected) ||
    (trait.points >= 1 && totalPoints + (trait.points) > (maxPoints / 2) && !trait.selected);

    const traitColor = trait.category === 'Class' ? colors.classTrait : trait.category === 'Race' ?
      colors.raceTrait : trait.category === 'Faction' ? colors.factionTrait : '#636262';

    return (
      <Tooltip
        styles={{
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            maxWidth: '500px',
            direction: 'ltr',
          },
        }}
        content={() => (
          <div>
            <Name style={{ color: primaryColor }}>{trait.name}</Name>
            <AdditionalInfoContainer>
              <Category style={{ color: traitColor }}>
                {trait.required ? 'Required' : trait.category || 'General'} {type}
              </Category>
              <Divider>|</Divider>
              <Points>
                Value: {type === 'Bane' ? trait.points * -1 : trait.points}
              </Points>
            </AdditionalInfoContainer>
            {trait.ranks &&
              <RegularText>
                Rank: {trait.rank === 0 ? 0 : traits[addedRankTrait].rank + 1} / {trait.ranks.length}
              </RegularText>
            }
            <p>{trait.description}</p>
            {preReqs &&
              <DependenciesContainer>
                Dependencies: {preReqs.map((preReq: string, i: number) =>
                  <DependencyText key={i} style={{ color: addedTraits[preReq] ? colors.success : 'red' }}>
                    {traits[preReq].name}{preReq !== preReqs[preReqs.length - 1] && ', '}
                  </DependencyText>)}
              </DependenciesContainer>
            }
            {exclusivityGroup.length > 0 &&
              <div>
                <DependenciesContainer>
                  Exclusive group: {exclusivityGroup.map((exclusive: string, i: number) =>
                  <DependencyText
                    key={i}
                    style={{ color: addedTraits[exclusive] ? colors.success : 'red' }}>
                      {traits[exclusive].name}{exclusive !== exclusivityGroup[exclusivityGroup.length - 1] && ', '}
                  </DependencyText>,
                )}
                </DependenciesContainer>
                <RegularText>Minimum exclusives required: {trait.minRequired}</RegularText>
                <RegularText>Maximum exclusives allowed: {trait.maxAllowed}</RegularText>
              </div>
              }
              {trait.ranks && <RegularText>Shift + Left Click to downgrade</RegularText>}
          </div>
          )}>
        <TraitView
          className={cx(
            type === 'Boon' ? RightSpacing : LeftSpacing,
            trait.selected && !shouldBeDefault ? SelectedTrait : '',
            shouldBeDisabled && !shouldBeDefault && DisabledTrait,
          )}
          traitColor={traitColor}
          onClick={shouldBeDisabled ? () => {} : trait.ranks ? this.onRankClick : this.onTraitClick}
          style={{ background: `url(${trait.icon}) no-repeat`, backgroundSize: 'cover' }}>
            <PointsCircle>
              {type === 'Bane' ? trait.points * -1 : trait.points}
            </PointsCircle>
              {trait.ranks &&
              <RankText>
                {trait.rank === 0 ? 0 : traits[addedRankTrait].rank + 1} / {trait.ranks.length}
              </RankText>}
              {!shouldBeDisabled ?
              <div className={cx(
                !shouldBeDefault ? Shadow : '',
                trait.selected && !shouldBeDefault ? SelectedShadow : '')}
              /> :
                <div className={css(
                  !shouldBeDefault ? DisabledShadow : '',
                  trait.selected && !shouldBeDefault ? SelectedShadow : '')}
                />}
        </TraitView>
      </Tooltip>
    );
  }

  public componentWillUpdate(nextProps: TraitProps) {
    // This gets rid of a selected trait after one of its prerequisites have been unselected.
    const { trait, allPrerequisites, addedTraits, onCancelTrait } = nextProps;

    const preReqs = trait.prerequisites && trait.prerequisites.map((preReq: string) => allPrerequisites[preReq]);

    const shouldBeDisabled = preReqs && preReqs.filter((preReq: string) =>
      addedTraits[preReq]).length !== preReqs.length;

    if (shouldBeDisabled && trait.selected && onCancelTrait) {
      onCancelTrait(trait);
    }
  }

  private onTraitClick = () => {
    const { trait, onTraitClick, onCancelTrait } = this.props;
    if (trait.selected && onCancelTrait) {
      events.fire('play-sound', 'select');
      onCancelTrait(trait);
    } else {
      if (onTraitClick) {
        onTraitClick(trait);
      }
    }
  }

  private onRankClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      trait,
      traits,
      addedTraits,
      onTraitClick,
      onCancelTrait,
      onSelectRankTrait,
      onCancelRankTrait,
    } = this.props;

    const addedRankTrait = trait.ranks && (addedTraits[trait.ranks[trait.rank - 1]] || addedTraits[trait.ranks[trait.rank]]);

    if (e.shiftKey) {
      if (traits[addedRankTrait].ranks) {
        if (traits[addedRankTrait].rank === 0 && onCancelTrait) onCancelTrait(traits[addedRankTrait]);
        if (onCancelRankTrait) onCancelRankTrait(traits[addedRankTrait]);
      }
    } else {
      if (trait.rank === 0 && !addedTraits[trait.id] && onTraitClick) {
        onTraitClick(trait);
      }
      if (onSelectRankTrait) onSelectRankTrait(trait);
    }
  }
}

export default Trait;
