/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {connect, Provider} from 'react-redux';
import {muteSounds, unMuteSounds} from './redux/modules/sounds';
import {muteMusic, unMuteMusic} from './redux/modules/music';
import * as events from '../../../shared/lib/events';


function select(state: any): any {
  return {
    soundMuted: state.soundMuted,
    musicMuted: state.musicMuted,
  }
}

// since we're using redux all props are optional in the TypeScript interface
// since redux fills it out at runtime rather than props being passed in from
// a parent component
//
// Props will match what is returned from select() plust a dispatch function
export interface SoundProps {
  dispatch?: (action: any) => void;
  soundMuted?: boolean;
  musicMuted?: boolean;
}

export interface SoundState { };

export class Sound extends React.Component<SoundProps, SoundState> {
  public name = 'cse-patcher-sound';
  private playOnce = false;

  getSound(name: string): HTMLAudioElement {
    return this.refs[name] as HTMLAudioElement;
  }

  playSound(name: string) {
    if (!this.props.soundMuted) {
      let sound = this.getSound(name);
      if (sound) {
        sound.play();
        sound.volume = 0.75;
      }
    }
  }

  componentDidUpdate() {
    let soundBg = this.getSound('sound-bg');
    if (soundBg) {
      if (this.props.musicMuted && !soundBg.paused) {
        soundBg.pause();
      } else if (!this.props.musicMuted && soundBg.paused && !this.playOnce) {
        soundBg.play();
        soundBg.volume = 0.5;
      }
    }
  }

  componentDidMount() {
    let soundBg = this.getSound('sound-bg');
    if (soundBg) {
      if (!this.props.musicMuted) {
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
        <audio src='sounds/patcher-theme-v0.1.ogg' ref='sound-bg' />
      </div>
    );
  }
};

export default connect(select)(Sound);
