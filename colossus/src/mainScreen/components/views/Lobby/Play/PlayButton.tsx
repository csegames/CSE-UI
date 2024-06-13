/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button, ButtonType } from '../../../shared/Button';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { TimeElapsed } from '../../../shared/TimeElapsed';

import { Dispatch } from 'redux';
import {
  Group,
  MatchAccess,
  Queue,
  QueueEntry,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { enterQueue, hasRequest, leaveQueue, MatchRequestState } from '../../../../redux/matchSlice';
import { Dictionary } from '@reduxjs/toolkit';
import { StringIDGeneralCancel, getStringTableValue } from '../../../../helpers/stringTableHelpers';

const ConsoleButton = 'StartScreen-Play-ReadyButton-ConsoleButton';
const ButtonIcon = 'StartScreen-Play-ReadyButton-ButtonIcon';
const SearchingTimerText = 'StartScreen-Play-ReadyButton-SearchingTimerText';

const StringIDPlayButtonOffline = 'PlayButtonOffline';
const StringIDPlayButtonAlreadyQueued = 'PlayButtonAlreadyQueued';
const StringIDPlayButtonSearching = 'PlayButtonSearching';
const StringIDPlayButtonQueued = 'PlayButtonQueued';
const StringIDPlayQueueNotFound = 'PlayQueueNotFound';
const StringIDPlayInvalidGroupSize = 'PlayInvalidGroupSize';

interface ReactProps {
  playText: string;
  queueID: string;
  buttonID: string;
  style: string;
  buttonType: ButtonType;
}

interface InjectedProps {
  dispatch?: Dispatch;
  access: MatchAccess;
  accountID: string;
  currentEntry: QueueEntry | null;
  group: Group;
  queues: Queue[];
  requests: MatchRequestState;
  usingGamepadInMainMenu: boolean;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = InjectedProps & ReactProps;

export class APlayButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const [content, enabled] = this.getButtonContent();
    return (
      <Button
        type={this.props.buttonType}
        styles={this.props.style}
        disabled={!enabled || !this.canClick()}
        text={enabled && this.props.usingGamepadInMainMenu ? this.wrapControls(content) : content}
        onClick={this.onClick.bind(this)}
      />
    );
  }

  private wrapControls(content: React.ReactNode): React.ReactNode {
    return (
      <div className={ConsoleButton}>
        <span className={`${ButtonIcon} icon-xb-a`} /> {content}
      </div>
    );
  }

  private getButtonContent(): [React.ReactNode, boolean] {
    switch (this.props.access) {
      case MatchAccess.Forbidden:
      case MatchAccess.Offline:
        return [getStringTableValue(StringIDPlayButtonOffline, this.props.stringTable), false];
    }

    const isGroupLead = this.props.accountID === this.props.group?.leader.id;
    const current = this.props.currentEntry;
    if (current) {
      const enteredSolo = !this.props.group && this.props.accountID === current.enteredBy.id;
      if (current.queueID !== this.props.queueID && current.userTag !== this.props.buttonID) {
        // in another queue
        return [getStringTableValue(StringIDPlayButtonAlreadyQueued, this.props.stringTable), false];
      }
      const start = new Date(current.queuedTime);
      if (enteredSolo || isGroupLead) {
        return [
          <>
            {getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
            <div className={SearchingTimerText}>
              {getStringTableValue(StringIDPlayButtonSearching, this.props.stringTable)} <TimeElapsed start={start} />
            </div>
          </>,
          true
        ];
      }
      return [
        <>
          {getStringTableValue(StringIDPlayButtonQueued, this.props.stringTable)}
          <div className={SearchingTimerText}>
            {getStringTableValue(StringIDPlayButtonSearching, this.props.stringTable)} <TimeElapsed start={start} />
          </div>
        </>,
        false
      ];
    }

    const queue = this.props.queues.find((q) => q.queueID === this.props.queueID);
    if (!queue) {
      return [getStringTableValue(StringIDPlayQueueNotFound, this.props.stringTable), false];
    }

    const numPlayers = this.props.group?.size ?? 1;
    if (queue.maxEntrySize < numPlayers || queue.minEntrySize > numPlayers) {
      return [getStringTableValue(StringIDPlayInvalidGroupSize, this.props.stringTable), false];
    }

    if (this.props.group && !isGroupLead) {
      return [this.props.playText, false];
    }

    return [this.props.playText, true];
  }

  private canClick(): boolean {
    return !hasRequest(this.props.requests);
  }

  private onClick(): void {
    if (!this.canClick()) {
      return;
    }
    if (this.props.currentEntry) {
      this.props.dispatch(leaveQueue(this.props.currentEntry.entryID));
      return;
    }

    this.props.dispatch(enterQueue({ queueID: this.props.queueID, userTag: this.props.buttonID }));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepadInMainMenu } = state.baseGame;
  const accountID = state.user.id;
  const { currentEntry, queues, access, requests } = state.match;
  const { group } = state.teamJoin;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    accountID,
    access,
    requests,
    currentEntry,
    group,
    queues,
    usingGamepadInMainMenu,
    stringTable
  };
}

export const PlayButton = connect(mapStateToProps)(APlayButton);
