/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import ItemIcon from './ItemIcon';

export interface ItemStyle extends StyleDeclaration {
  Item: React.CSSProperties;
}

export const defaultItemStyle: ItemStyle = {
  Item: {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
};

export interface ItemProps {
  styles?: Partial<ItemStyle>;
  useFontIcon?: boolean;
  id: string;
  icon: string;
}

export interface ItemState {
}

export class Item extends React.Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultItemStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <div className={css(ss.Item, custom.Item)}>
        <ItemIcon useFontIcon={this.props.useFontIcon} url={this.props.icon} />
      </div>
    );
  }
}

export default Item;
