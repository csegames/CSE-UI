/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ql, utils, webAPI, Race } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import { characterAvatarIcon, colors } from '../../../lib/constants';

export interface GeneralInfoStyles extends StyleDeclaration {
  GeneralInfo: React.CSSProperties;
  avatarIconContainer: React.CSSProperties;
  generalInfoHeader: React.CSSProperties;
  characterName: React.CSSProperties;
  characterNameText: React.CSSProperties;
  otherInfoContainer: React.CSSProperties;
  otherInfoText: React.CSSProperties;
}

const defaultGeneralInfoStyle: GeneralInfoStyles = {
  GeneralInfo: {
    flex: 1,
    height: '100%',
    backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 5),
    border: `2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    opacity: 0.8,
  },

  generalInfoHeader: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },

  avatarIconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: `2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)',
    width: '150px',
  },

  characterName: {
    flex: 1,
    textAlign: 'center',
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)',
  },

  characterNameText: {
    fontSize: '30px',
    margin: 0,
    padding: 0,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
  },

  otherInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    flex: 2,
    borderLeft: `2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)',
  },

  otherInfoText: {
    fontSize: '20px',
    margin: 0,
    padding: 0,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
  },
};

export interface GeneralInfoProps {
  styles?: Partial<GeneralInfoStyles>;
}

export interface GeneralInfoState {

}

class GeneralInfo extends React.Component<GeneralInfoProps, GeneralInfoState> {
  constructor(props: GeneralInfoProps) {
    super(props);
    this.state = {

    };
  }

  public render() {
    const ss = StyleSheet.create(defaultGeneralInfoStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <GraphQL query={{ namedQuery: 'myStaticCharacter' }}>
        {(graphql: GraphQLResult<{ myCharacter: ql.schema.CUCharacter }>) => {
          if (graphql.loading || !graphql.data) return null;
          const myCharacter: ql.schema.CUCharacter =
            typeof graphql.data === 'string' ? JSON.parse(graphql.data).myCharacter : graphql.data.myCharacter;

          return (
            <div className={css(ss.GeneralInfo, custom.GeneralInfo)}>
              <div className={css(ss.generalInfoHeader, custom.generalInfoHeader)}>
                <div className={css(ss.avatarIconContainer, custom.avatarIconContainer)}>
                  <img src={characterAvatarIcon[`${myCharacter.gender}${myCharacter.race}`]} />
                </div>
                <div className={css(ss.characterName, custom.characterName)}>
                  <p className={css(ss.characterNameText, custom.characterNameText)}>{myCharacter.name}</p>
                  <p className={css(ss.otherInfoText, custom.otherInfoText)}>{myCharacter.faction}</p>
                  <p className={css(ss.otherInfoText, custom.otherInfoText)}>
                    {myCharacter.gender} {webAPI.raceString(Race[myCharacter.race])}
                  </p>
                </div>
                <div className={css(ss.otherInfoContainer, custom.otherInfoContainer)}>
                  {/* We can add banners/faction emblem/general stats(agility, strength, etc) here*/}
                  <p className={css(ss.otherInfoText, custom.otherInfoText)}>
                    The content of this box is TBD
                  </p>
                </div>
              </div>
            </div>
          );
        }}
      </GraphQL>
    );
  }
}

export default GeneralInfo;
