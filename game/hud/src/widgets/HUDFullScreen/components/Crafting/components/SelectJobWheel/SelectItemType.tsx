/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { PRIMARY_COLOR } from '../SelectorWheel';
import { ItemType } from 'gql/interfaces';
import { getItemTypeIcon } from '../../lib/utils';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: black;
  border: 2px solid rgba(117, 255, 204, 0.8);
  cursor: pointer;
  pointer-events: all;
  &:hover {
    filter: brightness(130%);
    -webkit-filter: brightness(130%);
  }
  &.selected {
    filter: brightness(150%);
    -webkit-filter: brightness(150%);
  }
  &.hide {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
`;

const InnerCircle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  border: 1px solid rgba(117, 255, 204, 0.6);
  cursor: pointer;
`;

const Icon = styled.div`
  color: ${PRIMARY_COLOR};
  font-size: 30px !important;
  &.isPreview {
    display: none;
  }
`;

const Text = styled.div`
  color: ${PRIMARY_COLOR};
  text-transform: uppercase;
  font-size: 12px;
  font-family: Caudex;
  letter-spacing: 1px;
  &.isPreview {
    font-size: 9px;
  }
`;

export interface Props {
  hide: boolean;
  itemType: ItemType;
  isPreview: boolean;
  onClick: (itemType: ItemType) => void;
}

class SelectItemType extends React.Component<Props> {
  public render() {
    const { hide, itemType, isPreview } = this.props;
    return (
      <Container onClick={this.onClick} className={`${hide ? 'hide' : ''}`}>
        <InnerCircle />
        <Icon className={isPreview ? `${getItemTypeIcon(itemType)} isPreview` : getItemTypeIcon(itemType)} />
        <Text className={isPreview ? 'isPreview' : ''}>{itemType === ItemType.SiegeEngine ? 'Siege' : itemType}</Text>
      </Container>
    );
  }

  private onClick = () => {
    this.props.onClick(this.props.itemType);
  }
}

export default SelectItemType;
