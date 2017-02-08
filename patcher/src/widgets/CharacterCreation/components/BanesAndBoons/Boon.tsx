import * as React from 'react';
import { BanesAndBoonsInfo } from '../../services/session/banesAndBoons';
import Trait, { TraitStyle } from './Trait';
import { styleConstants } from '../../styleConstants';

const Boon = (props: {
  trait: BanesAndBoonsInfo;
  onBoonClick: Function;
  onCancelBoon: Function;
  onUpdateRankBoon: Function;
  allPrerequisites: Array<BanesAndBoonsInfo>;
  allExclusives: Array<BanesAndBoonsInfo>;
  addedBoons: Array<BanesAndBoonsInfo>;
  styles: Partial<TraitStyle>;
}) => {
  const {
    trait,
    onBoonClick,
    onCancelBoon,
    onUpdateRankBoon,
    allPrerequisites,
    allExclusives,
    addedBoons,
    styles
  } = props;
  const boonStyles = Object.assign(
    {},
    styles,
    { trait: { ...styleConstants.marginRight, ...styles.trait } }
  );
  return (
    <Trait
      type='Boon'
      trait={trait}
      onTraitClick={onBoonClick}
      onCancelTrait={onCancelBoon}
      onUpdateRankTrait={onUpdateRankBoon}
      allPrerequisites={allPrerequisites}
      allExclusives={allExclusives}
      addedTraits={addedBoons}
      primaryColor='#41ACE9'
      styles={boonStyles}
    />
  )
};

export default Boon;
