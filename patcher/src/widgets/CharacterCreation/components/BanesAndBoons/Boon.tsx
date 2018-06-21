/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as events  from '@csegames/camelot-unchained/lib/events';
import { BanesAndBoonsInfo, TraitMap, TraitIdMap } from '../../services/session/banesAndBoons';
import Trait from './Trait';

const Boon = (props: {
  trait: BanesAndBoonsInfo;
  traits: TraitMap;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;
  addedBoons: TraitIdMap;
  maxPoints: number;
  boonPoints: number;
  
  shouldBeDefault?: boolean;
  onBoonClick?: Function;
  onCancelBoon?: Function;
  onSelectRankBoon?: Function;
  onCancelRankBoon?: Function;
}) => {
  const {
    trait,
    traits,
    onBoonClick,
    onCancelBoon,
    onSelectRankBoon,
    onCancelRankBoon,
    allPrerequisites,
    allExclusives,
    addedBoons,
    maxPoints,
    boonPoints,
  } = props;
  const onBoonSelect = (trait: BanesAndBoonsInfo) => {
    if (onBoonClick) {
      onBoonClick(trait);
      events.fire('play-sound', 'boon-select');
    }
  };

  return (
    <Trait
      type='Boon'
      trait={trait}
      traits={traits}
      onTraitClick={onBoonSelect}
      onCancelTrait={onCancelBoon}
      onSelectRankTrait={onSelectRankBoon}
      onCancelRankTrait={onCancelRankBoon}
      allPrerequisites={allPrerequisites}
      allExclusives={allExclusives}
      addedTraits={addedBoons}
      primaryColor='#41ACE9'
      maxPoints={maxPoints}
      totalPoints={boonPoints}
      shouldBeDefault={props.shouldBeDefault}
    />
  );
};

export default Boon;
