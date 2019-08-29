/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { webAPI } from '@csegames/library/lib/camelotunchained';
import { VoxJobGroupLog } from 'gql/interfaces';

import { CraftingContext } from '../../../CraftingContext';
import NotesEditor from '../NotesEditor';

export interface ComponentProps {
  groupLog: VoxJobGroupLog.Fragment;
  placeholder?: string;
  disabled?: boolean;
}

export interface InjectedProps {
  refetchCrafting: () => void;
}

export type Props = ComponentProps & InjectedProps;

class LogNotes extends React.Component<Props> {
  public render() {
    return (
      <NotesEditor
        id={this.props.groupLog.jobIdentifier}
        defaultValue={this.props.groupLog.notes}
        onChange={this.onNoteChangeServer}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}
      />
    );
  }

  private onNoteChangeServer = async (notesValue: string) => {
    const { groupLog } = this.props;
    await webAPI.CraftingAPI.SetVoxJobGroupNotes(
      webAPI.defaultConfig,
      game.shardID,
      camelotunchained.game.selfPlayerState.characterID,
      groupLog.jobIdentifier,
      groupLog.jobType,
      notesValue,
    );

    this.props.refetchCrafting();
  }
}

class LogNotesWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <CraftingContext.Consumer>
        {({ refetchCrafting }) => (
          <LogNotes {...this.props} refetchCrafting={refetchCrafting} />
        )}
      </CraftingContext.Consumer>
    );
  }
}

export default LogNotesWithInjectedContext;
