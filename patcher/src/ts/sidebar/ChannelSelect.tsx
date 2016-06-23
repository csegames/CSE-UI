/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {components} from 'camelot-unchained';
let QuickSelect = components.QuickSelect;
import {Channel} from '../api/patcherAPI';

export interface ActiveChannelViewProps {
  item: Channel;
};
export interface ActiveChannelViewState {};
class ActiveChannelView extends React.Component<ActiveChannelViewProps, ActiveChannelViewState> {
  render() {
    return (
      <div className='channel-select quickselect-active'>
        <h5 className='label'>CHANNEL</h5> 
        <h5 className='channel'>{this.props.item.channelName}</h5>
      </div>
    );
  }
}

export interface ChannelListViewProps {
  item: Channel;
};
export interface ChannelListViewState {};
class ChannelListView extends React.Component<ChannelListViewProps, ChannelListViewState> {
  render() {
    return (
      <div className='channel-select quickselect-list'>
        <h6>{this.props.item.channelName}</h6>
      </div>
    );
  }
}

export interface ChannelSelectProps {
  channels: Array<Channel>;
  selectedChannelIndex?: number;
  onSelectedChannelChanged: (channel: Channel) => void;  
};

export interface ChannelSelectState {};

class ChannelSelect extends React.Component<ChannelSelectProps, ChannelSelectState> {
  public name: string = 'cse-patcher-channel-select';
  
  constructor(props: ChannelSelectProps) {
    super(props);
  }
  
  onSelectedChannelChanged = (channel: any) => {
    this.props.onSelectedChannelChanged(channel);
  }
  
  generateActiveView = (item: any) => {
    return <ActiveChannelView item={item} />;
  }
  
  generateListView = (item: any) => {
    return <ChannelListView item={item} />;
  }

  render() {
    return (
      <div id={this.name} className='card-panel no-padding'>
        <QuickSelect items={this.props.channels}
          selectedItemIndex={this.props.selectedChannelIndex}
          activeViewComponentGenerator={this.generateActiveView}
          listViewComponentGenerator={this.generateListView}
          onSelectedItemChanged={this.onSelectedChannelChanged} />
      </div>
    );
  }
}

export default ChannelSelect;
