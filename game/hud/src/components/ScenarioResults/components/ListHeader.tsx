/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Name, KDAContainer, Divider, Kills, Deaths, Assists, Team } from './ListItem';
import ListHeaderItem, { SortBy } from './ListHeaderItem';

const Container = styled('div')`
  display: flex;
  justify-content: space-between;
  color: white;
  padding: 5px 25px;
`;

const SearchIcon = styled('span')`
  font-size: 12px;
  margin-top: 7px;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    filter: brightness(170%);
    -webkit-filter: brightness(170%);
  }
`;

const NameSearchInput = styled('input')`
  background-color: transparent;
  border: 0px;
  outline: none;
`;

export interface ListHeaderProps {
  selectedSortBy: SortBy;
  leastToGreatest: boolean;
  onSortClick: (sortBy: SortBy, leastToGreatest: boolean) => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
}

class ListHeader extends React.PureComponent<ListHeaderProps> {
  private nameInputRef: HTMLInputElement;
  public render() {
    return (
      <Container>
        <Team>
          <ListHeaderItem fullWidth text='F' sortBy={SortBy.Faction} {...this.props} />
        </Team>
        <Name color='#7D7D7D'>
          <ListHeaderItem text='Name' sortBy={SortBy.Name} {...this.props} />
          <SearchIcon className='fa fa-search' onClick={this.onSearchIconClick} />
          <NameSearchInput
            innerRef={(r: HTMLInputElement) => this.nameInputRef = r}
            value={this.props.searchValue}
            onChange={this.onSearchChange}
          />
        </Name>
        <KDAContainer>
          <Kills>
            <ListHeaderItem fullWidth text='K' sortBy={SortBy.PlayerKills} {...this.props} />
          </Kills>
          <Divider color='#7D7D7D'>/</Divider>
          <Deaths>
            <ListHeaderItem fullWidth text='D' sortBy={SortBy.Deaths} {...this.props} />
          </Deaths>
          <Divider color='#7D7D7D'>/</Divider>
          <Assists>
            <ListHeaderItem fullWidth text='A' sortBy={SortBy.PlayerAssists} {...this.props} />
          </Assists>
        </KDAContainer>
        <ListHeaderItem fullWidth text='NPC Kills' sortBy={SortBy.NPCKills} {...this.props} />
        <ListHeaderItem fullWidth text='Damage Dealt' sortBy={SortBy.DamageDealt} {...this.props} />
        <ListHeaderItem fullWidth text='Damage Received' sortBy={SortBy.DamageReceived} {...this.props} />
        <ListHeaderItem fullWidth text='Healing Dealt' sortBy={SortBy.HealingDealt} {...this.props} />
        <ListHeaderItem fullWidth text='Healing Received' sortBy={SortBy.HealingReceived} {...this.props} />
        <ListHeaderItem fullWidth text='Score' sortBy={SortBy.Score} {...this.props} />
      </Container>
    );
  }

  private onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onSearchChange(e.target.value);
  }

  private onSearchIconClick = () => {
    this.nameInputRef.focus();
  }
}

export default ListHeader;
