import * as React from 'react';
import { BanesAndBoonsInfo } from '../../services/session/banesAndBoons';
import Trait, { TraitStyle } from './Trait';
import { styleConstants } from '../../styleConstants';

const Bane = (props: {
  trait: BanesAndBoonsInfo;
  onBaneClick: Function;
  onCancelBane: Function;
  onUpdateRankBane: Function;
  allPrerequisites: Array<BanesAndBoonsInfo>;
  allExclusives: Array<BanesAndBoonsInfo>;
  addedBanes: Array<BanesAndBoonsInfo>;
  styles: Partial<TraitStyle>;
}) => {
  const {
    trait,
    onBaneClick,
    onCancelBane,
    onUpdateRankBane,
    allPrerequisites,
    allExclusives,
    addedBanes,
    styles
  } = props;
  const baneStyles = Object.assign(
    {},
    { trait: { ...styleConstants.marginLeft, ...styles.trait } },
    styles
  );
  return (
    <Trait
      type='Bane'
      trait={trait}
      onTraitClick={onBaneClick}
      onCancelTrait={onCancelBane}
      onUpdateRankTrait={onUpdateRankBane}
      allPrerequisites={allPrerequisites}
      allExclusives={allExclusives}
      addedTraits={addedBanes}
      primaryColor='#E85143'
      styles={baneStyles}
    />
  )
};

export default Bane;
