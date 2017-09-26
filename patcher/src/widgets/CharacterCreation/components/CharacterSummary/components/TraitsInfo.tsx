/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import Boon from '../../BanesAndBoons/Boon';
import Bane from '../../BanesAndBoons/Bane';
import { BanesAndBoonsState } from '../../../services/session/banesAndBoons';
import { colors } from '../../../styleConstants';

export interface TraitsSummaryStyle extends StyleDeclaration {
  TraitsSummary: React.CSSProperties;
  boonsContainer: React.CSSProperties;
  banesContainer: React.CSSProperties;
  boonsHeader: React.CSSProperties;
  banesHeader: React.CSSProperties;
  boons: React.CSSProperties;
  banes: React.CSSProperties;
}

export const defaultTraitsSummaryStyle: TraitsSummaryStyle = {
  TraitsSummary: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  boonsContainer: {
    flex: 1,
    paddingRight: '10px',
  },

  banesContainer: {
    direction: 'rtl',
    flex: 1,
    paddingLeft: '10px',
  },

  boonsHeader: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: colors.boonPrimary,
    borderBottom: `1px solid ${colors.boonPrimary}`,
    marginBottom: '5px',
  },

  banesHeader: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: colors.banePrimary,
    borderBottom: `1px solid ${colors.banePrimary}`,
    marginBottom: '5px',
    textAlign: 'right',
  },

  boons: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  banes: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

export interface TraitsSummaryProps {
  styles?: Partial<TraitsSummaryStyle>;
  banesAndBoonsState: BanesAndBoonsState;
}

export interface TraitsSummaryState {
}

export class TraitsSummary extends React.Component<TraitsSummaryProps, TraitsSummaryState> {
  constructor(props: TraitsSummaryProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultTraitsSummaryStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const { addedBoons, addedBanes, traits } = this.props.banesAndBoonsState;

    return (
      <div className={css(ss.TraitsSummary, custom.TraitsSummary)}>
        <div className={css(ss.boonsContainer, custom.boonsContainer)}>
          <header className={css(ss.boonsHeader, custom.boonsHeader)}>BOONS</header>
          <div className={css(ss.boons, custom.boons)}>
            {Object.keys(addedBoons).map((id) => {
              return (
                <Boon
                  key={id}
                  shouldBeDefault
                  trait={traits[id]}
                  {...this.props.banesAndBoonsState}
                />
              );
            })}
          </div>
        </div>
        <div className={css(ss.banesContainer, custom.banesContainer)}>
          <header className={css(ss.banesHeader, custom.banesHeader)}>BANES</header>
          <div className={css(ss.banes, custom.banes)}>
            {Object.keys(addedBanes).map((id) => {
              return (
                <Bane
                  key={id}
                  shouldBeDefault
                  trait={traits[id]}
                  {...this.props.banesAndBoonsState}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default TraitsSummary;

