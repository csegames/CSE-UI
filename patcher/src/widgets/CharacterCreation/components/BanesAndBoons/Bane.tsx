/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as events  from '@csegames/camelot-unchained/lib/events';
import { BanesAndBoonsInfo, TraitMap, TraitIdMap } from '../../services/session/banesAndBoons';
import Trait from './Trait';

const Bane = (props: {
  trait: BanesAndBoonsInfo;
  traits: TraitMap;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;
  addedBanes: TraitIdMap;
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
    addedBanes,
    maxPoints,
    banePoints,
  } = props;
  const onBaneSelect = (trait: BanesAndBoonsInfo) => {
    if (onBaneClick) {
      onBaneClick(trait);
      events.fire('play-sound', 'bane-select');
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
      addedTraits={addedBanes}
      primaryColor='#E85143'
      maxPoints={maxPoints}
      totalPoints={banePoints}
      shouldBeDefault={props.shouldBeDefault}
    />
  );
};

export default Bane;
