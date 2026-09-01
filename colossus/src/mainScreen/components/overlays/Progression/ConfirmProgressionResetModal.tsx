/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as webAPI from '@csegames/library/dist/hordetest/webAPI/definitions';

import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { connect } from 'react-redux';
import { StringTableEntryDef } from '../../../dataSources/manifest/stringTableManifest';
import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../../redux/store';
import { MiddleModalDisplay } from '../../shared/MiddleModalDisplay';
import { getStringTableValue, StringIDGeneralCancel, StringIDGeneralReset } from '../../../helpers/stringTableHelpers';
import { Button } from '../../shared/Button';
import { hideOverlay, Overlay } from '../../../redux/navigationSlice';
import { webConf } from '../../../dataSources/networkConfiguration';
import { refreshProfile } from '../../../dataSources/profileNetworking';
import { ChampionDef } from '../../../dataSources/manifest/championManifest';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const Title = 'ConfirmProgressionReset-Title';
const Message = 'ConfirmProgressionReset-Message';
const ButtonsContainer = 'ConfirmProgressionReset-ButtonsContainer';
const ButtonStyles = 'ConfirmProgressionReset-ButtonStyles';

const StringIDTitle = 'ConfirmProgressionResetTitle';
const StringIDMessage = 'ConfirmProgressionResetMessage';

interface ReactProps {}

interface InjectedProps {
  displayName?: string;
  stringTable: Dictionary<StringTableEntryDef>;
  selectedChampion: ChampionDef;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AConfirmProgressionResetModal extends React.Component<Props> {
  public render(): React.ReactNode {
    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)} heightOverride={'unset'}>
        <div className={Title}>{getStringTableValue(StringIDTitle, this.props.stringTable)}</div>
        <div className={Message}>{getStringTableValue(StringIDMessage, this.props.stringTable)}</div>
        <div className={ButtonsContainer}>
          <Button
            type={'blue-outline'}
            text={getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
            onClick={this.onCancelClick.bind(this)}
            styles={ButtonStyles}
          />
          <Button
            type={'blue'}
            text={getStringTableValue(StringIDGeneralReset, this.props.stringTable)}
            onClick={this.resetProgression.bind(this)}
            styles={ButtonStyles}
          />
        </div>
      </MiddleModalDisplay>
    );
  }

  private async resetProgression(): Promise<void> {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CLICK);
    await webAPI.ProfileAPI.RespecChampionProgression(webConf, this.props.selectedChampion.id);
    refreshProfile();
    this.onClose();
  }

  private onCancelClick(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CLICK);
    this.onClose();
  }

  private onClose(): void {
    this.props.dispatch(hideOverlay(Overlay.ConfirmProgressionReset));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { displayName } = state.user;
  const { stringTable } = state.stringTable;
  const { selectedChampion } = state.championInfo;

  return {
    ...ownProps,
    displayName,
    stringTable,
    selectedChampion
  };
}

export const ConfirmProgressionResetModal = connect(mapStateToProps)(AConfirmProgressionResetModal);
