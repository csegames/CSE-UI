/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';

// UI -> client (see UIViewListener.cpp)
const playGameSoundCallbackName = 'audio.PlayGameSound';
const playVolumeFeedbackCallbackName = 'audio.PlayVolumeFeedback';
const setUIRaceStateCallbackName = 'audio.SetUIRaceState';

export interface AudioFunctions {
  playGameSound(soundID: number): void;
  playVolumeFeedback(soundID: number, volume: number): void;
  setUIRaceState(raceID: number): void;
}

export interface AudioMocks {}

abstract class AudioFunctionsBase implements AudioFunctions, AudioMocks {
  abstract playGameSound(soundID: number): void;
  abstract playVolumeFeedback(soundID: number, volume: number): void;
  abstract setUIRaceState(raceID: number);
}

class CoherentAudioFunctions extends AudioFunctionsBase {
  playGameSound(soundID: number): void {
    engine.trigger(playGameSoundCallbackName, soundID);
  }
  playVolumeFeedback(soundID: number, volume: number): void {
    engine.trigger(playVolumeFeedbackCallbackName, soundID, volume);
  }
  setUIRaceState(raceID: number): void {
    engine.trigger(setUIRaceStateCallbackName, raceID);
  }
}

class BrowserAudioFunctions extends AudioFunctionsBase {
  playGameSound(soundID: number): void {}
  playVolumeFeedback(soundID: number, volume: number): void {}
  setUIRaceState(raceID: number): void {}
}

export const impl: AudioFunctions & AudioMocks = engine.isAttached
  ? new CoherentAudioFunctions()
  : new BrowserAudioFunctions();
