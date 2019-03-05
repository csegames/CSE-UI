/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { PostFilter } from './FilterTabs';
import { PATCH_NOTES_COLOR, NEWS_COLOR } from '../lib/styles';

const Container = styled.div`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-family: Caudex;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 2px;
  &.active {
    color: white;
  }
  &.active:hover {
    color: white;
  }
  &:hover {
    color: #C3C3C3;
  }
`;

const FilterIndicator = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 5px;
  height: 12px;
  width: 3px;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url(/ui/images/news/news-texture.png) repeat-y;
  }
  &.patch-note {
    background-color: ${PATCH_NOTES_COLOR};
  }
  &.news {
    background-color: ${NEWS_COLOR};
  }
`;

export interface Props {
  activeFilter: PostFilter;
  filter: PostFilter;
  onClick: (filter: PostFilter) => void;
}

class FilterTabItem extends React.Component<Props> {
  public render() {
    const { activeFilter, filter } = this.props;
    let indicatorClassName = '';

    if (filter === PostFilter.News) {
      indicatorClassName = 'news';
    }

    if (filter === PostFilter.PatchNotes) {
      indicatorClassName = 'patch-note';
    }

    return (
      <Container className={activeFilter === filter ? 'active' : ''} onClick={this.onClick}>
        {filter !== PostFilter.All && <FilterIndicator className={indicatorClassName} />}
        {filter}
      </Container>
    );
  }

  private onClick = () => {
    this.props.onClick(this.props.filter);
  }
}

export default FilterTabItem;
