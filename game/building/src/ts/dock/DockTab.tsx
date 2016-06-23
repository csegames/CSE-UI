/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface DockTabProps {
  id: string;
  selected: boolean;
  select: (tab: string) => void;
};
export interface DockTabState {
};

class DockTab extends React.Component<DockTabProps, DockTabState> {
  public name: string = 'DockTab';

  constructor(props: DockTabProps) {
    super(props);
  }

  render() {
    const tabClass: string[] = [
      "tab",
      this.props.id.toLowerCase(),
      this.props.selected ? 'selected' : undefined
    ];
    return (
      <div ref={this.props.id} className={tabClass.join(' ')} onClick={() => this.props.select(this.props.id)}>
      </div>
    );
  }
}

export default DockTab;
