/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as events  from '@csegames/camelot-unchained/lib/events';
import { generateID } from 'redux-typed-modules';

import { SoundsState } from '../../services/session/sounds';

export interface SoundProps {
  soundsState: SoundsState;
}

export interface SoundState {
  sounds: { [id: string]: string };
  paused: boolean;
  patcherThemeEnded: boolean;
}

const sounds = {
  select: 'sounds/UI_Menu_GenericSelect_v1_02.ogg',
  launchGame: 'sounds/UI_Patcher_PlayButton_v3.ogg',
  patchComplete: 'sounds/patch-complete.ogg',
  selectChange: 'sounds/UI_Menu_CharacterSelect_Change_v1_01.ogg',
  createCharacter: 'sounds/UI_Menu_CreateNewCharacter_v1_01.ogg',
  realmSelect: 'sounds/UI_Menu_SelectRealm_v1_01.ogg',
  serverSelect: 'sounds/UI_Menu_ServerSelect_v1_01.ogg',
  resetTraits: 'sounds/UI_AbilityCrafting_Reset_v1_01.ogg',
  boonSelect: 'sounds/UI_Menu_BoonSelect_v1_01.ogg',
  baneSelect: 'sounds/UI_Menu_BaneSelect_v1_01.ogg',
};

export class Sound extends React.Component<SoundProps, SoundState> {

  private bgRef: HTMLAudioElement = null;
  private evhs: any[] = [];       // event handlers
  private audioRefs: { [id: string]: HTMLAudioElement } = {};

  constructor(props: SoundProps) {
    super(props);
    this.state = {
      sounds: {},
      paused: false,
      patcherThemeEnded: false,
    };
  }

  public render() {
    return (
      <div>
        <audio
          src='sounds/patcher-theme.ogg'
          onEnded={() => this.setState({ patcherThemeEnded: true })}
          ref={r => this.bgRef = r}
        />
        {this.state.patcherThemeEnded &&
          <audio
            loop={true}
            src='sounds/patcher-ambient.ogg'
            ref={r => this.bgRef = r}
          />
        }
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
    this.evhs.push(events.on('play-sound', (name: string) => this.playSound(name)));
    this.evhs.push(events.on('pause-music', (paused: boolean) => this.pauseMusic(paused)));
  }

  public componentWillUnmount() {
    this.evhs.map((h: any) => events.off(h));
  }

  private setStateAsync = (sparseState: any) => {
    setTimeout(() => { this.setState(sparseState); },0);
  }

  private playSound(name: string) {
    if (this.props.soundsState.playSound) {
      const sounds = this.state.sounds;
      // Grab dupe sound if any
      let dupeSoundId = '';
      Object.keys(sounds).forEach((key) => {
        if (sounds[key] === name) {
          dupeSoundId = key;
        }
      });
      if (dupeSoundId) {
        // If potential duplicate sound found then delete current sound playing and play new sound
        delete sounds[dupeSoundId];
      }
      const id = generateID(7);
      sounds[id] = name;
      this.setStateAsync({
        sounds,
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
  }

  private generateAudioElement = (sound: string, id: string) => {
    switch (sound) {
      case 'select':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.select}
                      ref={r => this.audioRefs[id] = r }/>;
      case 'launch-game':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.launchGame}
                      ref={r => this.audioRefs[id] = r }/>;
      case 'patch-complete':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.patchComplete}
                      ref={r => this.audioRefs[id] = r }/>;
      case 'select-change':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.selectChange}
                      ref={r => this.audioRefs[id] = r }/>;
      case 'create-character':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.createCharacter}
                      ref={r => this.audioRefs[id] = r }/>;
      case 'realm-select':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.realmSelect}
                      ref={r => this.audioRefs[id] = r }/>;
      case 'server-select':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.serverSelect}
                      ref={r => this.audioRefs[id] = r } />;
      case 'reset-traits':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.resetTraits}
                      ref={r => this.audioRefs[id] = r } />;
      case 'boon-select':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.boonSelect}
                      ref={r => this.audioRefs[id] = r } />;
      case 'bane-select':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.baneSelect}
                      ref={r => this.audioRefs[id] = r } />;
      default: return null;
    }
  }

  private pause = (pause: boolean) => {
    const fade = (from: number, to: number, increment: number, done?: () => void) => {
      if (increment > 0 ? from < to : from > to) {
        this.bgRef.volume = from;
        setTimeout(() => fade(from + increment, to, increment, done), 100);
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
        fade(0.5, 0.0, -0.1, () => { this.bgRef.pause(); });
      } else {
        this.bgRef.pause();
      }
    } else {
      // fade-in
      fade(0.0, 0.5, 0.05);
      this.bgRef.play();
    }
  }

  private renderAudioElements = () => {
    const elements = [];
    for (const key in this.state.sounds) {
      elements.push(this.generateAudioElement(this.state.sounds[key], key));
    }
    return elements;
  }
}

export default Sound;
