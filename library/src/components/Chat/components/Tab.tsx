/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface TabState {
}

export interface TabProps {
  key: string;
  id: string;
  select: (tab: string) => void;
  selected?: boolean;
}

class Tab extends React.Component<TabProps, TabState> {
  public render() {
    const classes : string[] = ['chat-tab'];
    if (this.props.selected) classes.push('chat-tab-selected');
    classes.push('chat-' + this.props.id);
    return (
      <li className={ classes.join(' ') } onClick={this.select}></li>
    );
  }

  private select = (): void => {
    this.props.select(this.props.id);
  }
}

export default Tab;
