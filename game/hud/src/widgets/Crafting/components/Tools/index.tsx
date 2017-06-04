/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-20 18:42:59
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-02 20:55:13
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../../services/session/reducer';
import { StyleSheet, css, merge, tools, ToolsStyles } from '../../styles';
import { voxGetStatus } from '../../services/game/crafting';

import Label from '../Label';
import Input from '../Input';
import Button from '../Button';

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
  style?: Partial<ToolsStyles>;
}

interface ToolsStatus {
  range: number;
  voxStatus: string;
}

class Tools extends React.Component<ToolsProps, ToolsStatus> {
  constructor(props: ToolsProps) {
    super(props);
    this.state = { range: 1000, voxStatus: undefined };
  }
  public render() {
    const ss = StyleSheet.create(merge({}, tools, this.props.style));
    return (
      <div className={css(ss.container)}>
        <div className={css(ss.section)}>
          <h1 className={css(ss.sectionHeading)}>Resources</h1>
          <div>
            <Button onClick={() => this.props.nearby(this.state.range)}>/cr nearby</Button>
            <Input size={4} onChange={this.setRange} value={this.state.range.toString()}
              /> List nearby crafting resources.
          </div>
          <div>
            <Button onClick={this.props.harvestInfo}>/harvestinfo</Button> List details about nearby resources.</div>
          <div>
            <Button disabled={this.props.countdown > 0} onClick={this.props.harvest}>
              /harvest{ this.props.countdown ? ' [' + this.props.countdown + ']' : '' }
            </Button>
            Harvest nearby resources.
          </div>
        </div>
        <div className={css(ss.section)}>
          <div>
            <Button onClick={this.voxStatusTest}>get vox status</Button>
            (Experiment).
            <div>{this.state.voxStatus}</div>
          </div>
        </div>
      </div>
    );
  }
  private setRange = (value: string) => {
    this.setState({ range: (value as any) | 0 });
  }
  private voxStatusTest = () => {
    voxGetStatus().then((voxStatus: any) => {
      this.setState({ voxStatus: JSON.stringify(voxStatus) });
    }).catch(() => {
      this.setState({ voxStatus: 'error fetching status' });
    });
  }
}

export default connect(select)(Tools);
