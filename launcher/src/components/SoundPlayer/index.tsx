/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { generateID } from 'redux-typed-modules';

import { SoundsState } from '../../services/session/sounds';
import { ListenerHandle } from '../../lib/ListenerHandle';
import { globalEvents } from '../../lib/EventEmitter';
import { Sound } from '../../lib/Sound';

export interface SoundProps {
  soundsState: SoundsState;
}

export interface SoundState {
  sounds: { [id: string]: Sound };
  paused: boolean;
}

export class SoundPlayer extends React.Component<SoundProps, SoundState> {
  private bgRef: HTMLAudioElement = null;
  private evhs: ListenerHandle[] = []; // event handlers
  private audioRefs: { [id: string]: HTMLAudioElement } = {};

  constructor(props: SoundProps) {
    super(props);
    this.state = {
      sounds: {},
      paused: false
    };
  }

  public render() {
    return (
      <div>
        <audio loop={true} src='sounds/patcher-ambient.ogg' ref={(r) => (this.bgRef = r)} />
        {this.renderAudioElements()}
      </div>
    );
  }

  public componentDidUpdate() {
    if (this.bgRef) {
      const paused = this.state.paused || !this.props.soundsState.playMusic;
      if (paused && !this.bgRef.paused) {
        this.pause(true);
      } else if (!paused && this.bgRef.paused) {
        this.pause(false);
      }
    }
  }

  public componentDidMount() {
    if (this.bgRef) {
      if (this.props.soundsState.playMusic) {
        this.bgRef.play();
        this.bgRef.volume = 0.5;
      }
    }
    this.evhs.push(globalEvents.on('play-sound', (sound: Sound) => this.playSound(sound)));
    this.evhs.push(globalEvents.on('pause-music', (paused: boolean) => this.pauseMusic(paused)));
  }

  public componentWillUnmount() {
    this.evhs.forEach((h: ListenerHandle) => h.close());
  }

  private setStateAsync = (sparseState: any) => {
    window.setTimeout(() => {
      this.setState(sparseState);
    }, 0);
  };

  private playSound(sound: Sound) {
    if (this.props.soundsState.playSound) {
      const sounds = this.state.sounds;
      // Grab dupe sound if any
      let dupeSoundId = '';
      Object.keys(sounds).forEach((key) => {
        if (sounds[key] === sound) {
          dupeSoundId = key;
        }
      });
      if (dupeSoundId) {
        // If potential duplicate sound found then delete current sound playing and play new sound
        delete sounds[dupeSoundId];
      }
      const id = generateID(7);
      sounds[id] = sound;
      this.setStateAsync({
        sounds
      });
    }
  }

  private pauseMusic(paused: boolean) {
    if (this.state.paused !== paused) {
      this.setStateAsync({ paused });
    }
  }

  private onEnded = (id: string) => {
    const sounds = { ...this.state.sounds };
    delete sounds[id];
    delete this.audioRefs[id];
    this.setStateAsync({ sounds });
  };

  private generateAudioElement(sound: Sound, id: string) {
    return (
      <audio key={id} autoPlay onEnded={() => this.onEnded(id)} src={sound} ref={(r) => (this.audioRefs[id] = r)} />
    );
  }

  private pause = (pause: boolean) => {
    const fade = (from: number, to: number, increment: number, done?: () => void) => {
      if (increment > 0 ? from < to : from > to) {
        this.bgRef.volume = from;
        window.setTimeout(() => fade(from + increment, to, increment, done), 100);
      } else {
        this.bgRef.volume = to;
        if (done) {
          done();
        }
      }
    };
    // Note:-
    // When pausing due to play, we fade-out, and when finished playing we fade in.
    // When muting, we mute immediately, but when unmuting we fade in (the quirk)
    // This is because at the moment it isn't possible to differentiate between
    // finishing playing and unmuting.
    if (pause) {
      if (this.props.soundsState.playMusic) {
        // fade-out
        fade(0.5, 0.0, -0.1, () => {
          this.bgRef.pause();
        });
      } else {
        this.bgRef.pause();
      }
    } else {
      // fade-in
      fade(0.0, 0.5, 0.05);
      this.bgRef.play();
    }
  };

  private renderAudioElements = () => {
    const elements = [];
    for (const key in this.state.sounds) {
      elements.push(this.generateAudioElement(this.state.sounds[key], key));
    }
    return elements;
  };
}
