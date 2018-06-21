/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * USAGE EXAMPLE
 *
 * <Slider>
 *   {items.map((item: Item, index: number) => {
 *     return (
 *       <div className='InteractiveAlert__message' key={`alert_${index}`}>
 *         {item.render()}
 *       </div>
 *     );
 *   })}
 * </Slider>
 */

import * as React from 'react';
import * as className from 'classnames';
import styled, { css } from 'react-emotion';
import { spring, TransitionMotion } from 'react-motion';

const Container = styled('div')`
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
`;

const Items = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Item = styled('div')`
  width: 100%;
  height: 100%;
`;

const Counter = styled('div')`
  position: absolute;
  color: white;
  font-size: 0.8em;
  right: 10px;
  bottom: 10px;
`;

const Arrow = styled('a')`
  position: absolute;
  top: 50%;
  margin-top: -7.5px;
  height: 15px;
  width: 15px;
  border: 1px solid white;
  border-width: 2px 2px 0 0;
`;

const ArrowRight = css`
  right: 10px;
  transform: rotate(45deg);
`;

const ArrowLeft = css`
  left: 10px;
  transform: rotate(-135deg) translateX(-2px);
`;

const ArrowDisabled = styled('div')`
  border: 1px solid #EEE;
  cursor: default !important;
`;

export interface SliderStyle {
  container: React.CSSProperties;
  items: React.CSSProperties;
  item: React.CSSProperties;
  counter: React.CSSProperties;
  arrow: React.CSSProperties;
  arrowRight: React.CSSProperties;
  arrowLeft: React.CSSProperties;
  arrowDisabled: React.CSSProperties;
}

export interface SliderProps {
  loop?: boolean;
  startIndex?: number;
  showSlideNav?: boolean;
  showArrows?: boolean;
  containerClass?: string;
  children?: any | any[];
  style?: Partial<SliderStyle>;
}

export interface SliderState {
  index: number;
  single: boolean;
}

class Slider extends React.Component<SliderProps, SliderState> {

  private keyGen: number = 0;

  constructor(props: SliderProps) {
    super(props);

    this.state = {
      index: 0,
      single: false,
    };
  }

  public render() {
    if (this.state.single) {
      return (
        <Container>{this.props.children}</Container>
      );
    }

    const items = this.props.children.slice(this.state.index, this.state.index + 1) as any;

    return (
      <Container>
        <TransitionMotion willLeave={this.slideWillLeave}
          willEnter={this.slideWillEnter}
          styles={items.map((item: any) => ({
            key: this.keyGen++,
            data: item,
            style: { opacity: spring(1, { stiffness: 50, damping: 15, precision: 0.01 }) },
          }))}>
          {(interpolatedStyles: any) =>
            <Items>
              {interpolatedStyles.map((slide: any) => {
                return (
                  <Item
                    key={slide.key}
                    style={{ position: 'absolute', top: 0, opacity: slide.style.opacity }}>
                    {slide.data}
                  </Item>
                );
              })}
              <Counter>
                {this.state.index + 1} / {this.props.children.length}
              </Counter>
            </Items>
          }
        </TransitionMotion>
        <Arrow className={className(ArrowRight,
          { [ArrowDisabled]: (this.props.children.length === 1 || !this.props.loop) && this.state.index === 0 })}
          onClick={() => this.prev()}>
        </Arrow>
        <Arrow className={className(ArrowLeft,
          { [ArrowDisabled]: (this.props.children.length === 1 || !this.props.loop) &&
            this.state.index === this.props.children.length - 1 })}
          onClick={() => this.next()}>
        </Arrow>
      </Container>
    );
  }

  public next = () => {
    if (this.state.single) return;

    let index = this.state.index + 1;
    if (index >= this.props.children.length) index = this.props.loop ? 0 : this.props.children.length - 1;
    if (index !== this.state.index) this.setState({ index } as any);
  }

  public prev = () => {
    if (this.state.single) return;

    let index = this.state.index - 1;
    if (index < 0) index = this.props.loop ? this.props.children.length - 1 : 0;
    if (index !== this.state.index) this.setState({ index } as any);
  }

  public componentWillReceiveProps(nextProps: SliderProps) {
    const single = !Array.isArray(this.props.children);
    if (single) {
      this.setState({
        single,
      } as any);
    } else {
      this.setState({
        single,
        index: this.state.index > nextProps.children.length - 1 ? 0 : this.state.index,
      } as any);
    }

  }

  private slideWillEnter = (): any => {
    return { left: 0 };
  }

  private slideWillLeave = (): any => {
    return { left: spring(0, { stiffness: 50, damping: 15, precision: 0.01 }) };
  }
}

export default Slider;
