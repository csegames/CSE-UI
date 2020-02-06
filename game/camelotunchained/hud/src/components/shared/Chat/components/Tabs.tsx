/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Tab from './Tab';

export interface TabsState {
}
export interface TabsProps {
  current: string;
  select: (tab: string) => void;
}

class Tabs extends React.Component<TabsProps, TabsState> {
  public render() {
    const content: JSX.Element[] = [];
    const tabs = ['rooms', 'users', 'settings'];
    for (let i = 0; i < tabs.length; i++) {
      content.push(<Tab key={tabs[i]} id={tabs[i]} select={this.props.select} selected={this.props.current === tabs[i]}/>);
    }
    return (
      <ul className='chat-tabs'>
        {content}
      </ul>
    );
  }
}

export default Tabs;
