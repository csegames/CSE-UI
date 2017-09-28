/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { merge } from 'lodash';
export interface ItemIconStyle extends StyleDeclaration {
  ItemIcon: React.CSSProperties;
  textContainer: React.CSSProperties;
  header: React.CSSProperties;
  footer: React.CSSProperties;
  text: React.CSSProperties;
}
export const defaultItemIconStyle: ItemIconStyle = {
  ItemIcon: {
    background: 'url()',
    verticalAlign: 'baseline',
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'inherit',
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
export interface ItemIconProps {
  styles?: Partial<ItemIconStyle>;
  textTop?: string;
  textBottom?: string;
  useFontIcon?: boolean;
  url: string;
}
const placeholderIcon = 'images/unknown-item.jpg';
export const ItemIcon = (props: ItemIconProps) => {
  const ss = StyleSheet.create(defaultItemIconStyle);
  const custom = StyleSheet.create(merge({
    ItemIcon: { background: !props.useFontIcon ? `url(${props.url || placeholderIcon})` : '' }},
    props.styles || {},
  ));
  return (
    <div className={`${css(ss.ItemIcon, custom.ItemIcon)} ${props.useFontIcon ? props.url : ''}`}>
      {props.textTop ?
        <header className={css(ss.textContainer, custom.textContainer, ss.header, custom.header)}>
          <div className={css(ss.text, custom.text)}>{props.textTop}</div>
        </header> : null}
      {props.textBottom ?
        <header className={css(ss.textContainer, custom.textContainer, ss.footer, custom.footer)}>
          <div className={css(ss.text, custom.text)}>{props.textBottom}</div>
        </header> : null}
    </div>
  );
};

export default ItemIcon;
