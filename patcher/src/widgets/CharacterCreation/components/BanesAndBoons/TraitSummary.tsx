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
    marginBottom: 0,
    marginTop: 0
  },

  traitPoints: {
    margin: 0,
    color: 'orange'
  },

  titleContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },

  traitDescription: {
    color: '#CCC'
  },

  traitCategory: {
    color: '#777',
    marginTop: 0,
    marginBottom: '2px'
  },

  traitIcon: {
    width: '80px',
    height: '80px',
    border: '2px solid #ccc'
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
    return (
      <div className={css(ss.addedSummaryContainer, custom.addedSummaryContainer)}>
        <div className={css(ss.titleContainer, custom.titleContainer)}>
          <div>
            <p className={css(ss.traitName, custom.traitName)}
             style={{ color: type === BOON ? colors.boonPrimary : colors.banePrimary }}>
              {trait.name}
            </p>
            <p className={css(ss.traitPoints, custom.traitPoints)}>
              Points: {type === BOON && '+'}{trait.points}
            </p>
            <p className={css(ss.traitCategory, custom.traitCategory)}>{trait.required ? 'Required' : trait.category} {type}</p>
          </div>
          <img className={css(ss.traitIcon, custom.traitIcon)} src={trait.icon} />
        </div>
        <p className={css(ss.traitDescription, custom.traitDescription)}>{trait.description}</p>
        {!trait.required && <div className={css(ss.cancelTrait)} onClick={this.onCancelClick}>
          Remove
        </div>}
      </div>
    )
  }
}

export default TraitSummary;
