/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import classNames from 'classnames';
import { styled } from '@csegames/linaria/react';
import { css } from '@csegames/linaria';
import { utils } from '@csegames/camelot-unchained';
import { prettifyText, searchIncludesSection } from '../../../lib/utils';

export interface StatListItemStyles {
  statsListItem: React.CSSProperties;
  lightListItem: React.CSSProperties;
  statText: React.CSSProperties;
  statValue: React.CSSProperties;
  doesNotMatchSearch: React.CSSProperties;
}

const StatsListItem = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  cursor: default;
  padding: 0 5px;
  height: 30px;
  line-height: 30px;
  background-color: rgba(60, 60, 60, 0.3);
  opacity: 0.8;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  &:hover {
    filter: brightness(200%);
  }
`;

const LightListItem = css`
  background-color: rgba(89, 89, 89, 0.3);
  &:hover {
    background-color: rgba(60, 60, 60, 0.3);
    filter: brightness(200%);
  }
`;

const StatText = styled.p`
  display: inline-block;
  font-size: 16px;
  margin: 0;
  padding: 0;
  text-overflow: ellipsis;
  color: #9B9B9B;
`;

const DoesNotMatchSearch = css`
  opacity: 0.2;
  background-color: rgba(0, 0, 0, 0.2);
`;

export interface StatListItemProps {
  styles?: Partial<StatListItemStyles>;
  item: any;
  statName: string;
  statValue: any;
  index: number;
  searchValue: string;
  sectionTitle?: string;
  colorOfName?: string;
  onMouseOver?: (e: React.MouseEvent<HTMLDivElement>, statValue: any) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>, statValue: any) => void;
}

class StatListItem extends React.Component<StatListItemProps, {}> {
  public render() {
    const lightItem = this.props.index % 2 === 0;
    const searchIncludes = this.searchIncludesListItem(
      this.props.sectionTitle,
      this.props.searchValue,
      this.props.statName,
    );

    return (
      <StatsListItem
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        className={classNames(
          lightItem ? LightListItem : '',
          !searchIncludes ? DoesNotMatchSearch : '',
        )}>
        <StatText color={this.props.colorOfName}>{prettifyText(this.props.statName)}</StatText>
        {typeof this.props.statValue === 'function' ?
          this.props.statValue() :
          typeof this.props.statValue === 'number' || typeof this.props.statValue === 'string' ?
            <StatText>{Number(Number(this.props.statValue).toFixed(2))}</StatText> :
            null
        }
      </StatsListItem>
    );
  }

  public shouldComponentUpdate(nextProps: StatListItemProps) {
    const nextPropsIncludeListItem = this.searchIncludesListItem(
      nextProps.sectionTitle,
      nextProps.searchValue,
      nextProps.statName,
    );
    const currentPropsIncludeListItem = this.searchIncludesListItem(
      this.props.sectionTitle,
      this.props.searchValue,
      this.props.statName,
    );

    return nextPropsIncludeListItem !== currentPropsIncludeListItem || nextProps.statValue !== this.props.statValue;
  }

  private searchIncludesListItem = (sectionTitle: string, searchValue: string, statName: string) => {
    if (searchValue !== '') {
      if (searchIncludesSection(searchValue, sectionTitle)) {
        return statName ? utils.doesSearchInclude(
          searchValue.toLowerCase().replace(/\s/g, '')
          .replace(sectionTitle.replace(/\s/g, '').toLowerCase(), ''), statName.toLowerCase()) : false;
      }
      return utils.doesSearchInclude(searchValue, statName);
    } else {
      return true;
    }
  }

  private onMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof this.props.onMouseOver !== 'undefined') {
      this.props.onMouseOver(e, this.props.item);
    }
  }

  private onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof this.props.onMouseLeave !== 'undefined') {
      this.props.onMouseLeave(e, this.props.item);
    }
  }
}

export default StatListItem;
