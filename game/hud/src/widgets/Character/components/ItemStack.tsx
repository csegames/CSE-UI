/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-07-10 20:25:01
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-12 11:01:00
 */

import * as React from 'react';

import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import ItemIcon from './ItemIcon';

export interface ItemStackStyle extends StyleDeclaration {
  ItemStack: React.CSSProperties;
}

export const defaultItemStackStyle: ItemStackStyle = {
  ItemStack: {
    width: '100%',
    height: '100%',
    position: 'relative',
    cursor: 'pointer',
  },
};

export interface ItemStackProps {
  styles?: Partial<ItemStackStyle>;
  count: number;
  icon: string;
}

export interface ItemStackState {
}

export class ItemStack extends React.Component<ItemStackProps, ItemStackState> {
  constructor(props: ItemStackProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultItemStackStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    
    return (
      <div className={css(ss.ItemStack, custom.ItemStack)}>
        <ItemIcon url={this.props.icon} textBottom={this.props.count.toString()} />
      </div>
    );
  }
}

export default ItemStack;
