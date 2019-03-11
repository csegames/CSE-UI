/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

function degreesToRads(angle: number) {
  return (angle * Math.PI) / 180;
}

const Container = styled.div`
  border-radius: 50%;
  position: absolute;
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const NavArrows = styled.div`
  position: absolute;
  width: 100%;
  height: 185%;
  top: 0;
  right: 0;
  bottom: -5px;
  left: 2px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const NavArrow = styled.div`
  display: inline-block;
  padding: 0 5px;
  width: 37px;
  height: 69px;
  background-color: orange;
  cursor: pointer;
  background: url(../images/crafting/1080/select-wheel-arrow.png) no-repeat;
  pointer-events: all;

  &.top,
  &.left {
    transform: rotate(90deg);
  }
  &.bottom,
  &.right {
    transform: rotate(-90deg);
  }

  &.disabled {
    opacity: 0.3;
    cursor: default;
  }

  &:not(.disabled):hover {
    -webkit-filter: brightness(120%);
    filter: brightness(120%);
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 90px;
    height: 168px;
    background: url(../images/crafting/4k/select-wheel-arrow.png) no-repeat;
  }
`;

export interface Props {
  index: number;
  totalNumberIndexes: number;
  wheelRadius: number;
  extraSpacing?: number;
  disableNavArrows?: boolean;

  onClick?: () => void;
  onMouseOver?: (e: MouseEvent, index: number) => void;
  onMouseLeave?: (index: number) => void;

  disableTopArrow?: boolean;
  disableBotArrow?: boolean;
  disableLeftArrow?: boolean;
  disableRightArrow?: boolean;
  onTopArrowClick?: (index: number) => void;
  onBotArrowClick?: (index: number) => void;
  onLeftArrowClick?: (index: number) => void;
  onRightArrowClick?: (index: number) => void;
}

export interface State {
  showNavArrows: boolean;
}

class SelectorWheelItem extends React.PureComponent<Props, State> {
  public static getAngleForIndex = (index: number, totalNumberItems: number) => {
    const angleDeg = ((360 / totalNumberItems) * index);
    return {
      degrees: angleDeg,
      radians: degreesToRads(angleDeg),
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      showNavArrows: false,
    };
  }

  public render() {
    const { disableTopArrow, disableBotArrow, disableRightArrow, disableLeftArrow } = this.props;
    const itemDimensions = this.getItemDimensions();
    const topNavArrowTransform = `rotate(${this.getAngle().degrees + 90}deg)`;
    const botNavArrowTransform = `rotate(${this.getAngle().degrees}deg)`;
    return (
      <Container
        style={{ top: this.getY(), left: this.getX(), width: itemDimensions, height: itemDimensions }}
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}>
        <Content>
          {this.state.showNavArrows && [
            <NavArrows key='y' style={{ transform: topNavArrowTransform, WebkitTransform: topNavArrowTransform }}>
              <NavArrow className={`top ${disableTopArrow ? 'disabled' : ''}`} onClick={this.onTopClick} />
              <NavArrow className={`bottom ${disableBotArrow ? 'disabled' : ''}`} onClick={this.onBotClick} />
            </NavArrows>,
            <NavArrows key='x' style={{ transform: botNavArrowTransform, WebkitTransform: botNavArrowTransform }}>
              <NavArrow className={`left ${disableLeftArrow ? 'disabled' : ''}`} onClick={this.onLeftClick} />
              <NavArrow className={`right ${disableRightArrow ? 'disabled' : ''}`} onClick={this.onRightClick} />
            </NavArrows>,
          ]}
          {this.props.children}
        </Content>
      </Container>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.totalNumberIndexes !== this.props.totalNumberIndexes) {
      this.setState({ showNavArrows: false });
    }
  }

  private getItemDimensions = () => {
    return this.props.wheelRadius / 2;
  }

  private getAngle = () => {
    const { index, totalNumberIndexes } = this.props;
    return SelectorWheelItem.getAngleForIndex(index, totalNumberIndexes);
  }

  private getX = () => {
    const { extraSpacing, wheelRadius } = this.props;
    const radius = extraSpacing ? wheelRadius + extraSpacing : wheelRadius;
    const alignmentDiff = extraSpacing ? wheelRadius - extraSpacing : wheelRadius - (this.getItemDimensions() / 2);
    const angle = this.getAngle();
    return Number(((Math.cos(angle.radians) * radius) + (alignmentDiff)).toFixed(1));
  }

  private getY = () => {
    const { extraSpacing, wheelRadius } = this.props;
    const radius = extraSpacing ? wheelRadius + extraSpacing : wheelRadius;
    const alignmentDiff = extraSpacing ? wheelRadius - extraSpacing : wheelRadius - (this.getItemDimensions() / 2);
    const angle = this.getAngle();
    return Number(((Math.sin(angle.radians) * radius) + (alignmentDiff)).toFixed(1));
  }

  private onClick = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  private onTopClick = () => {
    if (this.props.onTopArrowClick && !this.props.disableTopArrow) {
      this.props.onTopArrowClick(this.props.index);
    }
  }

  private onLeftClick = () => {
    if (this.props.onLeftArrowClick && !this.props.disableLeftArrow) {
      this.props.onLeftArrowClick(this.props.index);
    }
  }

  private onRightClick = () => {
    if (this.props.onRightArrowClick && !this.props.disableRightArrow) {
      this.props.onRightArrowClick(this.props.index);
    }
  }

  private onBotClick = () => {
    if (this.props.onBotArrowClick && !this.props.disableBotArrow) {
      this.props.onBotArrowClick(this.props.index);
    }
  }

  private onMouseOver = (event: React.MouseEvent) => {
    if (this.props.onMouseOver) {
      this.props.onMouseOver(event as any, this.props.index);
    }

    if (!this.props.disableNavArrows) {
      this.setState({ showNavArrows: true });
    }
  }

  private onMouseLeave = () => {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(this.props.index);
    }

    if (!this.props.disableNavArrows) {
      this.setState({ showNavArrows: false });
    }
  }
}

export default SelectorWheelItem;
