/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { placeholderIcon, MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  width: 100%;
  height: 100%;
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
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const Header = css`
  top: 0;
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

// #region Text constants
const TEXT_FONT_SIZE = 24;
const TEXT_PADDING = 6;
// #endregion
const Text = styled.div`
  position: relative;
  color: white;
  text-shadow: 0 1px 0 black;
  text-align: right;
  z-index: 1;
  padding-right: ${TEXT_PADDING}px;
  font-size: ${TEXT_FONT_SIZE}px;
  cursor: inherit;
  -webkit-user-select: none;

  @media (max-width: 2560px) {
    padding-right: ${TEXT_PADDING * MID_SCALE}px;
    font-size: ${TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding-right: ${TEXT_PADDING * HD_SCALE}px;
    font-size: ${TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface ItemImageProps {
  count: number;
  quality: number;
  icon: string;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface ItemImageState {
}

export class ItemImage extends React.Component<ItemImageProps, ItemImageState> {
  public render() {
    const slotIcon = this.props.icon || placeholderIcon;
    return (
      <Container onMouseOver={this.props.onMouseOver} onMouseLeave={this.props.onMouseLeave}>
        {this.props.quality !== -1 &&
          <TextContainer className={Header}>
            <Text>{this.props.quality}%</Text>
          </TextContainer>
        }
        <Image src={slotIcon} />
        {this.props.count !== -1 &&
          <TextContainer className={Footer}>
            <Text>{this.props.count}</Text>
          </TextContainer>
        }
      </Container>
    );
  }
}

export default ItemImage;
