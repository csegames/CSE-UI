/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { placeholderIcon } from 'fullscreen/lib/constants';
import { StandardSlot } from 'fullscreen/Inventory/components/DraggableInventoryItem';

const Container = styled.div`
  width: ${(props: any) => `${props.width}px` || '100%'};
  height: ${(props: any) => `${props.height}px` || '100%'};
  position: relative;
  cursor: pointer;
`;

const TextContainer = styled.header`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
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

const Text = styled.div`
  position: relative;
  color: white;
  text-shadow: 0 1px 0 black;
  text-align: right;
  z-index: 1;
  padding-right: 2px;
  cursor: inherit;
  -webkit-user-select: none;
`;

export interface ItemStackProps {
  count: number;
  icon: string;
  width?: number;
  height?: number;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface ItemStackState {
}

export class ItemStack extends React.Component<ItemStackProps, ItemStackState> {
  public render() {
    const slotIcon = this.props.icon || placeholderIcon;
    return (
      <Container
        width={this.props.width}
        height={this.props.height}
        onMouseOver={this.props.onMouseOver}
        onMouseLeave={this.props.onMouseLeave}>
        <StandardSlot src={slotIcon} />
        <TextContainer className={Footer}>
          <Text>{this.props.count}</Text>
        </TextContainer>
      </Container>
    );
  }
}

export default ItemStack;
