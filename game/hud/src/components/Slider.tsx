/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-01 18:43:11
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-17 17:49:28
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
import { StyleSheet, css } from 'aphrodite';
import { spring, presets, TransitionMotion } from 'react-motion';
import { merge } from 'lodash';
import * as className from 'classnames';

const defaultStyles: SliderStyle = {
  container: {
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
    width: '100%',
  },

  items: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  item: {
    width: '100%',
    height: '100%',
  },

  counter: {
    color: 'white',
    fontSize: '0.8em',
    position: 'absolute',
    right: '10px',
    bottom: '10px',
  },

  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: '-7.5px',
    height: '15px',
    width: '15px',
    border: '1px solid white',
    borderWidth: '2px 2px 0 0',
  },

  arrowRight: {
    right: '10px',
    transform: 'rotate(45deg)',
  },

  arrowLeft: {
    left: '10px',
    transform: 'rotate(-135deg) translateX(-2px)',
  },

  arrowDisabled: {
    border: '1px solid #eee',
    cursor: 'default !important',
  },
}

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

  constructor(props: SliderProps) {
    super(props);

    this.state = {
      index: 0,
      single: false
    }
  }

  public next = () => {
    if (this.state.single) return;

    let index = this.state.index + 1;
    if (index >= this.props.children.length) index = this.props.loop ? 0 : this.props.children.length - 1;
    if (index != this.state.index) this.setState({ index: index } as any);
  }

  public prev = () => {
    if (this.state.single) return;

    let index = this.state.index - 1;
    if (index < 0) index = this.props.loop ? this.props.children.length - 1 : 0;
    if (index != this.state.index) this.setState({ index: index } as any);
  }

  public selectSlide = (index: number) => {
    if (this.state.single) return;
    let setIndex = index;
    if (index < 0) {
      setIndex = 0;
    } else if (index >= this.props.children.length) {
      setIndex = this.props.children.length - 1;
    }
  }

  componentWillReceiveProps(nextProps: SliderProps) {
    const single = !Array.isArray(this.props.children);
    if (single) {
      this.setState({
        single: single
      } as any);
    } else {
      this.setState({
        single: single,
        index: this.state.index > nextProps.children.length - 1 ? 0 : this.state.index,
      } as any);
    }

  }

  slideWillEnter = (): any => {
    return { left: 0 };
  }

  slideWillLeave = (): any => {
    return { left: spring(0, { stiffness: 50, damping: 15, precision: 0.01 }) };
  }

  private keyGen: number = 0;
  render() {

    const ss = StyleSheet.create(merge(defaultStyles, this.props.style));

    if (this.state.single) {
      return (
        <div className={css(ss.container)}>
          {this.props.children}
        </div>
      );
    }

    var items = this.props.children.slice(this.state.index, this.state.index + 1) as any;

    return (
      <div className={css(ss.container)}>
        <TransitionMotion willLeave={this.slideWillLeave}
          willEnter={this.slideWillEnter}
          styles={items.map((item: any) => ({
            key: this.keyGen++,
            data: item,
            style: { opacity: spring(1, { stiffness: 50, damping: 15, precision: 0.01 }) }
          }))}>
          {(interpolatedStyles: any) =>
            <div className={css(ss.items)}>
              {interpolatedStyles.map((slide: any) => {
                return (
                  <div key={slide.key} className={css(ss.item)} style={{ position: 'absolute', top: 0, opacity: slide.style.opacity }}>
                    {slide.data}
                  </div>
                )
              })}
              <div className={css(ss.counter)}>
                {this.state.index + 1} / {this.props.children.length}
              </div>
            </div>
          }
        </TransitionMotion>
        <a className={className(css(ss.arrow), css(ss.arrowLeft), { [css(ss.arrowDisabled)]: (this.props.children.length == 1 || !this.props.loop) && this.state.index == 0 })}
          onClick={() => this.prev()}>
        </a>
        <a className={className(css(ss.arrow), css(ss.arrowLeft), { [css(ss.arrowDisabled)]: (this.props.children.length == 1 || !this.props.loop) && this.state.index === this.props.children.length - 1 })}
          onClick={() => this.next()}>
        </a>
      </div>
    )
  }
}

export default Slider;
