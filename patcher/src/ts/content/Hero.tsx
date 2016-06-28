/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import HeroItem from './HeroItem';
import {HeroContentItem} from '../redux/modules/heroContent';
import Animate from '../../../../shared/components/Animate';

export interface HeroProps {
  isFetching: boolean;
  didInvalidate: boolean;
  lastUpdated: Date;
  items: Array<HeroContentItem>;
};

export interface HeroState {
  currentItem: number;
}

class Hero extends React.Component<HeroProps, HeroState> {
  public name:string = 'cse-patcher-hero';
  private timeout: any = null;
    
  constructor(props: HeroProps) {
    super(props);
    this.state = {currentItem: 0};
    this.timeNext(1);
  }
  
  renderHeroItem = (item: HeroContentItem) => {
    return (
      <div className='cse-patcher-hero-item' key={item.id}>
        <HeroItem content={item.content}/>
      </div>
    )
  }
  
  selectIndex = (index: number) => {
    clearTimeout(this.timeout);
    this.timeout = null;
    this.setState({
      currentItem: index
    });
    this.timeNext(index++);
  }
  
  timeNext = (index: number) => {
    let next = this.state.currentItem+1;
    if (next >= this.props.items.length) next = 0;
    this.timeout = setTimeout(() => this.selectIndex(next), 30000);
  }
  
  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  render() {
    var currentItem = this.props.items.length > 0 ? this.renderHeroItem(this.props.items[this.state.currentItem]) : null;
    return (
      <div id={this.name} className='main-content'>
        <Animate animationEnter='fadeIn' animationLeave='fadeOut'
          durationEnter={400} durationLeave={500}>
          {currentItem}
        </Animate>
        // render controls
        <ul className={`hero-controls ${this.props.items.length < 2 ? 'hidden' : ''}`}>
          {this.props.items.map((item, index) => <li key={index} className={`${this.state.currentItem == index ? 'active' : ''}`} onClick={this.selectIndex.bind(this, index)}>{index+1}</li>)}
        </ul>
      </div>
    );
  }
};

export default Hero;
