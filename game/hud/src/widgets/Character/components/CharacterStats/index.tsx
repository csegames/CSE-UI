/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-18 11:11:09
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-27 00:53:35
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import { graphql, InjectedGraphQLProps } from 'react-apollo';

import queries from '../../../../gqlDocuments';
import { CharacterInfoQuery } from '../../../../gqlInterfaces';

export interface CharacterStatsProps extends InjectedGraphQLProps<CharacterInfoQuery> {
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
    )
  }

  // private humanEquality = (raceName: string) => {
  //   if (raceName.indexOf('Human') !== -1) return 'Human';
  //   return raceName;
  // }
}

const CharacterStatsWithQL = graphql(queries.CharacterInfoQuery as any)(CharacterStats);

export default CharacterStatsWithQL;
