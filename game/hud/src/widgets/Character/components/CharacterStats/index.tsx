/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-18 11:11:09
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-09 12:39:22
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

export interface CharacterStatsProps {
  styles?: Partial<CharacterStatsStyle>;
}

export interface CharacterStatsStyle extends StyleDeclaration {
  characterStats: React.CSSProperties;
  comingSoonText: React.CSSProperties;
  loadingContainer: React.CSSProperties;
  infoContainer: React.CSSProperties;
  generalInfoContainer: React.CSSProperties;
  generalText: React.CSSProperties;
  inlineText: React.CSSProperties;
}

export const defaultCharacterStatsStyle: CharacterStatsStyle = {
  characterStats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '5px',
  },
  comingSoonText: {
    color: 'white',
    fontSize: '30px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '5px',
  },
  infoContainer: {
    width: '100%',
  },
  generalInfoContainer: {
    height: '50%',
    width: '55%',
    border: '1px solid #222',
    padding: '5px',
    marginBottom: '10px',
  },
  generalText: {
    fontSize: '16px',
    color: 'white',
    margin: 0,
    padding: 0,
  },
  inlineText: {
    display: 'inline',
    fontSize: '16px',
    color: 'white',
    margin: 0,
    padding: 0,
  },
};

class CharacterStats extends React.Component<CharacterStatsProps, {}> {
  public render() {
    const ss = StyleSheet.create({ ...defaultCharacterStatsStyle, ...this.props.styles });
    
    return (
      <div className={css(ss.characterStats)}>
        <p className={css(ss.comingSoonText)}>Coming soon!</p>
      </div>
    );
  }
}

export default CharacterStats;
