/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { filter } from 'lodash';
import { styled } from '@csegames/linaria/react';

import { GroupLogData } from '../index';
import JobLogFullView from '../JobLogFullView';
import GroupLogQuickView from '../GroupLogQuickView';
import BackButton from '../JobLogFullView/BackButton';
import SearchInput from '../SearchInput';

const Container = styled.div`
  height: 100%;
`;

export interface Props {
  jobNumber: number;
  groupLogs: GroupLogData[];
  searchValue: string;
  onSearchChange: (searchValue: string) => void;
}

export interface State {
  currentPage: number;
  selectedGroupLog: GroupLogData;
}

class Favorites extends React.Component<Props, State> {
  private navEventHandle: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1,
      selectedGroupLog: null,
    };
  }

  public render() {
    const { searchValue, onSearchChange } = this.props;
    return (
      <Container>
        {!this.state.selectedGroupLog && <SearchInput searchValue={searchValue} onSearchChange={onSearchChange} />}
        {this.shouldShowBack() && <BackButton onClick={this.onBackClick} />}
        {this.renderView()}
      </Container>
    );
  }

  private renderView = () => {
    if (this.state.selectedGroupLog) {
      return (
        <JobLogFullView jobNumber={this.props.jobNumber} selectedGroupLog={this.state.selectedGroupLog} />
      );
    }

    return (
      <GroupLogQuickView
        searchValue={this.props.searchValue}
        groupLogs={this.getFavoriteGroupLogs()}
        currentPage={this.state.currentPage}
        onChangeCurrentPage={this.onChangeCurrentPage}
        onSelectGroupLog={this.onSelectGroupLog}
      />
    );
  }

  public componentDidMount() {
    this.navEventHandle = game.on('crafting-recipe-book-nav', this.handleRecipeBookNav);
  }

  public componentWillUnmount() {
    this.navEventHandle.clear();
  }

  private handleRecipeBookNav = () => {
    this.setState({ currentPage: 1, selectedGroupLog: null });
  }

  private getFavoriteGroupLogs = () => {
    return filter(this.props.groupLogs, groupLog => groupLog.log.favorite);
  }

  private onChangeCurrentPage = (page: number) => {
    this.setState({ currentPage: page });
  }

  private onSelectGroupLog = (groupLog: GroupLogData) => {
    this.setState({ selectedGroupLog: groupLog });
  }

  private onBackClick = () => {
    this.setState({ selectedGroupLog: null });
  }

  private shouldShowBack = () => {
    return this.state.selectedGroupLog !== null;
  }
}

export default Favorites;
