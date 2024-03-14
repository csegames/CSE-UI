/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { TraitMap, TraitIdMap, BanesAndBoonsInfo } from '../../services/session/banesAndBoons';
import Trait from './Trait';
import { Sound, playSound } from '../../../../lib/Sound';

const Bane = (props: {
  trait: BanesAndBoonsInfo;
  traits: TraitMap;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;
  addedTraits: TraitIdMap;
  maxPoints: number;
  banePoints: number;

  shouldBeDefault?: boolean;
  onBaneClick?: Function;
  onCancelBane?: Function;
  onSelectRankBane?: Function;
  onCancelRankBane?: Function;
}) => {
  const {
    trait,
    traits,
    onBaneClick,
    onCancelBane,
    onSelectRankBane,
    onCancelRankBane,
    allPrerequisites,
    allExclusives,
    addedTraits,
    maxPoints,
    banePoints
  } = props;
  const onBaneSelect = (trait: BanesAndBoonsInfo) => {
    if (onBaneClick) {
      onBaneClick(trait);
      playSound(Sound.BaneSelect);
    }
  };
  return (
    <Trait
      type='Bane'
      trait={trait}
      traits={traits}
      onTraitClick={onBaneSelect}
      onCancelTrait={onCancelBane}
      onSelectRankTrait={onSelectRankBane}
      onCancelRankTrait={onCancelRankBane}
      allPrerequisites={allPrerequisites}
      allExclusives={allExclusives}
      addedTraits={addedTraits}
      primaryColor='#E85143'
      maxPoints={maxPoints}
      totalPoints={banePoints}
      shouldBeDefault={props.shouldBeDefault}
    />
  );
};

export default Bane;
