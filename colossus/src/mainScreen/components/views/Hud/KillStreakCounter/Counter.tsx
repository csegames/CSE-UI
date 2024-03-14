/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { KillStreakCounterData } from '.';
import { game } from '@csegames/library/dist/_baseGame';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';

const ANIMATION_DURATION = 0.3;
const MESSAGE_ANIMATION_DURATION = 5;
const KillStreakCounterContainer = 'KillStreakCounter-KillStreakCounterContainer';
const Kills = 'KillStreakCounter-Kills';
const Content = 'KillStreakCounter-Content';
const BG = 'KillStreakCounter-BG';
const Text = 'KillStreakCounter-Text';
const BarContainer = 'KillStreakCounter-BarContainer';
const Fill = 'KillStreakCounter-Fill';

const Message = 'KillStreakCounter-Message';

const StringIDHUDKillCounterKills = 'HUDKillCounterKills';
const StringIDHUDKillCounterLevel1 = 'HUDKillCounterLevel1';
const StringIDHUDKillCounterLevel2 = 'HUDKillCounterLevel2';
const StringIDHUDKillCounterLevel3 = 'HUDKillCounterLevel3';
const StringIDHUDKillCounterLevel4 = 'HUDKillCounterLevel4';
const StringIDHUDKillCounterLevel5 = 'HUDKillCounterLevel5';
const StringIDHUDKillCounterLevel6 = 'HUDKillCounterLevel6';
const StringIDHUDKillCounterLevel7 = 'HUDKillCounterLevel7';
const StringIDHUDKillCounterLevel8 = 'HUDKillCounterLevel8';
const StringIDHUDKillCounterLevel9 = 'HUDKillCounterLevel9';
const StringIDHUDKillCounterLevel10 = 'HUDKillCounterLevel10';

