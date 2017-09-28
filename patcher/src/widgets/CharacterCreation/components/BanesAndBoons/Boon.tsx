/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { events } from 'camelot-unchained';
import { BanesAndBoonsInfo, TraitMap, TraitIdMap } from '../../services/session/banesAndBoons';
import Trait, { TraitStyle } from './Trait';
import { styleConstants } from '../../styleConstants';

const Boon = (props: {
  trait: BanesAndBoonsInfo;
  traits: TraitMap;
  onBoonClick: Function;
  onCancelBoon: Function;
  onSelectRankBoon: Function;
  onCancelRankBoon: Function;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;
  addedBoons: TraitIdMap;
  styles: Partial<TraitStyle>;
  maxPoints: number;
  totalPoints: number;
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
    onBoonClick(trait);
    events.fire('play-sound', 'boon-select');
  };
  const boonStyles = Object.assign(
    {},
    styles,
    { trait: { marginRight: '10px', ...styles.trait } },
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
    />
  );
};

export default Boon;
