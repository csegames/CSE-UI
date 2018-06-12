/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import { placeholderIcon } from '../../lib/constants';
import { StandardSlot } from '../Inventory/components/DraggableItemComponent';

export interface ItemStackStyle extends StyleDeclaration {
  ItemStack: React.CSSProperties;
  textContainer: React.CSSProperties;
  header: React.CSSProperties;
  footer: React.CSSProperties;
  text: React.CSSProperties;
}

export const defaultItemStackStyle: ItemStackStyle = {
  ItemStack: {
    width: '100%',
    height: '100%',
    position: 'relative',
    cursor: 'pointer',
  },

  textContainer: {
    position: 'absolute',
    left: '0',
    width: '100%',
    background: 'inherit',
    overflow: 'hidden',
    cursor: 'inherit',
    ':before': {
      content: '""',
      position: 'absolute',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'inherit',
      backgroundAttachment: 'local',
      webkitFilter: 'blur(4px)',
      filter: 'blur(4px)',
      cursor: 'inherit',
    },
    ':after': {
      content: '""',
      position: 'absolute',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.1)',
      cursor: 'inherit',
    },
  },

  header: {
    top: 0,
    ':before': {
      top: 0,
    },
    ':after': {
      top: 0,
    },
  },

  footer: {
    bottom: 0,
    backgroundPosition: '0% 100%',
    ':before': {
      top: 0,
    },
    ':after': {
      top: 0,
    },
  },

  text: {
    position: 'relative',
    color: 'white',
    textShadow: '0 1px 0 black',
    textAlign: 'right',
    zIndex: 1,
    paddingRight: '2px',
    cursor: 'inherit',
    '-webkit-user-select': 'none',
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

    const slotIcon = this.props.icon || placeholderIcon;
    return (
      <div className={css(ss.ItemStack, custom.ItemStack)}>
        <StandardSlot src={slotIcon} />
        <header className={css(ss.textContainer, custom.textContainer, ss.footer, custom.footer)}>
          <div className={css(ss.text, custom.text)}>{this.props.count}</div>
        </header>
      </div>
    );
  }
}

export default ItemStack;
