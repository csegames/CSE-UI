/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { cx, css } from 'react-emotion';

import Slider from './Slider';

export interface ListItemStyles {
  sliderItem: React.CSSProperties;
  oddColorBackground: React.CSSProperties;
  searchDoesNotInclude: React.CSSProperties;
}

const Container = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  border-bottom: 1px solid #454545;
  background-color: rgba(20, 20, 20, 0.75);
  &:hover {
    background-color: rgba(30, 30, 30, 0.75);
  }
  &:active {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.9);
  }
`;

const SliderItem = css`
  cursor: default;
  &:hover {
    background-color: rgba(20, 20, 20, 0.75);
  }
  &:active {
    box-shadow: none;
  }
`;

const OddColorBackground = css`
  background-color: rgba(10, 10, 10, 0.75);
`;

const SearchDoesNotInclude = css`
  opacity: 0.4;
`;

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
  if (props.sliderItemInfo) {
    return (
      <Container
        className={cx(
          SliderItem,
          props.isOddItem ? OddColorBackground : '',
          props.searchIncludes === false ? SearchDoesNotInclude : '',
        )}>
        <Slider
          {...props.sliderItemInfo}
          label={props.name}
          value={parseInt(props.value, 10)}
        />
      </Container>
    );
  } else {
    return (
      <Container
        onClick={props.onClick}
        className={cx(
          props.isOddItem ? OddColorBackground : '',
          props.searchIncludes === false ? SearchDoesNotInclude : '',
        )}>
          <span>{props.name}</span>
          <span>{props.value}</span>
      </Container>
    );
  }
};

export default ListItem;
