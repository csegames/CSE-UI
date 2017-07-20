/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 15:22:45
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-26 18:10:19
 */

import * as React from 'react';
import { css, StyleDeclaration, StyleSheet } from 'aphrodite';

import CharacterMain from './components/CharacterMain';

export interface CharacterContainerStyles extends StyleDeclaration {
  characterContainer: React.CSSProperties;
}

export const defaultCharacterContainerStyles: CharacterContainerStyles = {
  characterContainer: {
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'hidden',
    display: 'flex',
    alignItems: 'stretch',
    '-webkit-userselect': 'none',
    color: 'white',
  },
};

export interface CharacterContainerProps {
  styles?: Partial<CharacterContainerStyles>;
  visibleComponent: string;
}
const CharacterContainer = (props: CharacterContainerProps) => {
  const ss = StyleSheet.create({ ...defaultCharacterContainerStyles, ...props.styles });
  return (
    <div className={css(ss.characterContainer)}>
      <CharacterMain visibleComponent={props.visibleComponent} />
    </div>
  );
};

export default CharacterContainer;
