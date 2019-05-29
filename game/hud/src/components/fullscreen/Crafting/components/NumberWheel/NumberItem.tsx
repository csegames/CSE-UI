/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE } from 'fullscreen/lib/constants';

function degreesToRads(angle: number) {
  return (angle * Math.PI) / 180;
}

interface ItemProps extends React.HTMLProps<HTMLDivElement> {
  extensionRotation: number;
  rotation: number;
  x: number;
  y: number;
}

// #region Container constants
const CONTAINER_DIMENSIONS = 40;
const CONTAINER_FONT_SIZE = 24;
const CONTAINER_VALUE_LEFT = -60;
const CONTAINER_VALUE_WIDTH = 160;
const CONTAINER_VALUE_HEIGHT = 44;
// #endregion
const Container = styled.div`
  position: absolute;
  width: ${CONTAINER_DIMENSIONS}px;
  height: ${CONTAINER_DIMENSIONS}px;
  font-size: ${CONTAINER_FONT_SIZE}px;
  font-family: Caudex;
  transform: rotate(${(props: ItemProps) => props.rotation}deg);
  top: ${(props: ItemProps) => props.y}px;
  left: ${(props: ItemProps) => props.x}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #B5FFFF;
  text-shadow: 0px 0px 10px transparent;

  &.selected {
    filter: brightness(150%);
    text-shadow: 0px 0px 10px #fff;
    color: #C3C3C3;
  }
  &:hover {
    filter: brightness(150%);
  }
  &.disabled {
    color: #444;
    &:hover {
      filter: brightness(100%);
    }
  }
  &.value:after {
    transform: rotate(${(props: ItemProps) => props.extensionRotation}deg);
    content: '';
    position: absolute;
    left: ${CONTAINER_VALUE_LEFT}px;
    width: ${CONTAINER_VALUE_WIDTH}px;
    height: ${CONTAINER_VALUE_HEIGHT}px;
  }

  @media (max-width: 2560px) {
    width: ${CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${CONTAINER_DIMENSIONS * MID_SCALE}px;
    font-size: ${CONTAINER_FONT_SIZE * MID_SCALE}px;
  }

  &.value:after {
    left: ${CONTAINER_VALUE_LEFT * MID_SCALE}px;
    width: ${CONTAINER_VALUE_WIDTH * MID_SCALE}px;
    height: ${CONTAINER_VALUE_HEIGHT * MID_SCALE}px;
  }
`;

// const Divider = styled.div`
//   display: inline-block;
//   margin-right: 1px;
// `;

const Arrow = styled.div`
  transform: rotate(90deg);
  text-shadow: 0px 0px 10px transparent;
  &.selected {
    -webkit-filter: brightness(150%);
    filter: brightness(150%);
    text-shadow: 0px 0px 10px #fff;
  }
`;

export interface AngleData {
  degrees: number;
  radians: number;
}

export interface Props {
  disabled: boolean;
  value: number | string;
  index: number;
  selectedIndex: number;
  totalNumberItems: number;
  wheelRadius: number;
  onClick: (value: number, angle: AngleData) => void;
  onNextPage: () => void;
  onBackPage: () => void;
  onMouseOver: (value: number, angle: AngleData) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  extraSpacing?: number;
}

class NumberItem extends React.Component<Props> {
  public static getAngleForIndex = (index: number, totalNumberItems: number) => {
    const angleDeg = ((360 / totalNumberItems) * index) - 90;
    return {
      degrees: angleDeg,
      radians: degreesToRads(angleDeg),
    };
  }
  public render() {
    const rotation = this.getAngle().degrees;
    const x = this.getX();
    const y = this.getY();
    const isSelected = this.props.selectedIndex === this.props.index;
    const isValue = typeof this.props.value === 'number';
    const className = `${this.props.disabled ? 'disabled' : ''} ${isSelected ? ' selected' : ''}
      ${isValue ? ' value' : ''}`;
    return (
      <Container
        className={className}
        x={x}
        y={y}
        extensionRotation={rotation}
        rotation={typeof this.props.value !== 'number' ?
          (this.props.value === 'Next' || this.props.value === 'Back' ? rotation : 0) : 0}
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}>
        {typeof this.props.value === 'number' ? this.props.value :
          this.props.value === 'Next' ? <Arrow>{'>'}</Arrow> : <Arrow>{'<'}</Arrow>}
      </Container>
    );
  }

  private onClick = () => {
    if (this.props.disabled) return;
    if (typeof this.props.value === 'number') {
      this.props.onClick(this.props.value, this.getAngle());
    } else {
      if (this.props.value === 'Next') {
        this.props.onNextPage();
      } else {
        this.props.onBackPage();
      }
    }
  }

  private onMouseOver = () => {
    if (this.props.disabled) return;
    if (typeof this.props.value === 'number') {
      this.props.onMouseOver(this.props.value, this.getAngle());
    }
  }

  private onMouseDown = () => {
    if (typeof this.props.value === 'number') {
      this.props.onMouseDown();
    }
  }

  private onMouseUp = () => {
    if (typeof this.props.value === 'number') {
      this.props.onMouseUp();
    }
  }

  private getAngle = () => {
    const { index, totalNumberItems } = this.props;
    return NumberItem.getAngleForIndex(index, totalNumberItems);
  }

  private getX = () => {
    const { extraSpacing, wheelRadius } = this.props;
    const radius = extraSpacing ? wheelRadius + extraSpacing : wheelRadius;
    const alignmentDiff = extraSpacing ? wheelRadius - extraSpacing : wheelRadius - 5;
    const angle = this.getAngle();
    return Number(((Math.cos(angle.radians) * radius) + (alignmentDiff)).toFixed(1));
  }

  private getY = () => {
    const { extraSpacing, wheelRadius } = this.props;
    const radius = extraSpacing ? wheelRadius + extraSpacing : wheelRadius;
    const alignmentDiff = extraSpacing ? wheelRadius - extraSpacing : wheelRadius - 5;
    const angle = this.getAngle();
    return Number(((Math.sin(angle.radians) * radius) + (alignmentDiff)).toFixed(1));
  }
}

export default NumberItem;
