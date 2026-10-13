/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { hideModalById } from '../redux/modalsSlice';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
} from '../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { FactionBorder, BorderType, BorderBackground } from './FactionBorder';
import { FactionButton } from './FactionButton';
import { FormattedTextDiv } from '../../shared/components/FormattedTextDiv';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import Escapable from './Escapable'
import { ConnectionStatus } from '@csegames/library/dist/_baseGame/types/ConnectionStatus';

// CSS classes
const Root = 'HUD-LoggingOut-Root';
const Buttons = 'HUD-LoggingOut-Buttons';
const Button = 'HUD-LoggingOut-Button';
const CountdownContainer = 'HUD-LoggingOut-CountdownContainer';
const CountdownText = 'HUD-LoggingOut-CountdownText';
const CountdownNumber = 'HUD-LoggingOut-CountdownNumber';

// String IDs
const StringIDLoggingOutTitle = 'LoggingOutTitle';
const StringIDCancel = 'GeneralCancel';
const StringIDGameMenuQuit = 'GameMenuQuit';
const StringIDLoggingOutTimer = 'LoggingOutTimer';

interface State {
  animationHandle: ListenerHandle;
  worldTimeSeconds: number;
}

interface ReactProps {
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  logoutCompleteTime: number;
  connectionStatus: ConnectionStatus;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ALoggingOut extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { worldTimeSeconds: 0, animationHandle: clientAPI.startAnimation(this.animate.bind(this)) };
  }

  render(): JSX.Element | null {
    if (!this.shouldShow()) {
      return null;
    }

    const logoutCompleteSecondsLeft = Math.max(0, this.props.logoutCompleteTime - this.state.worldTimeSeconds);

    return (
      <FactionBorder
        className={Root}
        type={BorderType.Decorative}
        background={BorderBackground.PatternLarge}
        titleText={getStringTableValue(StringIDLoggingOutTitle, this.props.stringTable)}
      >
        <FormattedTextDiv
          text={getTokenizedStringTableValue(StringIDLoggingOutTimer, this.props.stringTable, {
            SECONDS: logoutCompleteSecondsLeft.toFixed(0)
          })}
          textAlign={'center'}
          className={CountdownContainer}
          textClasses={[CountdownText, CountdownNumber]}
          nodes={[]}
        />
        <div className={Buttons}>
          <FactionButton className={Button} onClick={this.quitGame.bind(this)}>
            {getStringTableValue(StringIDGameMenuQuit, this.props.stringTable)}
          </FactionButton>
          <FactionButton className={Button} onClick={this.cancelLogout.bind(this)}>
            {getStringTableValue(StringIDCancel, this.props.stringTable)}
          </FactionButton>
        </div>
        <Escapable
          escapeID={MODAL_ID_LOGGINGOUT}
          onEscape={this.cancelLogout.bind(this)}
        />
      </FactionBorder>
    );
  }

  private animate(data: AnimationData, _: DOMHighResTimeStamp): void {
    // animate() triggers every frame, but we only need to update once per second.
    // Using a half second because we don't update regularly enough, so sometimes we were skipping
    // display for one of the seconds.
    if (data.worldTime >= this.state.worldTimeSeconds + 0.5) {
      this.setState({ worldTimeSeconds: data.worldTime });
    }
  }

  componentWillUnmount(): void {
    if (this.state.animationHandle) {
      this.state.animationHandle.close();
    }
  }

  componentDidUpdate(): void {
    if (!this.shouldShow()) {
      this.props.dispatch(hideModalById(MODAL_ID_LOGGINGOUT));
    }
  }

  private cancelLogout(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_SELECT);
    clientAPI.cancelLogout();
    this.props.dispatch(hideModalById(MODAL_ID_LOGGINGOUT));
  }

  private quitGame(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_SELECT);
    clientAPI.quit();
  }

  private shouldShow(): boolean {
    return this.props.connectionStatus === ConnectionStatus.Connected && !!this.props.logoutCompleteTime;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    logoutCompleteTime: state.entities.self?.logoutCompleteTime ?? 0,
    connectionStatus: state.loading.connectionStatus
  };
};

export const LoggingOut = connect(mapStateToProps)(ALoggingOut);
export const MODAL_ID_LOGGINGOUT = "LoggingOut";