/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { events } from '@csegames/camelot-unchained';

const TextureWrapper = styled('div')`
  position: relative;
  cursor: pointer;
  filter: brightness(100%);
  transition: filter 0.2s ease;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url(images/news/news-texture.png) repeat-y;
  }
  transition: all 0.3s;
  &:hover {
    filter: brightness(120%);
    img {
      transform: scale(1.1);
    }
    .read-more {
      bottom: 0px;
    }
    .children-container {
      margin-top: -30px;
    }
  }
`;

const Container = styled('div')`
  position: relative;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 30px;
  height: 150px;
  border-left-width: 4px;
  border-top-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  border-style: solid;
  border-image: linear-gradient(to right, ${(props: { color: string }) => props.color}, transparent) 10% 1%;
  background-size: cover;
  cursor: pointer;
`;

const Image = styled('img')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: transform 0.2s;
`;

const Overlay = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to right, rgb(16, 16, 16), rgba(16, 16, 16, 0));
  box-shadow: rgba(16, 16, 16, 0.5) 50px 505px 100px 15px inset;
  z-index: -1;
`;

const ChildrenContainer = styled('div')`
  position: relative;
  margin-top: 0px;
  transition: margin-top 0.2s;
`;

const ReadMore = styled('div')`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  bottom: -31px;
  height: 30px;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  transition: bottom 0.2s;
  color: ${(props: { color: string }) => props.color};
`;

const Arrow = styled('span')`
  margin-left: 5px;
  margin-bottom: -4px;
`;

export interface ItemProps {
  indicatorColor: string;
  imgSrc: string;
  onClick: () => void;
  containerClass?: string;
}

class Item extends React.Component<ItemProps> {
  public render() {
    return (
      <TextureWrapper onClick={this.onClick} onMouseEnter={this.onMouseEnter}>
        <Container color={this.props.indicatorColor}>
          <Image src={this.props.imgSrc} />
          <Overlay />
          <ChildrenContainer className='children-container'>
            {this.props.children}
          </ChildrenContainer>
          <ReadMore className='read-more' color={this.props.indicatorColor}>
            Read More
            <Arrow className='fa fa-angle-right'></Arrow>
          </ReadMore>
        </Container>
      </TextureWrapper>
    );
  }

  private onClick = () => {
    events.fire('play-sound', 'select');
    this.props.onClick();
  }

  private onMouseEnter = () => {
    events.fire('play-sound', 'select-change');
  }
}

export default Item;
