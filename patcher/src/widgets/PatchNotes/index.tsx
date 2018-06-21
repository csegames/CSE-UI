/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ql } from '@csegames/camelot-unchained';
import Content from './components/Content/Content';
import SideBar from './components/SideBar/SideBar';

const Container = styled('div')`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #454545;
`;

const ContentContainer = styled('div')`
  flex: 2;
  display: flex;
`;

const SideBarContainer = styled('div')`
  flex: 1;
  display: flex;
`;

export interface PatchNotesProps {
  defaultServer: ql.schema.ServerModel;
}

export interface PatchNotesState {
  selectedPatchNoteId: string;
  selectedServer: ql.schema.ServerModel;
}

export class PatchNotes extends React.Component<PatchNotesProps, PatchNotesState> {
  constructor(props: PatchNotesProps) {
    super(props);
    this.state = {
      selectedPatchNoteId: '',
      selectedServer: props.defaultServer,
    };
  }

  public render() {
    return (
      <Container>
        <ContentContainer>
          <Content patchNoteId={this.state.selectedPatchNoteId} />
        </ContentContainer>
        <SideBarContainer>
          <SideBar
            selectedServer={this.state.selectedServer}
            onSelectServer={this.onServerSelect}
            selectedPatchNote={this.state.selectedPatchNoteId}
            onSelectPatchNote={this.onSelectPatchNote}
          />
        </SideBarContainer>
      </Container>
    );
  }

  public componentDidCatch(error: any, info: any) {
    console.log(error);
    console.log(info);
  }

  private onServerSelect = (server: ql.schema.ServerModel) => {
    this.setState({ selectedServer: server });
  }

  private onSelectPatchNote = (id: string) => {
    this.setState({ selectedPatchNoteId: id });
  }
}

export default PatchNotes;
