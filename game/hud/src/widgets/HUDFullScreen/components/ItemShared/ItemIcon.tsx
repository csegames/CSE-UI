/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { placeholderIcon } from '../../lib/constants';

export interface ItemIconStyle {
  ItemIcon: React.CSSProperties;
  textContainer: React.CSSProperties;
  header: React.CSSProperties;
  footer: React.CSSProperties;
  text: React.CSSProperties;
}

const Container = styled('div')`
  background-image: url();
  vertical-align: baseline;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: inherit;
`;

const TextContainer = styled('header')`
  position: absolute;
  left: 0;
  width: 100%;
  background: inherit;
  overflow: hidden;
  cursor: inherit;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    background-attachment: local;
    -webkit-filter: blur(4px);
    filter: blur(4px);
    cursor: inherit;
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    cursor: inherit;
  }
`;

const Header = css`
  top: 0;
  &:before {
    top: 0;
  }
  &:after {
    top: 0;
  }
`;

const Footer = css`
  bottom: 0;
  background-position: 0% 100%;
  &:before {
    top: 0;
  }
  &:after {
    top: 0;
  }
`;

const Text = styled('div')`
  position: relative;
  color: white;
  text-shadow: 0 1px 0 black;
  text-align: right;
  z-index: 1;
  padding-right: 2px;
  cursor: inherit;
  -webkit-user-select: none;
`;

export interface ItemIconProps {
  textTop?: string;
  textBottom?: string;
  useFontIcon?: boolean;
  url: string;
}

export const ItemIcon = (props: ItemIconProps) => {
  return (
    <Container style={{ backgroundImage: !props.useFontIcon ? `url(${props.url || placeholderIcon})` : '' }}>
      {props.textTop ?
        <TextContainer className={Header}>
          <Text>{props.textTop}</Text>
        </TextContainer> : null}
      {props.textBottom ?
        <TextContainer className={Footer}>
          <Text>{props.textBottom}</Text>
        </TextContainer> : null}
    </Container>
  );
};

export default ItemIcon;
