/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import AtUserListItem from './AtUserListItem';

export interface AtUserListProps {
  users: string[];
  selectedIndex: number;
  selectUser: (user: string) => void;
}

export interface AtUserListState {}

class AtUserList extends React.Component<AtUserListProps, AtUserListState> {

  constructor(props: AtUserListProps) {
    super(props);
  }

  public render() {
    const nameList: JSX.Element[] = [];
    if (this.props.users.length > 0) {
      this.props.users.forEach((user: string, index: number) => {
        const selected: boolean = this.props.selectedIndex === index ? true : false;
        nameList.push(
          <AtUserListItem user={user} key={index} selected={selected} selectUser={this.props.selectUser}/>,
        );
      });
    }

    return (
      <div className='atuser-list-anchor' ref='anchor' style={{ display: nameList.length ? 'block' : 'none' }}>
        <div className='atuser-list'>{nameList}</div>
      </div>
    );
  }
}

export default AtUserList;
