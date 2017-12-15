/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { SkillStateTypeEnum, SkillStateStatusEnum, SkillStateReasonEnum, SkillStateProgression } from 'camelot-unchained';

export const skillStateColors = {
  unavailableColor: '#C1000E',
  readyColor: 'cyan',
  startCastColor: '#ffdf00',
  errorColor: 'red',
  activeColor: '#ffdf00',
  queuedColor: '#FF7C24',
  prepColor: '#FF9F19',
  cooldownColor: 'white',
  disruptionColor: '#d700ff',
  recoveryColor: '#19abff',
  hitColor: '#fff570',
  runningColor: '#fff570',
  channelColor: '#C5FFC5',
  modalColor: '#aaa',
};

export interface SkillStateInfo {
  id: number;
  info: {
    type: SkillStateTypeEnum;
    icon: string;
    keybind: string;
  };
  status: SkillStateStatusEnum;
  reason?: SkillStateReasonEnum;
  timing?: SkillStateProgression;
  disruption?: SkillStateProgression;
}

export default SkillStateInfo;
