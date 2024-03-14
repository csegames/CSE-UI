/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import '../../loadingScreen-styles.scss';

import * as React from 'react';

// The loading system purposely doesn't depend on the game object because it isn't available
// during the start of our loading process. It also is not safe to refer to any main screen
// content.

import {
  LoadingScreenReason,
  LoadingScreenState
} from '@csegames/library/dist/_baseGame/clientFunctions/LoadingScreenFunctions';
import { clientAPI } from '@csegames/library/dist/hordetest/LoadingScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';

const Container = 'LoadingScreen-Container';
const Logo = 'LoadingScreen-Logo';
const LoadingTextPosition = 'LoadingScreen-LoadingTextPosition';
const Text = 'LoadingScreen-Text';
const HintContainer = 'LoadingScreen-HintContainer';
const HintText = 'LoadingScreen-HintText';
const Sprite = 'LoadingScreen-Sprite';

const SHOW_HINT_TIME: number = 7000;

interface State {
  loadingState: LoadingScreenState;
  hintID: number;
}

interface ReactProps {
  backgroundImageURL: string;
  showLogo: boolean;
  initialMessage?: string;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

export class LoadingScreen extends React.Component<Props, State> {
  private loadingStateHandle: ListenerHandle;
  private cycleHintInterval: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      loadingState: { message: props.initialMessage, reason: LoadingScreenReason.Initialization, visible: true },
      hintID: -1
    };
    // preload our background image by creating and immediately discarding a one pixel image unattached to the DOM
    const img = new Image(1, 1);
    img.src = this.props.backgroundImageURL;
  }

  public render() {
    if (!this.state.loadingState?.visible) {
      return null;
    }

    const logo = this.props.showLogo ? <div className={Logo}></div> : null;

    const hints = this.state.loadingState?.hints ? (
      <div className={HintContainer}>
        <div className={HintText}>
          <span>{this.getHintCurrentDescription()}</span>
        </div>
      </div>
    ) : null;

    return (
      <div
        id='loadingScreen'
        className={Container}
        style={{ backgroundImage: `url("${this.props.backgroundImageURL}")` }}
      >
        {logo}
        <div className={LoadingTextPosition}>
          <div className={Text}>{this.state.loadingState.message}</div>
          <img className={Sprite} src='images/fullscreen/loadingscreen/loading-anim.gif' />
        </div>
        {hints}
        {this.props.children}
      </div>
    );
  }

  public componentDidMount() {
    this.loadingStateHandle = clientAPI.bindLoadingScreenListener((loadingState: LoadingScreenState) => {
      const hintID = this.state.hintID >= 0 ? this.state.hintID : this.pickNextHint(loadingState, -1);
      this.setState({ loadingState, hintID });
    });

    this.setHintCycleInterval();
  }

  public componentWillUnmount() {
    this.loadingStateHandle.close();
    this.loadingStateHandle = null;

    if (this.cycleHintInterval) {
      window.clearInterval(this.cycleHintInterval);
      this.cycleHintInterval = null;
    }
  }

  private getHintCurrentDescription(): string {
    if (this.state.loadingState?.hints) {
      const hint = this.state.loadingState.hints[this.state.hintID];
      if (hint) {
        return hint.description;
      }
    }

    return 'Each champion has their own unique set of abilities';
  }

  private pickNextHint(loadingState: LoadingScreenState, currentHintID: number): number {
    if (!loadingState?.hints) {
      return -1;
    }

    const availableHintCount = Object.keys(loadingState.hints).length;
    if (availableHintCount <= 1) {
      return 0;
    }

    if (currentHintID < 0) {
      // first hint - just pick one randomly
      const randomMax = availableHintCount - 1;
      return Math.floor(Math.random() * randomMax);
    } else {
      // pick a new hint, but always one other then the last one we just showed.
      // to do this pick from a random which is one less the the normal range to account
      // for the value we'll never want to pick
      const randomMax = availableHintCount - 2;
      const nextRandom = Math.floor(Math.random() * randomMax);
      return nextRandom < currentHintID ? nextRandom : nextRandom + 1;
    }
  }

  private setHintCycleInterval() {
    if (this.cycleHintInterval) {
      return;
    }

    this.cycleHintInterval = window.setInterval(() => {
      if (!this.state.loadingState.visible) return;
      this.setState({ hintID: this.pickNextHint(this.state.loadingState, this.state.hintID) });
    }, SHOW_HINT_TIME);
  }
}
