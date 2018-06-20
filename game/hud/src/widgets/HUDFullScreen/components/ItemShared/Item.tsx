/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import ItemIcon from './ItemIcon';

const Container = styled('div')`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

export interface ItemProps {
  styles: any;
  useFontIcon?: boolean;
  id: string;
  icon: string;
}

export interface ItemState {
}

export class Item extends React.Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <Container style={this.props.styles}>
        <ItemIcon useFontIcon={this.props.useFontIcon} url={this.props.icon} />
      </Container>
    );
  }
}

export default Item;
