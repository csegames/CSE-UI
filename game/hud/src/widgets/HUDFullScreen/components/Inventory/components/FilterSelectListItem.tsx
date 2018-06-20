/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { CUIcon, utils } from '@csegames/camelot-unchained';
import styled from 'react-emotion';
import { colors, InventoryFilterButton as FilterButtonInfo } from '../../../lib/constants';
import { prettifyText } from '../../../lib/utils';

const Container = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  font-size: 18px;
  line-height: 18px;
  padding: 2px 5px;
  color: ${utils.lightenColor(colors.filterBackgroundColor, 100)};
  border-bottom: 1px solid ${utils.lightenColor(colors.filterBackgroundColor, 100)};
  &:hover {
    background-color: ${utils.lightenColor(colors.filterBackgroundColor, 20)};
    cursor: pointer;
  }
  &:hover * {
    cursor: pointer;
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
