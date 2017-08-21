/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-23 10:31:18
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-23 11:34:45
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import Slider from './Slider';

export interface ListItemStyles extends StyleDeclaration {
  ListItem: React.CSSProperties;
  sliderItem: React.CSSProperties;
  oddColorBackground: React.CSSProperties;
  searchDoesNotInclude: React.CSSProperties;
}

const defaultListItemStyle: ListItemStyles = {
  ListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px',
    cursor: 'pointer',
    webkitUserSelect: 'none',
    userSelect: 'none',
    borderBottom: '1px solid #454545',
    backgroundColor: 'rgba(20,20,20,0.75)',
    ':hover': {
      backgroundColor: 'rgba(30,30,30,0.75)',
    },
    ':active': {
      boxShadow: 'inset 0 0 5px rgba(0,0,0,0.9)',
    },
  },

  sliderItem: {
    cursor: 'default',
    ':hover': {
      backgroundColor: 'rgba(20,20,20,0.75)',
    },
    ':active': {
      boxShadow: 'none',
    },
  },

  oddColorBackground: {
    backgroundColor: 'rgba(10,10,10,0.75)',
  },

  searchDoesNotInclude: {
    opacity: 0.4,
  },
};

export interface SliderListItem {
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export interface ListItemProps {
  styles?: Partial<ListItemStyles>;
  isOddItem?: boolean;
  searchIncludes?: boolean;
  onClick?: () => void;
  sliderItemInfo?: SliderListItem;
  name: string;
  value: string;
}

const ListItem = (props: ListItemProps) => {
  const ss = StyleSheet.create(defaultListItemStyle);
  const custom = StyleSheet.create(props.styles || {});
  
  if (props.sliderItemInfo) {
    return (
      <div
        className={css(
          ss.ListItem,
          custom.ListItem,
          ss.sliderItem,
          custom.sliderItem,
          props.isOddItem && ss.oddColorBackground,
          props.isOddItem && custom.oddColorBackground,
          props.searchIncludes === false && ss.searchDoesNotInclude,
          props.searchIncludes === false && custom.searchDoesNotInclude,
        )}>
        <Slider
          {...props.sliderItemInfo}
          label={props.name}
          value={parseInt(props.value, 10)}
        />
      </div>
    );
  } else {
    return (
      <div
        onClick={props.onClick}
        className={css(
          ss.ListItem,
          custom.ListItem,
          props.isOddItem && ss.oddColorBackground,
          props.isOddItem && custom.oddColorBackground,
          props.searchIncludes === false && ss.searchDoesNotInclude,
          props.searchIncludes === false && custom.searchDoesNotInclude,
      )}>
          <span>{props.name}</span>
          <span>{props.value}</span>
      </div>
    );
  }
};

export default ListItem;
