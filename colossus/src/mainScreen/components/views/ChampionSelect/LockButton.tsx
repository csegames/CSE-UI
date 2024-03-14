/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { formatDuration, getServerTimeMS } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { clamp } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

const LockInButton = 'ChampionSelect-LockIn-LockInButton';
const LockInText = 'ChampionSelect-LockIn-LockInText';
const TextContainer = 'ChampionSelect-LockIn-TextContainer';
const ConsoleButton = 'ChampionSelect-LockIn-ConsoleButton';

const ConsoleIcon = 'ChampionSelect-LockIn-ConsoleIcon';

const ButtonContainer = 'LoadingButton-Container';
const ButtonBackground = 'LoadingButton-ButtonBackground';
const ButtonLoad = 'LoadingButton-ButtonLoad';

const ButtonTextContainer = 'LoadingButton-TextContainer';

const StringIDChampionSelectLockIn = 'ChampionSelectLockIn';

interface ReactProps {
  enabled: boolean;
  onClick: () => void;
}

interface InjectedProps {
  created: string;
  durationSeconds: number;
  usingGamepadInMainMenu: boolean;
  stringTable: Dictionary<StringTableEntryDef>;
  serverTimeDeltaMS: number;
}

type Props = ReactProps & InjectedProps;

interface State {
  remaining: number;
  currentPercentage: number;
}

class ALockButton extends React.Component<Props, State> {
  private timerHandle: number = 0;

  constructor(props: Props) {
    super(props);
    this.state = this.calculateState(this.props.created, this.props.durationSeconds);
    if (this.state.remaining > 0) {
      this.timerHandle = window.setInterval(this.tick.bind(this), 60);
    }
  }

  public render(): React.ReactNode {
    return (
      <div
        className={`${ButtonContainer} ${LockInButton} ${this.props.enabled ? '' : 'disabled'}`}
        onClick={this.props.enabled && this.state.remaining > 0 ? this.props.onClick : undefined}
      >
        <div className={ButtonBackground} />
        <div className={ButtonLoad} style={{ width: `${100 - this.state.currentPercentage}%` }} />
        <div className={ButtonTextContainer}>
          <div className={ConsoleButton}>
            <div className={LockInText}>{this.renderText()}</div>
            <div className={TextContainer}>{formatDuration(this.state.remaining)}</div>
          </div>
        </div>
      </div>
    );
  }

  private renderText(): React.ReactNode {
    if (this.props.usingGamepadInMainMenu) {
      return (
        <>
          <span className={`${ConsoleIcon} icon-xb-a`} />{' '}
          {getStringTableValue(StringIDChampionSelectLockIn, this.props.stringTable)}
        </>
      );
    }
    return getStringTableValue(StringIDChampionSelectLockIn, this.props.stringTable);
  }

  private tick(): void {
    const state = this.calculateState(this.props.created, this.props.durationSeconds);
    this.setState(state);
    if (state.remaining <= 0) {
      window.clearInterval(this.timerHandle);
      this.timerHandle = 0;
    }
  }

  private calculateState(created: string, durationSeconds: number): State {
    const elapsed = clamp(
      (getServerTimeMS(this.props.serverTimeDeltaMS) - new Date(created).valueOf()) / 1000,
      0,
      durationSeconds
    );
    const remaining = durationSeconds - elapsed;
    const currentPercentage = (remaining / durationSeconds) * 100;

    return { remaining, currentPercentage };
  }

  public componentWillUnmount() {
    if (this.timerHandle) window.clearInterval(this.timerHandle);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepadInMainMenu } = state.baseGame;
  const { created, durationSeconds } = state.match.currentSelection;
  const { stringTable } = state.stringTable;
  const { serverTimeDeltaMS } = state.clock;

  return {
    ...ownProps,
    created,
    durationSeconds,
    usingGamepadInMainMenu,
    stringTable,
    serverTimeDeltaMS
  };
}

export const LockButton = connect(mapStateToProps)(ALockButton);
