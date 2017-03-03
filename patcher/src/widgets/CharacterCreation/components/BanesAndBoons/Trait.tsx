/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-03 16:12:18
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-03 16:19:37
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { BanesAndBoonsInfo } from '../../services/session/banesAndBoons';
import { events, Tooltip } from 'camelot-unchained';
import { styleConstants, colors } from '../../styleConstants';

export interface TraitStyle extends StyleDeclaration {
  traitContainer: React.CSSProperties;
  trait: React.CSSProperties;
  selectedTrait: React.CSSProperties;
  disabledTrait: React.CSSProperties;
  traitImage: React.CSSProperties;
  shadow: React.CSSProperties;
  disabledShadow: React.CSSProperties;
  tooltipText: React.CSSProperties;
  titleContainer: React.CSSProperties;
  traitName: React.CSSProperties;
  traitCategory: React.CSSProperties;
  traitPoints: React.CSSProperties;
  dependenciesContainer: React.CSSProperties;
  dependencyText: React.CSSProperties;
  rankText: React.CSSProperties;
  regularText: React.CSSProperties;
}

export interface TraitProps {
  type: 'Boon' | 'Bane';
  trait: BanesAndBoonsInfo;
  onTraitClick: Function;
  onCancelTrait: Function;
  onUpdateRankTrait: Function;
  allPrerequisites: BanesAndBoonsInfo[];
  allExclusives: BanesAndBoonsInfo[];
  addedTraits: BanesAndBoonsInfo[];
  primaryColor: string;
  styles: Partial<TraitStyle>;
}

export const defaultTraitStyles: TraitStyle = {
  traitContainer: {
    position: 'relative',
    overflow: 'visible'
  },

  trait: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '50px',
    height: '50px',
    backgroundColor: '#4D4D4D',
    marginBottom: '15px',
    cursor: 'pointer',
    border: '2px solid #636262',
    marginRight: 0,
    marginLeft: 0
  },

  selectedTrait: {
    border: '2px solid yellow'
  },

  disabledTrait: {
    cursor: 'not-allowed'
  },

  traitImage: {
    flexShrink: 0,
    minWidth: '100%',
    minHeight: '100%'
  },

  shadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    transition: 'background-color 0.3s',
    ':active': {
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
    },
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.4)'
    }
  },

  disabledShadow: {
    backgroundColor: 'rgba(55,55,55,0.7)',
    ':active': {
      boxShadow: 'none'
    },
    ':hover': {
      backgroundColor: 'rgba(55,55,55,0.7)'
    }
  },

  tooltipText: {
    fontSize: '0.8em'
  },

  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  traitName: {
    fontSize: '1.3em',
    margin: '0px 0px -4px 0px'
  },

  traitCategory: {
    fontSize: '1.2em',
    marginTop: '-2px',
    marginBottom: 0,
    color: '#777'
  },

  traitPoints: {
    fontSize: '1.2em',
    display: 'inline-block',
    color: 'orange',
    ...styleConstants.marginZero
  },

  dependenciesContainer: {
    display: 'flex',
    alignItems: 'center',
    ...styleConstants.marginZero
  },

  dependencyText: {
    margin: '0 0 -1px 5px'
  },

  rankText: {
    fontSize: '0.7em',
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    direction: 'ltr',
    ...styleConstants.marginZero
  },

  regularText: {
    ...styleConstants.marginZero
  }
};

class Trait extends React.Component<TraitProps, {}> {
  constructor(props: TraitProps) {
    super(props);
  }

  private componentWillUpdate(nextProps: TraitProps) {
    // This gets rid of a selected trait after one of its prerequisites have been unselected.
    const { trait, allPrerequisites, addedTraits, onCancelTrait } = nextProps;

    const preReqs = trait.prerequisites && trait.prerequisites.map((preReq: string) =>
      allPrerequisites.find((trait: BanesAndBoonsInfo) => preReq === trait.id));

    const shouldBeDisabled = preReqs && addedTraits.filter((addedTrait: BanesAndBoonsInfo) =>
      preReqs.find((preReq: BanesAndBoonsInfo) => addedTrait.id === preReq.id)).length !== preReqs.length;

    if (shouldBeDisabled && trait.selected) {
      onCancelTrait(trait)
    }
  }

  private onTraitClick = () => {
    const { trait, onTraitClick, onCancelTrait } = this.props;
    events.fire('play-sound', 'select');
    if (trait.selected) {
      onCancelTrait(trait);
    } else {
      onTraitClick(trait);
    }
  };

