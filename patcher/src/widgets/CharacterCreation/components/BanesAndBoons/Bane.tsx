/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { events } from 'camelot-unchained';
import { BanesAndBoonsInfo, TraitMap, TraitIdMap } from '../../services/session/banesAndBoons';
import Trait, { TraitStyle } from './Trait';

const Bane = (props: {
  styles?: Partial<TraitStyle>;
  trait: BanesAndBoonsInfo;
  traits: TraitMap;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;
  addedBanes: TraitIdMap;
  maxPoints: number;
  totalPoints: number;

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
    styles,
    maxPoints,
    totalPoints,
  } = props;
  const onBaneSelect = (trait: BanesAndBoonsInfo) => {
    if (onBaneClick) {
      onBaneClick(trait);
      events.fire('play-sound', 'bane-select');
    }
  };
  const baneStyles = Object.assign(
    {},
    { trait: { marginLeft: '10px', ...styles && styles.trait || {} } },
    styles,
  );
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
      styles={baneStyles}
      maxPoints={maxPoints}
      totalPoints={totalPoints}
      shouldBeDefault={props.shouldBeDefault}
    />
  );
};

export default Bane;
