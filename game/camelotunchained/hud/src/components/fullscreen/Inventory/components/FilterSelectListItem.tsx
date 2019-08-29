/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { InventoryFilterButton as FilterButtonInfo } from 'fullscreen/lib/itemInterfaces';
import { prettifyText } from 'fullscreen/lib/utils';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';
import { CUIcon } from 'cseshared/components/CUIcon';

// #region Container constants
const CONTAINER_FONT_SIZE = 36;
const CONTAINER_PADDING_VERTICAL = 4;
const CONTAINER_PADDING_HORIZONTAL = 10;
// #endregion
const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  font-size: ${CONTAINER_FONT_SIZE}px;
  line-height: ${CONTAINER_FONT_SIZE}px;
  padding: ${CONTAINER_PADDING_VERTICAL}px ${CONTAINER_PADDING_HORIZONTAL}px;
  color: #413735;
  border-bottom: 1px solid #413735;
  &:hover {
    background-color: #6A6260;
    cursor: pointer;
  }
  &:hover * {
    cursor: pointer;
  }

  @media (max-width: 2560px) {
    font-size: ${CONTAINER_FONT_SIZE * MID_SCALE}px;
    line-height: ${CONTAINER_FONT_SIZE * MID_SCALE}px;
    padding: ${CONTAINER_PADDING_VERTICAL * MID_SCALE}px ${CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${CONTAINER_FONT_SIZE * HD_SCALE}px;
    line-height: ${CONTAINER_FONT_SIZE * HD_SCALE}px;
    padding: ${CONTAINER_PADDING_VERTICAL * HD_SCALE}px ${CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

export interface FilterSelectListItemProps {
  filterButton: FilterButtonInfo;
  active: boolean;
  onActivated: (filterButton: FilterButtonInfo) => void;
  onDeactivated: (filterButton: FilterButtonInfo) => void;
}

export interface FilterSelectListItemState {
}

export class FilterSelectListItem extends React.Component<FilterSelectListItemProps, FilterSelectListItemState> {
  constructor(props: FilterSelectListItemProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <Container onClick={this.onCheckChange}>
        <div>
          <input type='checkbox' checked={this.props.active} onChange={() => {}} />
          <label>{prettifyText(this.props.filterButton.name)}</label>
        </div>
        <CUIcon icon={this.props.filterButton.icon} iconStyle={{ position: 'relative' }} />
      </Container>
    );
  }

  private onCheckChange = () => {
    if (this.props.active) {
      this.props.onDeactivated(this.props.filterButton);
    } else {
      this.props.onActivated(this.props.filterButton);
    }
  }
}

export default FilterSelectListItem;
