/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import SavedDraggable, {Position, Size} from '../../../SavedDraggable';

export interface TabbedPaneProps {
  name: string;
  tabs?: string[];
  onTabChange?: (index: number, name: string) => void

  defaultPositionInPercentages: Position;
  defaultSizeInPercentages: Size;

  className?: string;
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
    this.props.onTabChange(index, this.props.tabs[index]);
  }

  render() {
    let rootClass = '';
    if (this.props.className)
      rootClass = this.props.className;

    const kids = React.Children.toArray(this.props.children);
    let tabContent = kids[this.state.selectedTabIndex];
    let extraContent: any = null;
    if (kids.length > this.props.tabs.length)
      extraContent = kids.slice(this.props.tabs.length);

    return (
      <SavedDraggable saveName={'building/' + this.props.name}
        defaultPositionInPercentages={this.props.defaultPositionInPercentages}
        defaultSizeInPercentages={this.props.defaultSizeInPercentages} >
        <div className={'row ' + rootClass}>
          {extraContent}
          <div className='tabs'>
            <div className="dragHandle"></div>
            { this.props.tabs.map((tab: string, index: number) => {
              return (<div key={index} onClick={() => this.onTabSelect(index) } className={this.state.selectedTabIndex == index ? 'tab active' : 'tab'} >{tab}</div>);
            }) }
          </div>
          <div className='tab-content'>
            {tabContent}
          </div>
        </div>
      </SavedDraggable>
    )
  }
}

export default TabbedPane;
