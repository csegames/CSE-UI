/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {spring, presets, TransitionMotion} from 'react-motion';

export interface SliderProps {
  loop?: boolean;
  startIndex?: number;
  showSlideNav?: boolean;
  showArrows?: boolean;
  containerClass?: string;
  children?: any | any[];
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
    if (index != this.state.index) this.setState({index: index} as any);
  }

  public prev = () => {
    if (this.state.single) return;

    let index = this.state.index - 1;
    if (index < 0) index = this.props.loop ? this.props.children.length - 1 : 0;
    if (index != this.state.index) this.setState({index: index} as any);
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
        index: this.state.index > nextProps.children.length-1 ? 0 : this.state.index,
      } as any);
    }
    
  }

  // Animations
  slideWillEnter = (): any => {
    return {left: 0};
  }

  slideWillLeave = (): any => {
    return {left: spring(0, {stiffness: 50, damping: 15, precision: 0.01})};
  }

  private keyGen: number = 0;
  render() {
    if (this.state.single) return <div className={`Slider ${this.props.containerClass ? this.props.containerClass : ''}`}>{this.props.children}</div>;

    var items = this.props.children.slice(this.state.index, this.state.index+1) as any;

    return (
      <div className={`Slider ${this.props.containerClass ? this.props.containerClass : ''}`}>
        <TransitionMotion willLeave={this.slideWillLeave}
                            willEnter={this.slideWillEnter}
                            styles={items.map((item: any) => ({
                              key: this.keyGen++,
                              data: item,
                              style: {left: spring(1, {stiffness: 50, damping: 15, precision: 0.01})}
                            }))}>
            {(interpolatedStyles: any) => 
              <div className='Slider__items'>
                {interpolatedStyles.map((config: any) => {
                  return (
                    <div key={config.key} className='Slider__item' style={{position: 'absolute', top: 0, opacity: config.style.left}}>
                      {config.data}
                    </div>
                  )
                })}
                <div className='Slider__counter'>
                  {this.state.index  + 1} / {this.props.children.length}
                </div>
              </div>
            }
          </TransitionMotion>
          <a className={`Slider__arrow Slider__arrow--left ${(this.props.children.length == 1 || !this.props.loop) && this.state.index == 0 ? 'Slider__arrow--disabled' : ''}`}
             onClick={() => this.prev()}>
          </a>
          <a className={`Slider__arrow Slider__arrow--right ${(this.props.children.length == 1 || !this.props.loop) && this.state.index === this.props.children.length - 1 ? 'Slider__arrow--disabled' : ''}`}
             onClick={() => this.next()}>
          </a>
      </div>
    )
  }
}

export default Slider;