export interface ReactProps {
  killStreakCounter: KillStreakCounterData;
  onTimerFinish: () => void;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

export interface State {
  timerProgress: number;
  shouldPlayNumberChangeAnimation: boolean;
  shouldPlayBigNumberAnimation: boolean;
  shouldPlayMessageAnimation: boolean;
  killStreakMessage: string;
}

export class ACounter extends React.Component<Props, State> {
  private timerHandle: number;
  private playSlideHandle: number;
  private playBigNumberHandle: number;
  private playMessageHandle: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      timerProgress: 0,
      shouldPlayNumberChangeAnimation: false,
      shouldPlayBigNumberAnimation: false,
      shouldPlayMessageAnimation: false,
      killStreakMessage: ''
    };
  }

  public render() {
    const slideAnimationClass = this.state.shouldPlayNumberChangeAnimation ? 'animation' : '';
    const bigNumberAnimationClass = this.state.shouldPlayBigNumberAnimation ? 'bigNumber' : '';
    const messageAnimationClass = this.state.shouldPlayMessageAnimation ? 'animation' : '';
    const color = this.getColor();

    const messageTextShadow = `
      ${color} 0px 0px 20px,
      ${color} 0px 0px 30px,
      ${color} 0px 0px 40px,
      ${color} 0px 0px 50px,
      ${color} 0px 0px 75px`;

    return (
      <div className={KillStreakCounterContainer}>
        <div
          className={`${BG} ${bigNumberAnimationClass}`}
          style={{ background: `linear-gradient(to left, ${color}, transparent 90%)` }}
        />
        <div className={Content}>
          <div className={`${Kills} ${slideAnimationClass} ${bigNumberAnimationClass}`}>
            {this.props.killStreakCounter.newCount}
          </div>
          <div className={Text}>{getStringTableValue(StringIDHUDKillCounterKills, this.props.stringTable)}</div>
        </div>
        <div className={BarContainer}>
          <div className={Fill} style={{ width: `${this.state.timerProgress}%` }} />
        </div>
        <div className={`${Message} ${messageAnimationClass}`} style={{ textShadow: messageTextShadow }}>
          {this.state.killStreakMessage}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.timerHandle = window.setInterval(this.updateTimer, 30);
    this.checkForBGAnimation();
    this.checkForMessage();
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.killStreakCounter.newCount !== this.props.killStreakCounter.newCount) {
      window.clearInterval(this.timerHandle);
      this.timerHandle = null;

      this.timerHandle = window.setInterval(this.updateTimer, 30);

      this.playNumberChangeAnimation();

      this.checkForBGAnimation(prevProps);
      this.checkForMessage(prevProps);
    }
  }

  private checkForBGAnimation = (prevProps?: Props) => {
    if ((!prevProps || prevProps.killStreakCounter.newCount < 10) && this.props.killStreakCounter.newCount >= 10) {
      this.playBGAnimation();
    } else if (
      (!prevProps || prevProps.killStreakCounter.newCount < 100) &&
      this.props.killStreakCounter.newCount >= 100
    ) {
      this.playBGAnimation();
    } else if (
      (!prevProps || prevProps.killStreakCounter.newCount < 300) &&
      this.props.killStreakCounter.newCount >= 300
    ) {
      this.playBGAnimation();
    } else if (
      (!prevProps || prevProps.killStreakCounter.newCount < 600) &&
      this.props.killStreakCounter.newCount >= 600
    ) {
      this.playBGAnimation();
    }
  };

  private checkForMessage = (prevProps?: Props) => {
    let message = '';
    if ((!prevProps || prevProps.killStreakCounter.newCount < 10) && this.props.killStreakCounter.newCount >= 10) {
      message = getStringTableValue(StringIDHUDKillCounterLevel1, this.props.stringTable);
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 50) && this.props.killStreakCounter.newCount >= 50) {
      message = getStringTableValue(StringIDHUDKillCounterLevel2, this.props.stringTable);
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 100) && this.props.killStreakCounter.newCount >= 100) {
      message = getStringTableValue(StringIDHUDKillCounterLevel3, this.props.stringTable);
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 150) && this.props.killStreakCounter.newCount >= 150) {
      message = getStringTableValue(StringIDHUDKillCounterLevel4, this.props.stringTable);
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 200) && this.props.killStreakCounter.newCount >= 200) {
      message = getStringTableValue(StringIDHUDKillCounterLevel5, this.props.stringTable);
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 250) && this.props.killStreakCounter.newCount >= 250) {
      message = getStringTableValue(StringIDHUDKillCounterLevel6, this.props.stringTable);
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 300) && this.props.killStreakCounter.newCount >= 300) {
      message = getStringTableValue(StringIDHUDKillCounterLevel7, this.props.stringTable);
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 400) && this.props.killStreakCounter.newCount >= 400) {
      message = getStringTableValue(StringIDHUDKillCounterLevel8, this.props.stringTable);
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 600) && this.props.killStreakCounter.newCount >= 600) {
      message = getStringTableValue(StringIDHUDKillCounterLevel9, this.props.stringTable);
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 1000) && this.props.killStreakCounter.newCount >= 1000) {
      message = getStringTableValue(StringIDHUDKillCounterLevel10, this.props.stringTable);
    }

    if (message !== '') {
      this.playMessageAnimation(message);
    }
  };

  private playNumberChangeAnimation = () => {
    window.clearTimeout(this.playSlideHandle);
    this.setState({ shouldPlayNumberChangeAnimation: true });

    this.playSlideHandle = window.setTimeout(() => {
      this.setState({ shouldPlayNumberChangeAnimation: false });
    }, ANIMATION_DURATION * 1000);
  };

  private playBGAnimation = () => {
    window.clearTimeout(this.playBigNumberHandle);
    this.setState({ shouldPlayBigNumberAnimation: true });

    this.playBigNumberHandle = window.setTimeout(() => {
      this.setState({ shouldPlayBigNumberAnimation: false });
    }, ANIMATION_DURATION * 1000);
  };

  private playMessageAnimation = (message: string) => {
    window.clearTimeout(this.playMessageHandle);
    if (this.state.shouldPlayMessageAnimation) {
      this.setState({ shouldPlayMessageAnimation: false, killStreakMessage: '' });
      window.setTimeout(() => this.setState({ shouldPlayMessageAnimation: true, killStreakMessage: message }), 5);
    } else {
      this.setState({ shouldPlayMessageAnimation: true, killStreakMessage: message });
    }

    this.playMessageHandle = window.setTimeout(() => {
      this.setState({ shouldPlayMessageAnimation: false, killStreakMessage: '' });
    }, MESSAGE_ANIMATION_DURATION * 1000);
  };

  private updateTimer = () => {
    let currentProgress = this.getCurrentProgress();
    if (currentProgress > 100) {
      currentProgress = 100;
    }

    this.setState({ timerProgress: currentProgress });

    if (currentProgress <= 0) {
      this.props.onTimerFinish();

      window.clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  };

  private getCurrentProgress = () => {
    const { killStreakCounter } = this.props;
    const elapsed = game.worldTime - killStreakCounter.newTimerStart;
    let current = killStreakCounter.newTimerMax - elapsed;
    if (current < 0) {
      current = 0;
    }
    return (current / killStreakCounter.newTimerMax) * 100;
  };

  private getColor = () => {
    const { newCount } = this.props.killStreakCounter;
    let color = '';
    if (newCount < 10) {
      color = 'transparent';
    } else if (newCount < 20) {
      color = '#666666';
    } else if (newCount < 50) {
      color = '#ff0000';
    } else if (newCount < 100) {
      color = '#8d0000';
    } else {
      color = '#000000';
    }

    return color;
  };
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const Counter = connect(mapStateToProps)(ACounter);
