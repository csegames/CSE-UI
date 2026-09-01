/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { generateID } from 'redux-typed-modules';
import { ListenerHandle } from '../lib/ListenerHandle';
import { globalEvents } from '../lib/EventEmitter';
import { Sound } from '../lib/Sound';
import { RootState } from '../redux/store';
import { connect } from 'react-redux';

import { ChannelState } from '../redux/channelsSlice';
import { ChannelStatus } from '../api/patcher/channelStatus';

const MUSIC_ID = 'music';
const MUSIC_VOLUME = 0.5;

interface ReactProps {}

interface InjectedProps {
  channels: ChannelState;
  playMusic: boolean;
  playSound: boolean;
}

type Props = ReactProps & InjectedProps;

class ASoundPlayer extends React.Component<Props> {
  private audioRefs: { [id: string]: HTMLAudioElement } = {};
  private handle: ListenerHandle | null = null;

  constructor(props: Props) {
    super(props);
  }

  render(): React.ReactNode {
    return null;
  }

  componentDidMount() {
    // mock "prevProps" to allow music to turn on
    this.updateMusic({ channels: {}, playMusic: false, playSound: false });
    this.handle = globalEvents.on('play-sound', (sound: Sound) => this.playSound(sound));
  }

  componentDidUpdate(prevProps: Props) {
    this.updateMusic(prevProps);
  }

  componentWillUnmount() {
    this.handle?.close();
    for (const audio of Object.values(this.audioRefs)) {
      audio.pause();
    }
    this.audioRefs = {};
  }

  private playSound(sound: Sound) {
    if (this.props.playSound) {
      // If potential duplicate sound found then delete current sound playing and play new sound
      for (const [id, ref] of Object.entries(this.audioRefs)) {
        if (sound === ref.currentSrc) {
          this.onEnded(id);
          break;
        }
      }
      const id = generateID(7);
      this.audioRefs[id] = this.generateAudioElement(sound, id);
    }
  }

  // todo : replace with patcher status once Playing is reliably reported
  private isGameRunning(props: Props) {
    for (const channel of Object.values(props.channels)) {
      if (channel.status === ChannelStatus.Running) {
        return true;
      }
    }
    return false;
  }

  private updateMusic(prevProps: Props) {
    const isRequested = this.props.playMusic && !this.isGameRunning(this.props);
    const wasRequested = prevProps.playMusic && !this.isGameRunning(prevProps);
    if (isRequested === wasRequested) return;

    if (isRequested) {
      const music = this.audioRefs[MUSIC_ID] ?? this.generateAudioElement(Sound.Ambient, MUSIC_ID, true);
      music.volume = MUSIC_VOLUME;
      this.audioRefs[MUSIC_ID] = music;
    } else {
      this.onEnded(MUSIC_ID);
    }
  }

  private generateAudioElement(sound: Sound, id: string, loop: boolean = false): HTMLAudioElement {
    const audio = document.createElement('audio') as HTMLAudioElement;
    audio.src = sound;
    audio.onended = () => this.onEnded(id);
    audio.play();
    audio.loop = loop;
    return audio;
  }

  private onEnded(id: string) {
    const audio = this.audioRefs[id];
    if (audio) audio.pause();
    delete this.audioRefs[id];
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { playMusic, playSound } = state.sounds;
  const { channels } = state;

  return {
    ...ownProps,
    channels,
    playMusic,
    playSound
  };
}

export const SoundPlayer = connect(mapStateToProps)(ASoundPlayer);
