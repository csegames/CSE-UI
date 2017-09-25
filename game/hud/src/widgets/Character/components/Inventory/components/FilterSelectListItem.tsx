/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-07-17 14:58:18
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-17 17:46:02
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { CUIcon, utils } from 'camelot-unchained';
import { colors, InventoryFilterButton as FilterButtonInfo } from '../../../lib/constants';
import { prettifyText } from '../../../lib/utils';

export interface FilterSelectListItemStyle extends StyleDeclaration {
  FilterSelectListItem: React.CSSProperties;
}

export const defaultFilterSelectListItemStyle: FilterSelectListItemStyle = {
  FilterSelectListItem: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: '0 0 auto',
    fontSize: '18px',
    lineHeight: '18px',
    padding: '2px 5px',
    color: utils.lightenColor(colors.filterBackgroundColor, 100),
    borderBottom: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 100)}`,
    ':hover': {
      backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 20),
      cursor: 'pointer',
    },
    ':hover *': {
      cursor: 'pointer',
    },
  },
};

export interface FilterSelectListItemProps {
  styles?: Partial<FilterSelectListItemStyle>;
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
    const ss = StyleSheet.create(defaultFilterSelectListItemStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div onClick={this.onCheckChange} className={css(ss.FilterSelectListItem, custom.FilterSelectListItem)}>
        <div>
          <input type='checkbox' checked={this.props.active} onChange={() => {}} />
          <label>{prettifyText(this.props.filterButton.name)}</label>
        </div>
        <CUIcon icon={this.props.filterButton.icon} iconStyle={{ position: 'relative' }} />
      </div>
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
