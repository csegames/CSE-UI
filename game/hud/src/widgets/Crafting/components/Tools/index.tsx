/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-20 18:42:59
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-20 23:48:15
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../../services/session/reducer';

import Label from '../Label';
import Input from '../Input';

export interface ToolsPropsRedux {
  dispatch?: (action: any) => void;
  countdown?: number;
}

const select = (state: GlobalState, props: ToolsProps) : ToolsPropsRedux => {
  return { countdown: state.ui.countdown };
};

export interface ToolsProps extends ToolsPropsRedux {
  harvest: () => void;
  harvestInfo: () => void;
  nearby: (range: number) => void;
}

interface ToolsStatus {
  range: number;
}

class Tools extends React.Component<ToolsProps, ToolsStatus> {
  constructor(props: ToolsProps) {
    super(props);
    this.state = { range: 1000 };
  }
  public render() {
    return (
      <div className='crafting-tools'>
        <div className='tools-section'>
          <h1>Resources</h1>
          <div>
            <button onClick={() => this.props.nearby(this.state.range)}>/cr nearby</button>
            <Input size={4} onChange={this.setRange} value={this.state.range.toString()}
              /> List nearby crafting resources.
          </div>
          <div>
            <button onClick={this.props.harvestInfo}>/harvestinfo</button> List details about nearby resources.</div>
          <div>
            <button onClick={this.props.harvest}>
              /harvest{ this.props.countdown ? ' [' + this.props.countdown + ']' : '' }
            </button>
            Harvest nearby resources.
          </div>
        </div>
        <div className='tools-section'>
          <h1>Split (Coming Soon)</h1>
          <div><button>Split</button> (select item here)</div>
        </div>
      </div>
    );
  }
  private setRange = (value: string) => {
    this.setState({ range: (value as any) | 0 });
  }
}

export default connect(select)(Tools);