  private onRankClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      trait,
      addedTraits,
      onTraitClick,
      onCancelTrait,
      onUpdateRankTrait
    } = this.props;
    const addedRankTrait =
      addedTraits.find((boon: BanesAndBoonsInfo) => trait.ranks &&
      (trait.ranks[trait.rank - 1] === boon.id || trait.ranks[trait.rank] === boon.id));

    if (e.shiftKey) {
      if (addedRankTrait.ranks) {
        if (addedRankTrait.rank === 0) onCancelTrait(addedRankTrait);
        onUpdateRankTrait('cancel', addedRankTrait);
      }
    } else {
      if (trait.rank === 0 && addedTraits.indexOf(trait) === -1) onTraitClick(trait);
      onUpdateRankTrait('select', trait);
    }
  };

  render() {
    const {
      type,
      trait,
      allPrerequisites,
      allExclusives,
      addedTraits,
      primaryColor,
      styles
    } = this.props;
    const preReqs = trait.prerequisites &&
      trait.prerequisites.map((preReq: string) => allPrerequisites.find((trait: BanesAndBoonsInfo) => preReq === trait.id));

    const shouldBeDisabledBecausePreReqs = preReqs && addedTraits.filter((addedTrait: BanesAndBoonsInfo) =>
      preReqs.find((preReq: BanesAndBoonsInfo) => addedTrait.id === preReq.id)).length !== preReqs.length;

    const addedRankTrait = addedTraits.find((boon: BanesAndBoonsInfo) => trait.ranks && (trait.ranks[trait.rank - 1] === boon.id ||
      trait.ranks[trait.rank] === boon.id));

    const allExclusivesInGroup = allExclusives.filter((exclusiveTrait: BanesAndBoonsInfo) =>
      allExclusives.find((exclusive: BanesAndBoonsInfo) => exclusive.id === trait.id) &&
      allExclusives.find((exclusive: BanesAndBoonsInfo) => exclusive.id === trait.id).exclusivityGroup === exclusiveTrait.exclusivityGroup);

    const exclusiveTrait = allExclusives.find((exclusive: BanesAndBoonsInfo) => trait.id === exclusive.id);

    const shouldBeDisabledBecauseExclusives = allExclusivesInGroup.length > 0 &&
      addedTraits.filter((addedTrait: BanesAndBoonsInfo) => allExclusivesInGroup.find((exclusive: BanesAndBoonsInfo) =>
      addedTrait.id === exclusive.id) && exclusiveTrait.id !== addedTrait.id).length >= exclusiveTrait.maxAllowed;

    const shouldBeDisabled = shouldBeDisabledBecausePreReqs || shouldBeDisabledBecauseExclusives;

    const ss = StyleSheet.create(defaultTraitStyles);
    const custom = StyleSheet.create(styles || {});

    return (
      <div className={css(ss.trait, trait.selected && ss.selectedTrait, shouldBeDisabled && ss.disabledTrait,
       custom.trait, shouldBeDisabled && custom.disabledTrait, trait.selected && custom.selectedTrait)}
       onClick={shouldBeDisabled ? () => {} : trait.ranks ? this.onRankClick : this.onTraitClick}>
        <img className={css(ss.traitImage, custom.traitImage)} src={trait.icon} />
        <Tooltip
          styles={{
            content: {
              backgroundColor: 'rgba(0,0,0,0.9)',
              maxWidth: '500px',
              ...styleConstants.direction.ltr
            }
          }}
          content={() => (
            <div>
              <p className={css(ss.traitName, custom.traitName)} style={{ color: primaryColor }}>{trait.name}</p>
              <p className={css(ss.traitPoints, custom.traitPoints)}>Points: {trait.points}</p>
              <p className={css(ss.traitCategory, custom.traitCategory)}>{trait.category} {type}</p>
              {(addedRankTrait || trait.rank === 0) &&
              <p className={css(ss.regularText, custom.regularText)}>
                Rank: {trait.rank === 0 ? 0 : addedRankTrait.rank + 1} / {trait.ranks.length}
              </p>}
              <p>{trait.description}</p>
              {preReqs &&
               <div className={css(ss.dependenciesContainer, custom.dependenciesContainer)}>
                  Dependencies: {preReqs.map((preReq: BanesAndBoonsInfo, i: number) =>
                   <p key={i}
                    className={css(ss.dependencyText, custom.dependencyText)}
                    style={{ color: addedTraits.find((addedBoon: BanesAndBoonsInfo) => addedBoon.id === preReq.id) ? colors.success : 'red'}}>
                    {preReq.name}{preReq.id !== preReqs[preReqs.length - 1].id && ', '}
                   </p>)}
               </div>}
               {allExclusivesInGroup.length > 0 &&
               <div>
                  <div className={css(ss.dependenciesContainer, custom.dependenciesContainer)}>
                  Exclusive group: {allExclusivesInGroup.map((exclusive: BanesAndBoonsInfo, i: number) =>
                    <p key={i}
                    className={css(ss.dependencyText, custom.dependencyText)}
                    style={{ color: addedTraits.find((addedBoon: BanesAndBoonsInfo) => addedBoon.id === exclusive.id) ? colors.success : 'red'}}>
                      {exclusive.name}{exclusive.id !== allExclusivesInGroup[allExclusivesInGroup.length - 1].id && ', '}
                    </p>
                  )}
                  </div>
                  <p className={css(ss.regularText, custom.regularText)}>Minimum exclusives required: {exclusiveTrait.minRequired}</p>
                  <p className={css(ss.regularText, custom.regularText)}>Maximum exclusives allowed: {exclusiveTrait.maxAllowed}</p>
               </div>
               }
               {trait.ranks && <p className={css(ss.regularText, custom.regularText)}>Shift + Left Click to downgrade</p>}
            </div>
            )}>
          {(addedRankTrait || trait.rank === 0) &&
          <p className={css(ss.rankText, custom.rankText)}>
            {trait.rank === 0 ? 0 : addedRankTrait.rank + 1} / {trait.ranks.length}
          </p>}
          <div className={css(
            ss.shadow,
            shouldBeDisabled && ss.disabledShadow,
            custom.shadow,
            shouldBeDisabled && custom.disabledShadow
          )} />
        </Tooltip>
      </div>
    )
  }
}

export default Trait;
