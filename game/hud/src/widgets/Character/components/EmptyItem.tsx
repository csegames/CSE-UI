/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-07-10 20:25:01
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-26 17:01:48
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import ItemIcon from './ItemIcon';

export interface EmptyItemStyle extends StyleDeclaration {
  EmptyItem: React.CSSProperties;
}

export const defaultEmptyItemStyle: EmptyItemStyle = {
  EmptyItem: {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
};

export const EmptyItem = (props: {styles?: Partial<EmptyItemStyle>}) => {
  const ss = StyleSheet.create(defaultEmptyItemStyle);
  const custom = StyleSheet.create(props.styles || {});
  return (
    <div className={css(ss.EmptyItem, custom.EmptyItem)} >
      {/* REQUIRED EMPTY SPACE HERE -- OTHERWISE FORMATTING GETS FUCKED*/}
      <ItemIcon url={' '} />
    </div>
  );
};

export default EmptyItem;
