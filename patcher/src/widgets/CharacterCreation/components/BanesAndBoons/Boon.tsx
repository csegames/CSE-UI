/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { events } from '@csegames/camelot-unchained';
import { BanesAndBoonsInfo, TraitMap, TraitIdMap } from '../../services/session/banesAndBoons';
import Trait, { TraitStyle } from './Trait';

const Boon = (props: {
  styles?: Partial<TraitStyle>;
  trait: BanesAndBoonsInfo;
  traits: TraitMap;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;
  addedBoons: TraitIdMap;
  maxPoints: number;
  totalPoints: number;
  
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
    styles,
    maxPoints,
    totalPoints,
  } = props;
  const onBoonSelect = (trait: BanesAndBoonsInfo) => {
    if (onBoonClick) {
      onBoonClick(trait);
      events.fire('play-sound', 'boon-select');
    }
  };
  const boonStyles = Object.assign(
    {},
    styles,
    { trait: { marginRight: '10px', ...styles && styles.trait || {} } },
  );
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
      styles={boonStyles}
      maxPoints={maxPoints}
      totalPoints={totalPoints}
      shouldBeDefault={props.shouldBeDefault}
    />
  );
};

export default Boon;
