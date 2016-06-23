/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {icons} from '../resources/Shapes';
import {Svg} from './Svg';

export interface BuffsState {
  buffList: any;
}
export interface BuffsProps {
  type: string;
}

class buffIcons {
  public size: number = 0;
  private svg: any[] = [];
  private state:boolean[] = [];
  constructor(count: number) {
    if (count < 1) {
      console.log("Number of icons must be (1) or greater.");
      return;
    }
    this.size = count-1;
    for (var i = this.size; i >= 0 ; i--) {
      this.setState(i, (i == 2));
      this.svg.push(this.build(i));
    }
  }
  private build(idx: number) {
    const icon = icons[idx];
    const color : string[] = this.getState(idx) ? [ '#19B24B', 'yellow' ] : [ '#202020', '#202020' ];
    return (
      <Svg key={ "icon" + idx }
        id={ "icon" + idx }
        className="icon"
        stroke={color[1]}
        strokeML="10"
        color={color[0]}
        box={icon.box}
        rect={icon.rect}
        polygon={icon.polygon}
        path={icon.path}
        circle={icon.circle}
      />
    );
  }
  public checkIndex(idx: number) {
    if (idx < 0 && idx > this.size) {
      console.log("BuffIcon Index {$idx} not found.");
      return false;
    }
    return true;
  }
  public refresh(idx: number) {
    if (!this.checkIndex(idx)) {
      return;
    }
    this.svg[idx] = this.build(idx);
  }
  public getState(idx: number) {
    if (!this.checkIndex(idx)) {
      return false;
    }
    return this.state[idx];
  }
  public setState(idx:number, active:boolean) {
    if (!this.checkIndex(idx)) {
      return;
    }
    this.state[idx] = active;
  }
  public getList() {
    return this.svg;
  }
}

export class Buffs extends React.Component<BuffsProps, BuffsState> {
  constructor(props: BuffsProps) {
    super(props);
  }
  componentWillMount(props: BuffsProps, state: BuffsState) {
    this.state = {buffList: new buffIcons(4)};
  }
  render() {
    return (
      <div className={ "buffs " + this.props.type }>
        {this.state.buffList.getList()}
      </div>
    );
  }
}

export default Buffs;
