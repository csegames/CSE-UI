/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { AnnouncementType } from '@csegames/library/dist/_baseGame/types/localDefinitions';
import { mockEvents } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { Mock } from './data';

export const mockPopup: Mock = {
  name: 'Normal',
  expectedOutcomeDescription: `A message should come pop up in the center of the screen with
    the text \"This is a mock popup announcement\"`,
  function: () => {
    console.log('-- Mock expected popup announcement');
    mockEvents.triggerAnnouncement(
      AnnouncementType.PopUp,
      'This is a mock popup announcement ' + Math.random().toFixed(3),
      'Mock Announcement Title',
      '', // iconPath
      0 // soundid
    );
  }
};

export const mockObjectiveSuccess: Mock = {
  name: 'Objective Success',
  expectedOutcomeDescription: `Shows the objective success popup`,
  function: () => {
    mockEvents.triggerAnnouncement(
      AnnouncementType.ObjectiveSuccess,
      'Success', // text
      '', // title
      '', // iconPath
      0 // soundid
    );
  }
};

export const mockObjectiveFailed: Mock = {
  name: 'Objective Failed',
  expectedOutcomeDescription: `Shows the objective failed popup`,
  function: () => {
    mockEvents.triggerAnnouncement(
      AnnouncementType.ObjectiveFail,
      'Failed', // text
      '', // title
      '', // iconPath
      0 // soundid
    );
  }
};

// global counter used for mockDialogue for testing a large number of queued dialogue messages
let mockDialogueCounter = 1;

function makeMockDialogue(
  mockName: string,
  message: string,
  speakerName: string,
  speakerIcon: string,
  soundID: number
): Mock {
  const maxPreviewLength = 32;
  const messagePreview: string =
    message.length > maxPreviewLength ? `${message.slice(0, maxPreviewLength - 3)}...` : message;
  return {
    name: mockName,
    expectedOutcomeDescription: `A dialogue message should pop up at the right of the screen starting with \"${messagePreview}\"`,
    function: () => {
      console.log('-- Mock expected dialogue message', `SpeakerName="${speakerName}"`, `Message="${message}"`);
      mockEvents.triggerAnnouncement(
        AnnouncementType.Dialogue,
        message,
        `${speakerName} (#${mockDialogueCounter})`,
        speakerIcon,
        soundID
      );
      mockDialogueCounter += 1;
    }
  };
}

export const mockDialogueLong: Mock = makeMockDialogue(
  'Longer Dialogue Message',
  `This is some spoken dialogue that a character is saying right now and stuff. Lorem ipsum dolor sit amet, consectetur adipiscing elit. There are ${(
    Math.random() * 100
  ).toFixed(0)} lights.`,
  'Thor', // speaker name
  'https://s3.amazonaws.com/camelot-unchained/game/4/icons/inventory/other-bomb-sapper-generic-001.png', // speaker icon
  SoundEvents.PLAY_UI_MAIN_MENU_TAB_CHAMPION_CELT // soundid
);

export const mockDialogueShort: Mock = makeMockDialogue(
  'Shorter Dialogue Message',
  'Some shorter text for testing purposes.',
  'Odin',
  'https://s3.amazonaws.com/camelot-unchained/icons/inventory/weapon-tdd-OrganicAxe.png', // speaker icon
  SoundEvents.PLAY_UI_MAIN_MENU_TAB_CHAMPION_KNIGHT // soundid
);

export const mockDialogueNoSound: Mock = makeMockDialogue(
  'Dialogue Message Without Sound',
  'This is a dialogue message with no sound attached to it.',
  'Loki',
  'https://s3.amazonaws.com/camelot-unchained/icons/inventory/weapon-tdd-ValentineAxe.png', // speaker icon
  0 // no sound id
);

export const mockEmptyPopup: Mock = {
  name: 'Empty Message',
  expectedOutcomeDescription: 'No message should pop up',
  function: () => {
    console.log('-- Mock no message popup announcement');
    mockEvents.triggerAnnouncement(AnnouncementType.PopUp, '', '', '', 0);
  }
};
