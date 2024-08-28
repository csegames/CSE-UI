/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../shared/Button';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Overlay, hideOverlay } from '../../redux/navigationSlice';
import { Queue, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import {
  StringIDGeneralClose,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../helpers/stringTableHelpers';
import { getDefaultQueueGameModeDef, selectQueue } from '../../redux/matchSlice';
import dateFormat from 'dateformat';
import { GameModeDef } from '../../dataSources/manifest/gameModeManifest';
import { getSelectedQueueID } from '../../helpers/queueHelpers';

const Container = 'GameModeSelectionModal-Container';
const Title = 'GameModeSelectionModal-Title';
const Body = 'GameModeSelectionModal-Body';
const ModesList = 'GameModeSelectionModal-ModesList';
const Mode = 'GameModeSelectionModal-Mode';
const ModeOffline = 'GameModeSelectionModal-ModeOffline';
const ModeImage = 'GameModeSelectionModal-ModeImage';
const BorderOverlay = 'GameModeSelectionModal-BorderOverlay';
const BorderOverlayOffline = 'GameModeSelectionModal-BorderOverlayOffline';
const BorderOverlaySelected = 'GameModeSelectionModal-BorderOverlaySelected';
const ModeImageOffline = 'GameModeSelectionModal-ModeImageOffline';
const ModeContent = 'GameModeSelectionModal-ModeContent';
const ModeOfflineText = 'GameModeSelectionModal-ModeOfflineText';
const ModeName = 'GameModeSelectionModal-ModeName';
const ModeDescription = 'GameModeSelectionModal-ModeDescription';
const ModePlayers = 'GameModeSelectionModal-ModePlayers';
const ButtonRow = 'GameModeSelectionModal-ButtonRow';
const CloseButton = 'GameModeSelectionModal-CloseButton';

const StringIDPlayModeOverlayHeading = 'PlayModeOverlayHeading';
const StringIDPlayModeOverlayDescription = 'PlayModeOverlayDescription';
const StringIDPlayModeOverlayPlayersSingular = 'PlayModeOverlayPlayersSingular';
const StringIDPlayModeOverlayPlayersPlural = 'PlayModeOverlayPlayersPlural';
const StringIDPlayModeOverlayPlayersRange = 'PlayModeOverlayPlayersRange';
const StringIDPlayModeOverlayOffline = 'PlayModeOverlayOffline';
const StringIDPlayModeOverlayOfflineDate = 'PlayModeOverlayOfflineDate';

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  queues: Queue[];
  selectedQueueID: string | null;
  defaultQueueID: string | null;
  gameModes: Dictionary<GameModeDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AGameModeSelectionModal extends React.Component<Props> {
  public render() {
    const queues = this.props.queues.filter(
      (queue) => this.props.gameModes[queue.displayAlias] && queue.queueID !== this.props.defaultQueueID
    );
    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)} heightOverride='80vmin'>
        <div className={Container}>
          <div className={Title}>{getStringTableValue(StringIDPlayModeOverlayHeading, this.props.stringTable)}</div>
          <div className={Body}>{getStringTableValue(StringIDPlayModeOverlayDescription, this.props.stringTable)}</div>
        </div>
        <div className={ModesList}>
          {this.props.defaultQueueID &&
            this.renderGameMode(
              this.props.defaultQueueID,
              getDefaultQueueGameModeDef(this.props.defaultQueueID),
              true,
              null,
              null,
              null
            )}
          {queues.map((queue) =>
            this.renderGameMode(
              queue.queueID,
              this.props.gameModes[queue.displayAlias],
              queue.enabled,
              queue.nextStatusChange,
              queue.minEntrySize,
              queue.maxEntrySize
            )
          )}
        </div>
        <div className={ButtonRow}>
          <Button
            type='blue'
            text={getStringTableValue(StringIDGeneralClose, this.props.stringTable)}
            styles={CloseButton}
            onClick={this.onClose.bind(this)}
          />
        </div>
      </MiddleModalDisplay>
    );
  }

  private renderGameMode(
    queueID: string,
    gameMode: GameModeDef,
    enabled: boolean,
    nextStatusChange: string | null,
    minEntrySize: number | null,
    maxEntrySize: number | null
  ): JSX.Element {
    const isSelected =
      queueID === getSelectedQueueID(this.props.selectedQueueID, this.props.defaultQueueID, this.props.queues);
    const borderOverlayClassNames = [BorderOverlay];
    if (!enabled) {
      borderOverlayClassNames.push(BorderOverlayOffline);
    }
    if (isSelected) {
      borderOverlayClassNames.push(BorderOverlaySelected);
    }
    return (
      <div
        className={!enabled ? `${Mode} ${ModeOffline}` : Mode}
        onClick={() => {
          if (enabled) {
            this.props.dispatch(selectQueue(queueID));
          }
        }}
        key={queueID}
      >
        <img className={!enabled ? `${ModeImage} ${ModeImageOffline}` : ModeImage} src={gameMode.cardImage} />
        <div className={borderOverlayClassNames.join(' ')} />
        <div className={ModeContent}>
          {!enabled && (
            <span className={ModeOfflineText}>
              {getStringTableValue(StringIDPlayModeOverlayOffline, this.props.stringTable)}
              {nextStatusChange && (
                <>
                  <br />
                  {getTokenizedStringTableValue(StringIDPlayModeOverlayOfflineDate, this.props.stringTable, {
                    DATE: dateFormat(nextStatusChange, 'mmmm dS, yyyy')
                  })}
                </>
              )}
            </span>
          )}
          <span className={ModeName}>{gameMode.name}</span>
          <span className={ModeDescription}>{gameMode.description}</span>
          <span className={ModePlayers}>{this.getPlayers(minEntrySize, maxEntrySize)}</span>
        </div>
      </div>
    );
  }

  private onClose(): void {
    this.props.dispatch(hideOverlay(Overlay.GameModeSelection));
  }

  private getPlayers(minEntrySize: number | null, maxEntrySize: number | null): string {
    if (maxEntrySize === minEntrySize) {
      if (maxEntrySize === 1) {
        return getStringTableValue(StringIDPlayModeOverlayPlayersSingular, this.props.stringTable);
      } else {
        return getTokenizedStringTableValue(StringIDPlayModeOverlayPlayersPlural, this.props.stringTable, {
          PLAYERS: maxEntrySize !== null ? String(maxEntrySize) : '???'
        });
      }
    } else {
      return getTokenizedStringTableValue(StringIDPlayModeOverlayPlayersRange, this.props.stringTable, {
        MIN: minEntrySize !== null ? String(minEntrySize) : '???',
        MAX: maxEntrySize !== null ? String(maxEntrySize) : '???'
      });
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const { queues, selectedQueueID, defaultQueueID, gameModes } = state.match;
  return {
    ...ownProps,
    stringTable,
    queues,
    selectedQueueID,
    defaultQueueID,
    gameModes
  };
}

export const GameModeSelectionModal = connect(mapStateToProps)(AGameModeSelectionModal);
