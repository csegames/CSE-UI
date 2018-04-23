/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils, ql } from '@csegames/camelot-unchained';

import Animate from '../../../../lib/Animate';
import ServerSelect from './ServerSelect';

const SideBarHeaderContainer = styled('div')`
  position: relative;
  display: flex;
  height: 40px;
  background-color: ${utils.darkenColor('#222222', 10)};
  border-bottom: 1px solid #888;
`;

const SearchBar = styled('input')`
  height: 100%;
  flex: 1;
  padding: 0 5px;
  border: 0px;
  outline: none;
  font-size: 17px;
  background-color: #454545;
  transitionk: box-shadow 0.2s;
  box-shadow: none;
  &:focus {
    border-bottom: 0px !important;
    box-shadow: inset 0 0 2px 1px rgba(63, 208, 176, 0.5) !important;
  }
`;

const Button = styled('button')`
  border: 0px;
  outline: none;
  cursor: pointer;
  font-size: 15px;
  color: white;
  &.filter-button {
    background-color: ${utils.darkenColor('#3fd0b0', 15)};
    &:hover {
      background-color: #3fd0b0;
    }
  }
  &.server-select-button {
    background-color: #008000;
    &:hover {
      background-color: ${utils.lightenColor('#008000', 30)};
    }
  }
  &:active {
    box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
  }
`;

export interface SideBarHeaderProps {
  searchValue: string;
  onSearchChange: (searchValue: string) => void;
  toggleFilter: () => void;
  filterOn: boolean;
  toggleServerSelect: () => void;
  showServerSelect: boolean;
  selectedServer: ql.schema.ServerModel;
  onServerSelect: (server: ql.schema.ServerModel) => void;
}

class SideBarHeader extends React.Component<SideBarHeaderProps> {
  public render() {
    return (
      <SideBarHeaderContainer>
        <SearchBar
          placeholder='Search patch notes'
          value={this.props.searchValue}
          onChange={e => this.props.onSearchChange(e.target.value)}
        />
        <Button className='filter-button' onClick={this.props.toggleFilter}>
          <span className={`fa ${this.props.filterOn ? 'fa-sort-desc' : 'fa-sort-asc'}`}></span>
        </Button>
        <Button className='server-select-button' onClick={this.props.toggleServerSelect}>
          <span className='fa fa-server'></span>
        </Button>
        {this.props.showServerSelect && <div className='server-select-overlay' onClick={this.props.toggleServerSelect} />}
        <Animate animationEnter='fadeIn' animationLeave='fadeOut'
          durationEnter={200} durationLeave={200}>
          {this.props.showServerSelect &&
            <ServerSelect selectedServer={this.props.selectedServer} onServerSelect={this.props.onServerSelect} />}
        </Animate>
      </SideBarHeaderContainer>
    );
  }
}

export default SideBarHeader;
