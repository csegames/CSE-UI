/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 *//*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
// tslint:disable
import { StepInfo } from '@csegames/camelot-unchained';

export const factionSteps: StepInfo[] = [
  {
    element: 'cu-character-creation__faction-select__section-Viking',
    tooltipText: 'Double click on a faction to choose.',
  },
];

export const raceSteps: StepInfo[] = [
  {
    element: 'race-selection-container',
    tooltipText: 'Choose a race',
  },
  {
    element: 'gender-selection-container',
    tooltipText: 'Choose a gender',
  },
  {
    element: 'cu-char-creation-next',
    tooltipText: 'Once you have selected your desired race and gender, click Next to move on to select your class.',
  },
];

export const classSteps: StepInfo[] = [
  {
    element: 'class-selection-container',
    tooltipText: 'Click to choose a class',
  },
  {
    element: 'cu-char-creation-next',
    tooltipText: 'Once you have selected your desired class, click Next to move on to the Attributes screen.',
  },
];

export const attributeSteps: StepInfo[] = [
  {
    element: 'points',
    tooltipText: 'You must spend all your points.',
  },
  {
    element: 'leftarrow',
  },
  {
    element: 'rightarrow',
    tooltipText: 'Press on these arrows to add/remove a point to this attribute or press and hold to add/remove points quickly.',
  },
  {
    element: 'Primary',
    tooltipText: 'Attributes are divided into 3 sections. Primary attributes affect Derived attributes.',
  },
  {
    element: 'Agility',
    tooltipText: 'Hover over the attribute to see the description.',
  },
];

export const banesAndBoonsSteps: StepInfo[] = [
  {
    element: 'boon-minPoints',
    tooltipText: 'This is how many points you are REQUIRED to spend on Boons.',
  },
  {
    element: 'boon-maxPoints',
    tooltipText: 'This is the maximum amount of points allowed to spend on Boons',
  },
  {
    element: 'boon-0',
    tooltipText: 'Click on a boon to add it to your character.',
  },
  {
    element: 'trait-pointsContainer',
    tooltipText: 'This describes how many points have been spent on both sides',
  },
  {
    element: 'boon-summary-0',
    tooltipText: 'Summary of the boon',
  },
];

export const summarySteps: StepInfo[] = [
  {
    element: 'summary-panel',
    tooltipText: 'Double check your choices made during character creation. Scroll down to see it all.',
  },
  {
    element: 'create-character-name-input',
    tooltipText: 'Enter a name',
  },
];

export const helpSteps: any = {
  Faction: factionSteps,
  Race: raceSteps,
  Class: classSteps,
  Attributes: attributeSteps,
  BanesAndBoons: banesAndBoonsSteps,
  Summary: summarySteps,
};
