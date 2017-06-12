/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-20 18:42:59
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-12 22:13:51
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../../services/session/reducer';
import { StyleSheet, css, merge, tools, ToolsStyles } from '../../styles';
import { voxGetStatus } from '../../services/game/crafting';

import Label from '../Label';
import Input from '../Input';
import Button from '../Button';
import VoxMessage from '../VoxMessage';

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
      <div className={'tools ' + css(ss.container)}>
        <div className={css(ss.section)}>
          <h1 className={css(ss.sectionHeading)}>Resources</h1>
          <div>
            <Button style={{ container: tools.button }} onClick={() => this.props.nearby(this.state.range)}>
              /cr nearby
            </Button>
            <Input size={4} onChange={this.setRange} value={this.state.range.toString()}
              /> List nearby crafting resources.
          </div>
          <div>
            <Button style={{ container: tools.button }} onClick={this.props.harvestInfo}>
              /harvestinfo
              </Button>
              List details about nearby resources.
          </div>
          <div>
            <Button style={{ container: tools.button }} disabled={this.props.countdown > 0} onClick={this.props.harvest}>
              /harvest{ this.props.countdown ? ' [' + this.props.countdown + ']' : '' }
            </Button>
            Harvest nearby resources.
          </div>
        </div>
        <div className={css(ss.section)}>
          <h1 className={css(ss.sectionHeading)}>Admin Commands</h1>
          <div>/cr vox create</div>
          <div>/cr specific item-id quality% unit-count</div>
          <div>/cr resources unit-count</div>
          <div>/cr vox forcefinish</div>
          <div>/cr specific alloy-id</div>
          <div>/setequiptmentrepairpoints points</div>
          <div>/setequiptmentdurability durability</div>
        </div>
        <VoxMessage/>
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
