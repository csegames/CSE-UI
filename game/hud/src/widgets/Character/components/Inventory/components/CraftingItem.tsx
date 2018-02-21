/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import ItemIcon from '../../ItemIcon';

export interface CraftingItemStyle extends StyleDeclaration {
  CraftingItem: React.CSSProperties;
}

export const defaultCraftingItemStyle: CraftingItemStyle = {
  CraftingItem: {
    width: '60px',
    height: '60px',
    position: 'relative',
    cursor: 'pointer',
  },
};

export interface CraftingItemProps {
  styles?: Partial<CraftingItemStyle>;
  icon: string;
  count: number;
  quality: number;
}

export const CraftingItem = (props: CraftingItemProps) => {
  const ss = StyleSheet.create(defaultCraftingItemStyle);
  const custom = StyleSheet.create(props.styles || {});
  return (
    <div className={css(ss.CraftingItem, custom.CraftingItem)}>
      <ItemIcon
        url={props.icon}
        textBottom={props.count.toString()}
        textTop={typeof props.quality === 'number' ? `${props.quality.toString()}%` : ''}
      />
    </div>
  );
};

export default CraftingItem;
