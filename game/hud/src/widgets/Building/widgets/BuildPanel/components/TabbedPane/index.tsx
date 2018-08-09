/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import SavedDraggable, { Anchor } from '../../../SavedDraggable';

export interface TabbedPaneProps {
  name: string;
  tabs?: string[];
  onTabChange?: (index: number, name: string) => void;

  defaultX: [number, Anchor];
  defaultY: [number, Anchor];
  defaultSize: [number, number];

  className?: string;
}

export interface TabbedPaneState {
  selectedTabIndex: number;
}

class TabbedPane extends React.Component<TabbedPaneProps, TabbedPaneState> {

  constructor(props: TabbedPaneProps) {
    super(props);
    this.state = { selectedTabIndex: 0 };
  }

  public render() {
    let rootClass = '';
    if (this.props.className) {
      rootClass = this.props.className;
    }

    const kids = React.Children.toArray(this.props.children);
    const tabContent = kids[this.state.selectedTabIndex];
    let extraContent: any = null;
    if (kids.length > this.props.tabs.length) {
      extraContent = kids.slice(this.props.tabs.length);
    }

    return (
      <SavedDraggable saveName={'building/' + this.props.name}
        defaultX={this.props.defaultX}
        defaultY={this.props.defaultY}
        defaultSize={this.props.defaultSize} >
        <div className={'row ' + rootClass}>
          {extraContent}
          <div className='tabs'>
            <div className='dragHandle'></div>
            { this.props.tabs.map((tab: string, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => this.onTabSelect(index) }
                  className={this.state.selectedTabIndex === index ? 'tab active' : 'tab'} >
                  {tab}
                </div>
              );
            }) }
          </div>
          <div className='tab-content'>
            {tabContent}
          </div>
        </div>
      </SavedDraggable>
    );
  }

  private onTabSelect = (index: number) => {
    this.setState((state, props) => ({ selectedTabIndex: index }));
    this.props.onTabChange(index, this.props.tabs[index]);
  }
}

export default TabbedPane;
