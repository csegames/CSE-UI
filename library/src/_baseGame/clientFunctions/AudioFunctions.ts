/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';

// UI -> client (see UIViewListener.cpp)
const playGameSoundCallbackName = 'audio.PlayGameSound';
const playVolumeFeedbackCallbackName = 'audio.PlayVolumeFeedback';
const setUIClassStateCallbackName = 'audio.SetUIClassState';
const setUIFactionStateCallbackName = 'audio.SetUIFactionState';
const setUIGenderStateCallbackName = 'audio.SetUIGenderState';
const setUIRaceStateCallbackName = 'audio.SetUIRaceState';
const startGameSoundFunctionName = 'audio.StartGameSound';

export interface AudioFunctions {
  playGameSound(soundID: number): void;
  playVolumeFeedback(soundID: number, volume: number): void;
  setUIClassState(classID: number): void;
  setUIFactionState(factionID: number): void;
  setUIGenderState(genderID: number): void;
  setUIRaceState(raceID: number): void;
  startGameSound(soundID: number): Promise<number>; // returns duration
}

export interface AudioMocks {}

class CoherentAudioFunctions implements AudioFunctions, AudioMocks {
  playGameSound(soundID: number): void {
    engine.trigger(playGameSoundCallbackName, soundID);
  }
  playVolumeFeedback(soundID: number, volume: number): void {
    engine.trigger(playVolumeFeedbackCallbackName, soundID, volume);
  }
  setUIClassState(classID: number): void {
    engine.trigger(setUIClassStateCallbackName, classID);
  }
  setUIFactionState(factionID: number): void {
    engine.trigger(setUIFactionStateCallbackName, factionID);
  }
  setUIGenderState(genderID: number): void {
    engine.trigger(setUIGenderStateCallbackName, genderID);
  }
  setUIRaceState(raceID: number): void {
    engine.trigger(setUIRaceStateCallbackName, raceID);
  }
  startGameSound(sound: number): Promise<number> {
    return engine.call(startGameSoundFunctionName, sound);
  }
}

class BrowserAudioFunctions implements AudioFunctions, AudioMocks {
  playGameSound(soundID: number): void {}
  playVolumeFeedback(soundID: number, volume: number): void {}
  setUIClassState(classID: number): void {}
  setUIFactionState(factionID: number): void {}
  setUIGenderState(genderID: number): void {}
  setUIRaceState(raceID: number): void {}
  startGameSound(soundID: number): Promise<number> {
    return Promise.resolve(0);
  }
}

export const impl: AudioFunctions & AudioMocks = engine.isAttached
  ? new CoherentAudioFunctions()
  : new BrowserAudioFunctions();
