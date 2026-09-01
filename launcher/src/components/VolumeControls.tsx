/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../redux/store';
import { muteMusic, muteSounds, unmuteMusic, unmuteSounds } from '../redux/soundsSlice';
import { connect, DispatchProp } from 'react-redux';

import Mute from '../images/mute.png';
import Muted from '../images/muted.png';
import MuteFx from '../images/mute-fx.png';
import MutedFx from '../images/muted-fx.png';

const Root = 'Login-VolumeControls-Root';
const ImageButton = 'Login-VolumeControls-ImageButton';

interface ReactProps {}

interface InjectedProps {
  playSound: boolean;
  playMusic: boolean;
}

type Props = ReactProps & InjectedProps;

class AVolumeControls extends React.Component<Props & DispatchProp> {
  public render() {
    return (
      <div className={Root}>
        <img className={ImageButton} src={this.props.playMusic ? Mute : Muted} onClick={this.toggleMusic.bind(this)} />
        <img
          className={ImageButton}
          src={this.props.playSound ? MuteFx : MutedFx}
          onClick={this.toggleSounds.bind(this)}
        />
      </div>
    );
  }

  private toggleSounds() {
    this.props.dispatch(this.props.playSound ? muteSounds() : unmuteSounds());
  }

  private toggleMusic() {
    this.props.dispatch(this.props.playMusic ? muteMusic() : unmuteMusic());
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { playMusic, playSound } = state.sounds;

  return {
    ...ownProps,
    playMusic,
    playSound
  };
}

export const VolumeControls = connect(mapStateToProps)(AVolumeControls);
