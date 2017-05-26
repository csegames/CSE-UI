/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-06 17:07:40
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-10 14:25:43
 */

import * as React from 'react';
import {events} from 'camelot-unchained';
import {HeroContentItem} from '../../services/session/heroContent';
import Animate from '../../lib/Animate';

export interface HeroProps {
  isFetching: boolean;
  lastUpdated: Date;
  items: HeroContentItem[];
}

export interface HeroState {
  currentItem: number;
  paused: boolean;
}

class Hero extends React.Component<HeroProps, HeroState> {
  public name:string = 'cse-patcher-hero';
  private timeout: any = null;

  constructor(props: HeroProps) {
    super(props);
    this.state = {
      currentItem: 0,
      paused: false,
    };
    this.timeNext(1);
  }

  public render() {
    const currentItem = this.props.items.length > 0 ? this.renderHeroItem(this.props.items[this.state.currentItem]) : null;
    return (
      <div className={`Hero ${this.state.paused ? 'Hero--paused' : ''}`}>
        <Animate animationEnter='fadeIn' animationLeave='fadeOut'
          durationEnter={400} durationLeave={500}
          className={`Hero__item`}>
          {currentItem}
        </Animate>
        <ul className={`Hero__controls ${this.props.items.length < 2 ? 'hidden' : ''}`}>
          {this.props.items.map((item, index) =>
            <li
              key={index}
              className={`${this.state.currentItem === index ? 'active' : ''}`}
              onClick={this.selectIndex.bind(this, index)}>
                {index + 1}
            </li>)}
        </ul>
      </div>
    );
  }

  public componentDidMount() {
    events.on('pause-videos', this.pause);
    events.on('resume-videos', this.resume);
  }

  private renderHeroItem = (item: HeroContentItem) => {
    return <div key={item.id} dangerouslySetInnerHTML={{__html: `${item.content}`}}></div>;
  }

  private selectIndex = (index: number) => {
    clearTimeout(this.timeout);
    this.timeout = null;
    this.setState({
      currentItem: index,
    } as any);
    this.timeNext(index++);
  }

  private timeNext = (index: number) => {
    let next = this.state.currentItem + 1;
    if (next >= this.props.items.length) next = 0;
    this.timeout = setTimeout(() => this.selectIndex(next), 30000);
  }

  private pause = () => {
    if (this.state.paused) return;
    this.setState({paused: true} as any);
  }
  
  private pauseVids = () => {
    const videoElements: NodeListOf<HTMLVideoElement> = document.getElementsByTagName('video');
    for (let vid: any = 0; vid < videoElements.length; vid++) {
      if (!videoElements[vid].paused) videoElements[vid].pause();
    }
  }

  private resume = () => {
    if (!this.state.paused) return;
    this.setState({paused: false} as any);
    const videoElements: NodeListOf<HTMLVideoElement> = document.getElementsByTagName('video');
    for (let vid: any = 0; vid < videoElements.length; vid++) {
      const v = videoElements[vid];
      if (v.paused) v.play();
    }
    this.timeNext(this.state.currentItem + 1);
  }
}

export default Hero;
