/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { client, utils, ql } from '@csegames/camelot-unchained';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';

import { PatcherServer } from '../../../Controller/services/session/controller';
import SideBarHeader from './Header';
import SideBarList from './List';

const SideBarContainer = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${utils.lightenColor('#575757', 30)};
`;

export interface SideBarProps extends GraphQLInjectedProps<{ patchNotes: ql.schema.PatchNote[] }> {
  onSelectPatchNote: (id: string) => void;
  selectedPatchNote: string;
  onSelectServer: (server: ql.schema.ServerModel) => void;
  selectedServer: ql.schema.ServerModel;
}

export interface SideBarState {
  searchValue: string;
  patchNotes: ql.schema.PatchNote[];
  servers: PatcherServer[];
  filterOn: boolean;
  showServerSelect: boolean;
}

class SideBar extends React.Component<SideBarProps, SideBarState> {
  constructor(props: SideBarProps) {
    super(props);
    this.state = {
      searchValue: '',
      patchNotes: [],
      servers: [],
      filterOn: false,
      showServerSelect: false,
    };
  }

  public render() {
    return (
      <SideBarContainer>
        <SideBarHeader
          searchValue={this.state.searchValue}
          onSearchChange={this.onSearchChange}
          toggleFilter={this.toggleFilter}
          filterOn={this.state.filterOn}
          toggleServerSelect={this.toggleServerSelect}
          showServerSelect={this.state.showServerSelect}
          selectedServer={this.props.selectedServer}
          onServerSelect={this.onServerSelect}
        />
        <SideBarList
          searchValue={this.state.searchValue}
          patchNotes={this.state.patchNotes}
          selectedPatchNote={this.props.selectedPatchNote}
          onSelectPatchNote={this.onSelectPatchNote}
        />
      </SideBarContainer>
    );
  }

  public componentWillReceiveProps(nextProps: SideBarProps) {
    if (!_.isEqual(this.props.graphql.data, nextProps.graphql.data)) {
      const sortedPatchNotes = nextProps.graphql.data.patchNotes.sort((a, b) =>
        new Date(b.utcDisplayStart).getTime() - new Date(a.utcDisplayStart).getTime());

      this.props.onSelectPatchNote(sortedPatchNotes[0] && sortedPatchNotes[0].id);
      this.setState({ patchNotes: sortedPatchNotes });
    }
  }

  public componentWillUpdate(nextProps: SideBarProps, nextState: SideBarState) {
    if (!_.isEqual(this.state.searchValue, nextState.searchValue)) {
      this.filterPatchNotes(nextState.searchValue);
    }
  }

  private filterPatchNotes = (searchValue: string) => {
    this.setState((state, props) => {
      const patchNotes = state.patchNotes;
      if (searchValue !== '') {
        const includedItems = patchNotes.filter(patchNote => this.doesSearchInclude(searchValue, patchNote));
        const nonIncludedItems = patchNotes.filter(patchNote => !this.doesSearchInclude(searchValue, patchNote));
        return {
          patchNotes: [...includedItems, ...nonIncludedItems],
        };
      }
      return {
        patchNotes: props.graphql.data.patchNotes,
      };
    });
  }

  private toggleFilter = () => {
    this.setState((state, props) => {
      if (!this.state.filterOn) {
        const sortedPatchNotes = this.state.patchNotes.sort((a, b) =>
          new Date(a.utcDisplayStart).getTime() - new Date(b.utcDisplayStart).getTime());
        return {
          filterOn: true,
          searchValue: '',
          patchNotes: sortedPatchNotes,
        };
      }
      const sortedPatchNotes = this.state.patchNotes.sort((a, b) =>
        new Date(b.utcDisplayStart).getTime() - new Date(a.utcDisplayStart).getTime());
      return {
        filterOn: false,
        searchValue: '',
        patchNotes: sortedPatchNotes,
      };
    });
  }

  private toggleServerSelect = () => {
    this.setState({ showServerSelect: !this.state.showServerSelect });
  }

  private onServerSelect = (server: ql.schema.ServerModel) => {
    this.props.onSelectServer(server);
    this.props.graphql.refetch();
  }

  private doesSearchInclude = (searchValue: string, patchNote: ql.schema.PatchNote) => {
    return utils.doesSearchInclude(searchValue, `${patchNote.patchNumber} ${patchNote.title}`);
  }

  private onSelectPatchNote = (id: string) => {
    this.props.onSelectPatchNote(id);
  }

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

const SideBarWithQL = withGraphQL<SideBarProps>(props => ({
  query: `
    query SideBar($channel: Int!) {
      patchNotes(channel: $channel) {
        id
        title
        patchNumber
        htmlContent
        utcDisplayStart
      }
    }
  `,
  variables: {
    channel: props.selectedServer ? props.selectedServer.channelID : client.patchResourceChannel,
  },
}))(SideBar);

export default SideBarWithQL;
