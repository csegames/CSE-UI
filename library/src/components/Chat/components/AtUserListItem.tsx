/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface AtUserListItemProps {
  user: string;
  selectUser: (user: string) => void;
  selected?: boolean;
}

export interface AtUserListItemState {
}

class AtUserListItem extends React.Component<AtUserListItemProps, AtUserListItemState> {
  constructor(props: AtUserListItemProps) {
    super(props);
  }

  public render() {
    const classes: string[] = ['atuser-name'];
    if (this.props.selected) classes.push('atuser-name-selected');
    return (
      <div
        className={classes.join(' ')}
        ref={ this.props.selected ? (div) => { if (div) div.scrollIntoView(); } : undefined }
        onClick={this.selectUser}
      >
          {this.props.user}
      </div>
    );
  }

  private selectUser = () => {
    this.props.selectUser(this.props.user);
  }
}

export default AtUserListItem;
