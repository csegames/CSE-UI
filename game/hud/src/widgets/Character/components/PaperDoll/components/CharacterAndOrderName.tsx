/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-22 16:44:42
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-14 12:15:22
 */

import * as React from 'react';
import { css, StyleDeclaration, StyleSheet } from 'aphrodite';

export interface OrderNameStyles extends StyleDeclaration {
  characterAndOrderName: React.CSSProperties;
}

export const defaultOrderNameStyles: OrderNameStyles = {
  characterAndOrderName: {
    margin: 0,
    padding: 0,
    color: '#6F7581',
    fontSize: '26px',
    fontWeight: 'bold',
  },
};

export interface CharacterNameProps {
  styles?: Partial<OrderNameStyles>;
  characterName: string;
  orderName: string;
}

const CharacterAndOrderName = (props: CharacterNameProps) => {
  const ss = StyleSheet.create({ ...defaultOrderNameStyles, ...props.styles });
  const { characterName, orderName } = props;
  return (
    <p className={css(ss.characterAndOrderName)}>{characterName} {orderName && `<${orderName}>`}</p>
  );
};

export default CharacterAndOrderName;
