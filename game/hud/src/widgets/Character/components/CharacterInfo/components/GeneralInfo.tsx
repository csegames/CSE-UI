/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-17 10:12:21
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-17 15:16:39
 */

import * as React from 'react';
import {utils} from 'camelot-unchained';
import {css, StyleSheet, StyleDeclaration} from 'aphrodite';

import {characterAvatarIcon, colors} from '../../../lib/constants';
import {MyCharacterFragment, MyOrderFragment} from '../../../../../gqlInterfaces';

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
  myCharacter: MyCharacterFragment;
  myOrder: MyOrderFragment;
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
    const {myCharacter} = this.props;

    return (
      <div className={css(ss.GeneralInfo, custom.GeneralInfo)}>
        <div className={css(ss.generalInfoHeader, custom.generalInfoHeader)}>
          <div className={css(ss.avatarIconContainer, custom.avatarIconContainer)}>
            <img src={characterAvatarIcon[`${myCharacter.gender}${myCharacter.race}`]} />
          </div>
          <div className={css(ss.characterName, custom.characterName)}>
            <p className={css(ss.characterNameText, custom.characterNameText)}>{myCharacter.name}</p>
            <p className={css(ss.otherInfoText, custom.otherInfoText)}>{myCharacter.faction}</p>
            <p className={css(ss.otherInfoText, custom.otherInfoText)}>{myCharacter.gender} {myCharacter.race}</p>
          </div>
          <div className={css(ss.otherInfoContainer, custom.otherInfoContainer)}>
            {/* We can add banners/faction emblem/general stats(agility, strength, etc) here*/}
            <p className={css(ss.otherInfoText, custom.otherInfoText)}>
              Content to be determined... The majority of this screen is test data
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default GeneralInfo;
