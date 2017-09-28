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

import { StepInfo } from 'camelot-unchained';

export const factionSteps: StepInfo[] = [
  {
    element: '#Arthurian',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Double click on a faction to choose.',
  },
];

export const raceSteps: StepInfo[] = [
  {
    element: '#race-btn-0',
    position: 'right',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Click to choose a race.',
  },
  {
    element: '#male-btn',
    position: 'right',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Click to choose a gender.',
  },
  {
    element: '.selection-description',
    position: 'right',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'History of your selected race.',
  },
  {
    element: '#cu-char-creation-next',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Once you have selected your desired race and gender, click Next to move on to select your class.',
  },
];

export const classSteps: StepInfo[] = [
  {
    element: '#class-btn-0',
    position: 'right',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Click to choose a class',
  },
  {
    element: '.selection-description',
    position: 'right',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: `This field describes your class's role as well as some history of your class.`,
  },
  {
    element: '#cu-char-creation-next',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Once you have selected your desired class, click Next to move on to the Attributes screen.',
  },
];

export const attributeSteps: StepInfo[] = [
  {
    position: 'right',
    element: '.points',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'You must spend all your points.',
  },
  {
    position: 'right',
    element: '.leftarrow',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Press on the arrow to remove a point from this attribute or press and hold to remove points quickly.',
  },
  {
    position: 'right',
    element: '.rightarrow',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Press on the arrow to add a point to this attribute or press and hold to add points quickly.',
  },
  {
    position: 'bottom',
    element: '#Primary',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Attributes are divided into 3 sections. Primary attributes affect Derived attributes.',
  },
  {
    position: 'right',
    element: '#Agility',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Hover over the attribute to see the description.',
  },
  {
    position: 'right',
    element: '#Agility-title',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'This field describes the name of the attribute.',
  },
  {
    position: 'right',
    element: '#Agility-value',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'This field describes the value of the attribute.',
  },
];

export const banesAndBoonsSteps: StepInfo[] = [
  {
    element: '#boon-minPoints',
    position: 'right',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'This is how many points you are REQUIRED to spend on Boons.',
  },
  {
    element: '#boon-maxPoints',
    position: 'right',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'This is the maximum amount of points allowed to spend on Boons',
  },
  {
    element: '#boon-0',
    position: 'right',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Click on a boon to add it to your character.',
  },
  {
    element: 'trait-pointsContainer',
    tooltipClass: 'help-tooltips',
    highlightClass: 'help-highlight',
    intro: 'This describes how many points have been spent on both sides',
  },
  {
    element: '#boon-summary-0',
    position: 'right',
    tooltipClass: 'help-tooltip',
    highlightClass: 'help-highlight',
    intro: 'Summary of the boon',
  },
];
