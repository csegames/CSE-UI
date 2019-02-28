/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from 'linaria/react';
import FilterTabItem from './FilterTabItem';

const Container = styled.div`
  display: flex;
  width: 75%;
  align-self: center;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 0;
`;

const FilterDivider = styled.div`
  height: 12px;
  width: 1px;
  background-color: #939393;
  margin: 0 10px;
`;

export enum PostFilter {
  All = 'All',
  PatchNotes = 'Patch Notes',
  News = 'News',
}

export interface Props {
  activeFilter: PostFilter;
  onFilterClick: (filter: PostFilter) => void;
}

class FilterTabs extends React.Component<Props> {
  public render() {
    const { activeFilter, onFilterClick } = this.props;
    return (
      <Container>
        <FilterTabItem filter={PostFilter.All} activeFilter={activeFilter} onClick={onFilterClick} />
        <FilterDivider />
        <FilterTabItem filter={PostFilter.PatchNotes} activeFilter={activeFilter} onClick={onFilterClick} />
        <FilterDivider />
        <FilterTabItem filter={PostFilter.News} activeFilter={activeFilter} onClick={onFilterClick} />
      </Container>
    );
  }
}

export default FilterTabs;
