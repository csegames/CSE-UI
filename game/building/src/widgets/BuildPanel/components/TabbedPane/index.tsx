/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';

export interface TabbedPaneProps {
  tabs?: string[];
}

export interface TabbedPaneState {
  selectedTabIndex: number;
}

class TabbedPane extends React.Component<TabbedPaneProps, TabbedPaneState> {

  constructor(props: TabbedPaneProps) {
    super(props);
    this.state = { selectedTabIndex: 0 }
  }

  onTabSelect(index: number) {
    this.setState({ selectedTabIndex: index, });
  }

  render() {
    return (
      <div className='row'>
        <div className='tabs'>
          { this.props.tabs.map((tab: string, index: number) => {
            return (<div key={index} onClick={()=>this.onTabSelect(index)} className={this.state.selectedTabIndex == index ? 'active' : ''} >{tab}</div>);
          }) }
        </div>
        <div className='tab-content'>
          {React.Children.toArray(this.props.children)[this.state.selectedTabIndex] }
        </div>
      </div>
    )
  }
}

export default TabbedPane;
