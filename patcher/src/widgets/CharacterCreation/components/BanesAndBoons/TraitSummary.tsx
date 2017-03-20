/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-03 16:12:19
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-03 16:13:11
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from "aphrodite";
import { BanesAndBoonsInfo } from "../../services/session/banesAndBoons";
import { events } from 'camelot-unchained';
import { styleConstants, colors } from '../../styleConstants';

const BANE = 'Bane';
const BOON = 'Boon';

export interface TraitSummaryStyle extends StyleDeclaration {
  addedSummaryContainer: React.CSSProperties;
  traitName: React.CSSProperties;
  traitPoints: React.CSSProperties;
  titleContainer: React.CSSProperties;
  traitDescription: React.CSSProperties;
  traitCategory: React.CSSProperties;
  traitIcon: React.CSSProperties;
  cancelTrait: React.CSSProperties;
  additionalInfoContainer: React.CSSProperties;
  divider: React.CSSProperties;
  removeButton: React.CSSProperties;
}

export interface TraitSummaryProps {
  trait: BanesAndBoonsInfo;
  onCancelClick: Function;
  type: 'Bane' | 'Boon';
  onCancelRankTrait: Function;
  styles: Partial<TraitSummaryStyle>;
}

export const defaultTraitSummaryStyles: TraitSummaryStyle = {
  addedSummaryContainer: {
    position: 'relative',
    padding: '10px',
    marginTop: '15px',
    marginBottom: '15px',
    backgroundColor: 'rgba(49,49,49,0.7)',
    ...styleConstants.marginRight
  },

  traitName: {
    fontSize: '1.1em',
    lineHeight: '1.1em',
    marginBottom: '5px',
    marginTop: 0
  },

  traitPoints: {
    margin: 0,
    color: 'orange',
    marginLeft: '5px'
  },

  titleContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },

  traitDescription: {
    color: '#CCC',
    marginBottom: 0
  },

  traitCategory: {
    marginTop: 0,
    marginBottom: 0,
    marginRight: '5px'
  },

  traitIcon: {
    width: '60px',
    height: '60px',
  },

  cancelTrait: {
    cursor: 'pointer',
    border: '1px solid #595959',
    padding: '2px 5px',
    textAlign: 'center',
    backgroundColor: 'rgba(49,49,49,0.7)',
    transition: 'background-color 0.5s',
    ':hover': {
      backgroundColor: '#a0241b'
    },
    ':active': {
      boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)'
    }
  },

  additionalInfoContainer: {
    display: 'flex',
    alignItems: 'center'
  },

  divider: {
    fontSize: '1em',
    margin: 0,
    color: '#8f8f8f'
  },

  removeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    width: '20px',
    height: '20px',
    borderRadius: '10px',
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: colors.banePrimary
    }
  }
};

class TraitSummary extends React.Component<TraitSummaryProps, {}> {
  private onCancelClick = () => {
    const { trait, onCancelClick, onCancelRankTrait } = this.props;
    events.fire('play-sound', 'select');
    if (trait.ranks) {
      if (trait.rank === 0) onCancelClick(trait);
      onCancelRankTrait(trait);
    } else {
      onCancelClick(trait);
    }
  };
  render() {
    const { trait, type, styles } = this.props;
    const ss = StyleSheet.create(defaultTraitSummaryStyles);
    const custom = StyleSheet.create(styles || {});

    const traitColor = trait.category === 'Class' ? colors.classTrait : trait.category === 'Race' ?
     colors.raceTrait : trait.category === 'Faction' ? colors.factionTrait : '#636262';

    return (
      <div className={css(ss.addedSummaryContainer, custom.addedSummaryContainer)}>
        {!trait.required && <div className={css(ss.removeButton, custom.removeButton)} onClick={this.onCancelClick}>
          X
        </div>}
        <div className={css(ss.titleContainer, custom.titleContainer)}>
          <div>
            <p className={css(ss.traitName, custom.traitName)}
             style={{ color: type === BOON ? colors.boonPrimary : colors.banePrimary }}>
              {trait.name}
            </p>
            <div className={css(ss.additionalInfoContainer)}>
              <p className={css(ss.traitCategory, custom.traitCategory)} style={{ color: traitColor }}>
                {trait.required ? 'Required' : trait.category ? trait.category : 'General'} {type}
              </p>
              <p className={css(ss.divider, custom.divider)}>|</p>
              <p className={css(ss.traitPoints, custom.traitPoints)}>
                Value: {type === BANE ? trait.points * -1 : trait.points}
              </p>
            </div>
          </div>
          <img className={css(ss.traitIcon, custom.traitIcon)} src={trait.icon} />
        </div>
        <p className={css(ss.traitDescription, custom.traitDescription)}>{trait.description}</p>
      </div>
    )
  }
}

export default TraitSummary;
