/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* TODO_ANIMATION_REACTOR 

import * as React from 'react';
import { KillStreakCounterData } from '.';
import { game } from '@csegames/library/dist/_baseGame';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { KillStreakDef } from '../../../../dataSources/manifest/killStreakManifest';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { StringTableEntryDef } from '../../../../dataSources/manifest/stringTableManifest';

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

export interface ReactProps {
  killStreakCounter: KillStreakCounterData;
  onTimerFinish: () => void;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  killStreaks: KillStreakDef[];
}

type Props = ReactProps & InjectedProps;

export interface State {
  timerProgress: number;
  shouldPlayNumberChangeAnimation: boolean;
  shouldPlayBigNumberAnimation: boolean;
  shouldPlayMessageAnimation: boolean;
  killStreak: KillStreakDef;
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
      killStreak: null
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
          {this.state.killStreak?.text}
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

  private killStreakIndex(killCount: number): number {
    for (let i = this.props.killStreaks.length - 1; i >= 0; --i) {
      if (killCount >= this.props.killStreaks[i].killCount) {
        return i;
      }
    }

    return -1;
  }

  private checkForMessage = (prevProps?: Props) => {
    const prevIndex = !prevProps ? -1 : this.killStreakIndex(prevProps.killStreakCounter.newCount);
    const newIndex = this.killStreakIndex(this.props.killStreakCounter.newCount);

    if (newIndex != prevIndex && newIndex != -1) {
      this.playMessageAnimation(this.props.killStreaks[newIndex]);
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

  private playMessageAnimation = (killStreakDef: KillStreakDef) => {
    window.clearTimeout(this.playMessageHandle);
    if (this.state.shouldPlayMessageAnimation) {
      this.setState({ shouldPlayMessageAnimation: false, killStreak: null });
      window.setTimeout(() => {
        if (killStreakDef.audioEventID) {
          clientAPI.playGameSound(killStreakDef.audioEventID);
        }
        this.setState({ shouldPlayMessageAnimation: true, killStreak: killStreakDef });
      }, 5);
    } else {
      if (killStreakDef.audioEventID) {
        clientAPI.playGameSound(killStreakDef.audioEventID);
      }
      this.setState({ shouldPlayMessageAnimation: true, killStreak: killStreakDef });
    }

    this.playMessageHandle = window.setTimeout(() => {
      this.setState({ shouldPlayMessageAnimation: false, killStreak: null });
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
  const { killStreaks } = state.game;

  return {
    ...ownProps,
    stringTable,
    killStreaks
  };
}

export const Counter = connect(mapStateToProps)(ACounter);

*/