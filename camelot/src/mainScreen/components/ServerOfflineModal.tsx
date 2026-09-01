/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { Faction } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { RootState } from '../redux/store';
import { LoadingTopic } from '../redux/loadingSlice';
import { hideModalById, ModalParams, showModal } from '../redux/modalsSlice';
import { BorderBackground, BorderType, FactionBorder } from './FactionBorder';
import { FactionButton } from './FactionButton';
import { WaitingEllipsis } from './WaitingEllipsis';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { ConnectionStatus } from '@csegames/library/dist/_baseGame/types/ConnectionStatus';

const MODAL_ID = 'ServerOffline';

const StringIDServerOfflineMessage = 'ServerOfflineMessage';
const StringIDServerOfflineWaiting = 'ServerOfflineWaiting';
const StringIDCharacterManagementExitGame = 'CharacterManagementExitGame';

const ModalContainer = 'HUD-ModalPane-DefaultModalContainer';
const ContentRoot = 'HUD-ModalPane-ContentRoot';
const MessageText = 'HUD-ModalPane-MessageText';
const Buttons = 'HUD-ServerOfflineModal-Buttons';

interface ContentProps {
  stringTable: Record<string, StringTableEntryDef>;
}

// The modal body is its own connected component so it reads the string table from
// its own props — reliable and live — rather than from a stored closure.
class AServerOfflineModalContent extends React.Component<ContentProps> {
  render(): React.ReactNode {
    return (
      <FactionBorder
        className={ModalContainer}
        factionIDOverride={Faction.Arthurian}
        type={BorderType.Secondary}
        background={BorderBackground.PatternLarge}
      >
        <div className={ContentRoot}>
          <div className={MessageText}>{getStringTableValue(StringIDServerOfflineMessage, this.props.stringTable)}</div>
          <WaitingEllipsis label={getStringTableValue(StringIDServerOfflineWaiting, this.props.stringTable)} />
          <div className={Buttons}>
            <FactionButton
              factionIDOverride={Faction.Arthurian}
              onClick={() => {
                clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_GENERIC_SELECT);
                clientAPI.quit();
              }}
            >
              {getStringTableValue(StringIDCharacterManagementExitGame, this.props.stringTable)}
            </FactionButton>
          </div>
        </div>
      </FactionBorder>
    );
  }
}

const ServerOfflineModalContent = connect(
  (state: RootState): ContentProps => ({
    stringTable: state.stringTable.stringTable
  })
)(AServerOfflineModalContent);

interface ReactProps {}

interface InjectedProps {
  modals: ModalParams[];
  connectionStatus: ConnectionStatus;
  componentStatus: Record<string, boolean | null>;
}

type Props = ReactProps & InjectedProps;

class AServerOfflineModal extends React.Component<Props & DispatchProp> {
  render(): React.ReactNode {
    return null;
  }

  componentDidMount(): void {
    this.syncModal();
  }

  componentDidUpdate(): void {
    this.syncModal();
  }

  private syncModal(): void {
    const { componentStatus, connectionStatus, modals } = this.props;
    // Confirmed shard query failure (tri-state: null = loading, true = ok, false = failed)
    const isShardOffline = componentStatus[LoadingTopic.ShardCharacters] === false;
    // Don't show the modal if we're in serverless mode
    const shouldShow = connectionStatus !== ConnectionStatus.Offline && isShardOffline;
    const isShown = modals.some((modal) => modal.id === MODAL_ID);

    if (shouldShow != isShown) {
      this.props.dispatch(shouldShow ? showModal(this.buildModal()) : hideModalById(MODAL_ID));
    }
  }

  private buildModal(): ModalParams {
    return {
      id: MODAL_ID,
      escapable: false,
      content: () => <ServerOfflineModalContent />
    };
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const modals = state.modals.modals;
  const { componentStatus, connectionStatus } = state.loading;
  return {
    ...ownProps,
    modals,
    componentStatus,
    connectionStatus
  };
}

export const ServerOfflineModal = connect(mapStateToProps)(AServerOfflineModal);
