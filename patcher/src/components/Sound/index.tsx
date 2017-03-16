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
import { events } from 'camelot-unchained';
import { generateID } from 'redux-typed-modules';

import { SoundsState } from '../../services/session/sounds';

export interface SoundProps {
  soundsState: SoundsState;
}

export interface SoundState {
  sounds: { [id: string]: string };
 };
 
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
   baneSelect: 'sounds/UI_Menu_BaneSelect_v1_01.ogg'
 }

export class Sound extends React.Component<SoundProps, SoundState> {
  constructor(props: SoundProps) {
    super(props);
    this.state = {
      sounds: {},
    };
  }

  private playSound(name: string) {
    if (this.props.soundsState.playSound) {
      const id = generateID(7);
      this.setState({
        sounds: {...this.state.sounds, [id]: name}
      });
    }
  }

  private onEnded = (id: string) => {
    const sounds = {...this.state.sounds};
    delete sounds[id];
    delete this.audioRefs[id];
    this.setState({
      sounds,
    });
  }

  private bgRef: HTMLAudioElement = null;
  private audioRefs: { [id: string]: HTMLAudioElement } = {};

  private generateAudioElement = (sound: string, id: string) => {
    switch(sound) {
      case 'select':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.select}
                      ref={r => this.audioRefs[id] = r }/>
      case 'launch-game': 
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.launchGame}
                      ref={r => this.audioRefs[id] = r }/>
      case 'patch-complete': 
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.patchComplete}
                      ref={r => this.audioRefs[id] = r }/>
      case 'select-change': 
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.selectChange}
                      ref={r => this.audioRefs[id] = r }/>
      case 'create-character': 
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.createCharacter}
                      ref={r => this.audioRefs[id] = r }/>
      case 'realm-select': 
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.realmSelect}
                      ref={r => this.audioRefs[id] = r }/>
      case 'server-select': 
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.serverSelect}
                      ref={r => this.audioRefs[id] = r } />
      case 'reset-traits':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.resetTraits}
                      ref={r => this.audioRefs[id] = r } />
      case 'boon-select':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.boonSelect}
                      ref={r => this.audioRefs[id] = r } />
      case 'bane-select':
        return <audio key={id}
                      autoPlay
                      onEnded={() => this.onEnded(id)}
                      src={sounds.baneSelect}
                      ref={r => this.audioRefs[id] = r } />
      default: return null;
    }
  }

  public componentDidUpdate() {
    if (this.bgRef) {
      if (!this.props.soundsState.playMusic && !this.bgRef.paused) {
        this.bgRef.pause();
      } else if (this.props.soundsState.playMusic && this.bgRef.paused) {
        this.bgRef.play();
        this.bgRef.volume = 0.5;
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
    events.on('play-sound', (name: string) => this.playSound(name));
  }

  public componentDidUnMount() {
    events.off('play-sound');
  }
  
  private renderAudioElements = () => {
    const elements = [];
    for (const key in this.state.sounds) {
      elements.push(this.generateAudioElement(this.state.sounds[key], key));
    }
    return elements;
  }

  public render() {
    return (
      <div>
        <audio src='sounds/patcher-theme.ogg' ref={r => this.bgRef = r }/>
        {this.renderAudioElements()}     
      </div>
    );
  }
};

export default Sound;
