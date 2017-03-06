/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-06 17:53:23
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-06 18:41:29
 */

import * as React from 'react';
import {events} from 'camelot-unchained';

import {SoundsState} from '../../services/session/sounds';

export interface SoundProps {
  soundsState: SoundsState;
}

export interface SoundState { };

export class Sound extends React.Component<SoundProps, SoundState> {
  public name = 'cse-patcher-sound';
  private playOnce = false;

  getSound(name: string): HTMLAudioElement {
    return this.refs[name] as HTMLAudioElement;
  }

  playSound(name: string) {
    if (this.props.soundsState.playSound) {
      let sound = this.getSound(name);
      if (sound) {
        sound.play();
        sound.volume = 0.5;
      }
    }
  }

  componentDidUpdate() {
    let soundBg = this.getSound('sound-bg');
    if (soundBg) {
      if (!this.props.soundsState.playMusic && !soundBg.paused) {
        soundBg.pause();
      } else if (this.props.soundsState.playMusic && soundBg.paused && !this.playOnce) {
        soundBg.play();
        soundBg.volume = 0.5;
      }
    }
  }

  componentDidMount() {
    let soundBg = this.getSound('sound-bg');
    if (soundBg) {
      if (this.props.soundsState.playMusic) {
        soundBg.play();
        soundBg.volume = 0.5;
      }
      soundBg.onended = () => this.playOnce = true;
    }
    events.on('play-sound', (info: any) => this.playSound('sound-' + info));
  }

  componentDidUnMount() {
    events.off('play-sound');
  }

  render() {
    return (
      <div>
        <audio src='sounds/select.ogg' ref='sound-select' />
        <audio src='sounds/launch-game.ogg' ref='sound-launch-game' />
        <audio src='sounds/patch-complete.ogg' ref='sound-patch-complete' />
        <audio src='sounds/patcher-theme.ogg' ref='sound-bg' />
      </div>
    );
  }
};

export default Sound;
