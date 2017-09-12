/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('div')`
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
`;

export interface BattleGroupListItemProps {
  item: {
    name: string;
  };
}

export interface BattleGroupListItemState {
}

export class BattleGroupListItem extends React.Component<BattleGroupListItemProps, BattleGroupListItemState> {
  public render() {
    return (
      <Container>
        {this.props.item.name}
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: BattleGroupListItemProps) {
    return nextProps.item.name !== this.props.item.name;
  }
}

export default BattleGroupListItem;
