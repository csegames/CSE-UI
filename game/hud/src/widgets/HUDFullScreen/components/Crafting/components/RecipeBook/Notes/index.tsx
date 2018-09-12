/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { sortBy } from 'lodash';
import { styled } from '@csegames/linaria/react';
import gql from 'graphql-tag';
import { webAPI } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { VoxNote, RecipeBookNotesQuery } from 'gql/interfaces';
import { VoxNoteFragment } from '../../../gql/VoxNoteFragment';

import { nullVal } from '../../../../../lib/constants';
import PageSelector from '../PageSelector';
import NotesView from './NotesView';

const query = gql`
  query RecipeBookNotesQuery {
    crafting {
      voxNotes {
        ...VoxNote
      }
    }
  }
  ${VoxNoteFragment}
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -10px;
`;

const PageSelectorPosition = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 10px;
  top: 10px;
`;

const AddButton = styled.div`
  font-family: TradeWinds;
  font-weight: bold;
  opacity: 1;
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: -3px;
  &:hover {
    opacity: 0.7;
  }
`;

export interface NoteIdToVoxNote {
  [id: string]: VoxNote.Fragment;
}

export interface PageToNoteId {
  [id: string]: string;
}

export interface Props {
}

export interface State {
  currentPage: number;
  creating: boolean;
  noteIdToVoxNote: NoteIdToVoxNote;
  pageToNoteId: PageToNoteId;
  selectedVoxNote: VoxNote.Fragment;
}

class Notes extends React.Component<Props, State> {
  private graphql: GraphQLResult<RecipeBookNotesQuery.Query>;
  constructor(props: Props) {
    super(props);
    this.state = {
      currentPage: 1,
      creating: false,
      noteIdToVoxNote: {},
      pageToNoteId: {},
      selectedVoxNote: null,
    };
  }

  public render() {
    const { creating, currentPage, selectedVoxNote } = this.state;
    return (
      <Container>
        <GraphQL query={query} onQueryResult={this.handleQueryResult} />
        <PageSelectorPosition>
          <PageSelector
            currentPage={currentPage}
            numberOfPages={this.getTotalPages()}
            onChangeCurrentPage={this.onChangeCurrentPage}
          />
          {!creating && <AddButton onClick={this.onAdd}>+</AddButton>}
        </PageSelectorPosition>
        <NotesView selectedVoxNote={selectedVoxNote} onNotesChange={this.onNotesChange} />
      </Container>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<RecipeBookNotesQuery.Query>) => {
    this.graphql = graphql;
    if (!graphql.data || !graphql.data.crafting) return graphql;

    const voxNotes = graphql.data.crafting.voxNotes;
    this.initialize(voxNotes);
  }

  private initialize = (voxNotes: VoxNote.Fragment[]) => {
    const noteIdToVoxNote: NoteIdToVoxNote = {};
    const pageToNoteId: PageToNoteId = {};
    sortBy(voxNotes, note => note.created).forEach((voxNote, i) => {
      noteIdToVoxNote[voxNote.id] = voxNote;
      pageToNoteId[i + 1] = voxNote.id;
    });

    this.setState({
      noteIdToVoxNote,
      pageToNoteId,
      creating: voxNotes.length === 0,
      selectedVoxNote: noteIdToVoxNote[pageToNoteId[this.state.currentPage]] || null,
    });
  }

  private getVoxNoteForPage = (page: number) => {
    const { noteIdToVoxNote, pageToNoteId } = this.state;
    return noteIdToVoxNote[pageToNoteId[page]];
  }

  private getTotalPages = () => {
    const noteIDs = Object.keys(this.state.noteIdToVoxNote);
    return this.state.creating ? noteIDs.length + 1 : noteIDs.length;
  }

  private onAdd = () => {
    const nextPage = this.state.currentPage + 1;
    this.setState({ creating: true, currentPage: nextPage, selectedVoxNote: null });
  }

  private onChangeCurrentPage = (page: number) => {
    if (this.state.currentPage !== page) {
      this.setState({ currentPage: page, selectedVoxNote: this.getVoxNoteForPage(page) });
    }
  }

  private onNotesChange = async (notes: string) => {
    const { selectedVoxNote } = this.state;
    await webAPI.CraftingAPI.SetCraftingNotes(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      selectedVoxNote ? selectedVoxNote.id : nullVal,
      notes,
    );

    if (!selectedVoxNote) {
      this.graphql.refetch();
    } else {
      const noteIdToVoxNote = { ...this.state.noteIdToVoxNote };
      noteIdToVoxNote[selectedVoxNote.id] = {
        ...noteIdToVoxNote[selectedVoxNote.id],
        notes,
      };

      this.setState({ noteIdToVoxNote });
    }
  }
}

export default Notes;
