/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

export const ColumnSection = styled('div')`
  display: inline-block;
  pointer-events: all;
  cursor: pointer;
  color: white;
  color: #7D7D7D;
  flex: ${(props: any) => props.fullWidth ? 1 : null};
  &:hover {
    filter: brightness(120%);
    -webkit-filter: brightness(120%);
  }
`;

export enum SortBy {
  None = 'none',
  Faction = 'faction',
  PlayerKills = 'playerKills',
  PlayerAssists = 'playerAssists',
  NPCKills = 'nonPlayerKills',
  Deaths = 'deathCount',
  HealingDealt = 'healingApplied',
  DamageReceived = 'damageReceived',
  HealingReceived = 'healingReceived',
  Score = 'score',
  DamageDealt = 'damageApplied',
  Name = 'name',
}

export interface ListHeaderItemProps {
  text: string;
  sortBy: SortBy;
  selectedSortBy: SortBy;
  leastToGreatest: boolean;
  onSortClick: (sortBy: SortBy, leastToGreatest: boolean) => void;
  fullWidth?: boolean;
}

class ListHeaderItem extends React.PureComponent<ListHeaderItemProps> {
  public render() {
    const { sortBy, fullWidth, selectedSortBy, leastToGreatest } = this.props;
    return (
      <ColumnSection onClick={this.onHeaderClick} fullWidth={fullWidth}>
        {this.props.text}
        {sortBy === selectedSortBy &&
          (leastToGreatest ? <span className='fa fa-angle-up' /> : <span className='fa fa-angle-down' />)}
      </ColumnSection>
    );
  }

  private onHeaderClick = () => {
    const { sortBy, selectedSortBy, leastToGreatest } = this.props;
    if (sortBy === selectedSortBy) {
      if (leastToGreatest) {
        this.props.onSortClick(SortBy.None, false);
      } else {
        this.props.onSortClick(sortBy, !leastToGreatest);
      }
    } else {
      this.props.onSortClick(sortBy, false);
    }
  }
}

export default ListHeaderItem;
