/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import { ObjectiveDetailMessageState } from '@csegames/library/dist/_baseGame/types/Objective';
import { Mock } from './data';
import { mockEvents } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

enum ObjectiveDetailCategory {
  Primary = 0,
  MainQuest = 1,
  SideQuest = 2
}

enum ObjectiveDetailState {
  InProgress = 0,
  CompletedSuccess = 1,
  CompletedFailed = 2
}

function makeObjectiveDetail(
  id: string,
  title: string,
  text: string,
  category: ObjectiveDetailCategory,
  hasTimer: boolean,
  hasCounter: boolean
) {
  let obj: ObjectiveDetailMessageState = {
    messageID: id,
    title: title,
    text: text,
    category: category,
    state: ObjectiveDetailState.InProgress,
    maxCount: 0,
    currentCount: 0,
    totalTime: 0,
    startTime: 0
  };
  if (hasTimer) {
    obj.totalTime = 12 + Math.floor(Math.random() * 10);
    obj.startTime = game.worldTime;
  }
  if (hasCounter) {
    if (Math.random() < 0.2) {
      // 20% of the time, show a very high count
      obj.maxCount = 2 + Math.floor(Math.random() * 32000);
      obj.currentCount = 1 + Math.floor(Math.random() * (obj.maxCount - 1));
    } else {
      obj.maxCount = 2 + Math.floor(Math.random() * 12);
      obj.currentCount = 1 + Math.floor(Math.random() * (obj.maxCount - 1));
    }

    // half the time, if the current count is close to the max count, just set it to maximum for testing that state
    if (obj.maxCount - obj.currentCount <= 3 && Math.random() > 0.5) {
      obj.currentCount = obj.maxCount;
    }
  }
  return obj;
}

export const mockClearAllObjectiveDetails: Mock = {
  name: 'Clear',
  expectedOutcomeDescription: 'Clears all objective details',
  function: () => {
    mockEvents.triggerObjectiveDetails([]);
  }
};

export const mockPrimaryTimer: Mock = {
  name: 'Primary Timer',
  expectedOutcomeDescription: `Sets a primary objective detail popup with a timer`,
  function: () => {
    mockEvents.triggerObjectiveDetails([
      makeObjectiveDetail(
        'mock_primary_timer',
        'primary timer',
        'timer description',
        ObjectiveDetailCategory.Primary,
        true,
        false
      )
    ]);
  }
};

export const mockPrimaryCounter: Mock = {
  name: 'Primary Counter',
  expectedOutcomeDescription: `Sets a primary objective detail popup with a counter`,
  function: () => {
    mockEvents.triggerObjectiveDetails([
      makeObjectiveDetail(
        'mock_primary_counter',
        'primary counter',
        'counter description',
        ObjectiveDetailCategory.Primary,
        false,
        true
      )
    ]);
  }
};

export const mockPrimaryTimerAndCounter: Mock = {
  name: 'Primary Timer and Counter',
  expectedOutcomeDescription: `Sets a primary objective detail popup with a timer and counter`,
  function: () => {
    mockEvents.triggerObjectiveDetails([
      makeObjectiveDetail(
        'mock_primary_timer_counter',
        'primary timer and counter',
        'timer and counter description',
        ObjectiveDetailCategory.Primary,
        true,
        true
      )
    ]);
  }
};

export const mockMainQuestTimer: Mock = {
  name: 'Main Quest Timer',
  expectedOutcomeDescription: `Sets a main quest objective detail popup with a timer`,
  function: () => {
    mockEvents.triggerObjectiveDetails([
      makeObjectiveDetail(
        'mock_main_timer',
        'main quest timer',
        'main quest timer description',
        ObjectiveDetailCategory.MainQuest,
        true,
        false
      )
    ]);
  }
};

export const mockMainQuestCounter: Mock = {
  name: 'Main Quest Counter',
  expectedOutcomeDescription: `Sets a main quest objective detail popup with a counter`,
  function: () => {
    mockEvents.triggerObjectiveDetails([
      makeObjectiveDetail(
        'mock_main_counter',
        'main quest counter',
        'main quest counter description',
        ObjectiveDetailCategory.MainQuest,
        false,
        true
      )
    ]);
  }
};

export const mockMainQuestTimerCounter: Mock = {
  name: 'Main Quest Timer and Counter',
  expectedOutcomeDescription: `Sets a main quest objective detail popup with a timer and counter`,
  function: () => {
    mockEvents.triggerObjectiveDetails([
      makeObjectiveDetail(
        'mock_main_timer_counter',
        'main quest timer and counter',
        'main quest timer and counter description',
        ObjectiveDetailCategory.MainQuest,
        true,
        true
      )
    ]);
  }
};

export const mockSideQuestTimer: Mock = {
  name: 'Side Quest Timer',
  expectedOutcomeDescription: `Sets a side quest objective detail popup with a timer`,
  function: () => {
    mockEvents.triggerObjectiveDetails([
      makeObjectiveDetail(
        'mock_side_timer',
        'side quest timer',
        'side quest timer description',
        ObjectiveDetailCategory.SideQuest,
        true,
        false
      )
    ]);
  }
};

export const mockSideQuestCounter: Mock = {
  name: 'Side Quest Counter',
  expectedOutcomeDescription: `Sets a side quest objective detail popup with a counter`,
  function: () => {
    mockEvents.triggerObjectiveDetails([
      makeObjectiveDetail(
        'mock_side_counter',
        'side quest counter with no desc',
        'side quest counter description',
        ObjectiveDetailCategory.SideQuest,
        false,
        true
      )
    ]);
  }
};

export const mockSideQuestTimerCounter: Mock = {
  name: 'Side Quest Timer and Counter',
  expectedOutcomeDescription: `Sets a side quest objective detail popup with a timer and counter`,
  function: () => {
    mockEvents.triggerObjectiveDetails([
      makeObjectiveDetail(
        'mock_side_timer_counter',
        'side quest timer and counter',
        'side quest timer and counter description',
        ObjectiveDetailCategory.SideQuest,
        true,
        true
      )
    ]);
  }
};

// helper function to generate all permutations of objective details (timer, counter, and timer+counter with primary, mainquest, and sidequest categories)
function generateAll(withTitle: boolean, withDesc: boolean) {
  const desc: string = withDesc ? 'description' : '';
  const optionalTitle = (str: string) => (withTitle ? str : '');
  return [
    makeObjectiveDetail(
      'mock_primary_timer',
      optionalTitle('primary timer'),
      desc,
      ObjectiveDetailCategory.Primary,
      true,
      false
    ),
    makeObjectiveDetail(
      'mock_primary_counter',
      optionalTitle('primary counter'),
      desc,
      ObjectiveDetailCategory.Primary,
      false,
      true
    ),
    makeObjectiveDetail(
      'mock_primary_timer_counter',
      optionalTitle('primary timer and counter'),
      desc,
      ObjectiveDetailCategory.Primary,
      true,
      true
    ),
    makeObjectiveDetail(
      'mock_main_timer',
      optionalTitle('main quest timer'),
      desc,
      ObjectiveDetailCategory.MainQuest,
      true,
      false
    ),
    makeObjectiveDetail(
      'mock_main_counter',
      optionalTitle('main quest counter'),
      desc,
      ObjectiveDetailCategory.MainQuest,
      false,
      true
    ),
    makeObjectiveDetail(
      'mock_main_timer_counter',
      optionalTitle('main quest timer and counter'),
      desc,
      ObjectiveDetailCategory.MainQuest,
      true,
      true
    ),
    makeObjectiveDetail(
      'mock_side_timer',
      optionalTitle('side quest timer'),
      desc,
      ObjectiveDetailCategory.SideQuest,
      true,
      false
    ),
    makeObjectiveDetail(
      'mock_side_counter',
      optionalTitle('side quest counter'),
      desc,
      ObjectiveDetailCategory.SideQuest,
      false,
      true
    ),
    makeObjectiveDetail(
      'mock_side_timer_counter',
      optionalTitle('side quest timer and counter'),
      desc,
      ObjectiveDetailCategory.SideQuest,
      true,
      true
    )
  ];
}

// makes a mock object and modifies objective details to have the specified state
function makeObjectiveDetailMock(
  objectives: Array<ObjectiveDetailMessageState>,
  state: ObjectiveDetailState,
  mockDesc: string
): Mock {
  const nameSuffix = mockDesc ? ` (${ObjectiveDetailState[state]}, ${mockDesc})` : ` (${ObjectiveDetailState[state]})`;
  const descSuffix = mockDesc ? ` (${mockDesc})` : '';

  return {
    name: `Multiple Objective Details${nameSuffix}`,
    expectedOutcomeDescription: `Shows multiple ${
      ObjectiveDetailState[state]
    } objective details of all types${descSuffix}`,
    function: () => {
      const allObjectives = objectives;
      for (let i = 0; i < allObjectives.length; i++) {
        allObjectives[i].state = state;
      }
      mockEvents.triggerObjectiveDetails(allObjectives);
    }
  };
}

// all the permutations of ObjectiveDetailState with both text lines, only a title, only a description, and no text lines (progress bar only)

export const mockMultipleObjectiveDetails: Mock = makeObjectiveDetailMock(
  generateAll(true, true),
  ObjectiveDetailState.InProgress,
  ''
);
export const mockSetAllSuccess: Mock = makeObjectiveDetailMock(
  generateAll(true, true),
  ObjectiveDetailState.CompletedSuccess,
  ''
);
export const mockSetAllFailed: Mock = makeObjectiveDetailMock(
  generateAll(true, true),
  ObjectiveDetailState.CompletedFailed,
  ''
);

export const mockMultipleObjectiveDetailsNoDesc: Mock = makeObjectiveDetailMock(
  generateAll(true, false),
  ObjectiveDetailState.InProgress,
  'no description'
);
export const mockSetAllSuccessNoDesc: Mock = makeObjectiveDetailMock(
  generateAll(true, false),
  ObjectiveDetailState.CompletedSuccess,
  'no description'
);
export const mockSetAllFailedNoDesc: Mock = makeObjectiveDetailMock(
  generateAll(true, false),
  ObjectiveDetailState.CompletedFailed,
  'no description'
);

export const mockMultipleObjectiveDetailsNoTitle: Mock = makeObjectiveDetailMock(
  generateAll(false, true),
  ObjectiveDetailState.InProgress,
  'no title'
);
export const mockSetAllSuccessNoTitle: Mock = makeObjectiveDetailMock(
  generateAll(false, true),
  ObjectiveDetailState.CompletedSuccess,
  'no title'
);
export const mockSetAllFailedNoTitle: Mock = makeObjectiveDetailMock(
  generateAll(false, true),
  ObjectiveDetailState.CompletedFailed,
  'no title'
);

export const mockMultipleObjectiveDetailsProgressBarOnly: Mock = makeObjectiveDetailMock(
  generateAll(false, false),
  ObjectiveDetailState.InProgress,
  'progress bar only'
);
export const mockSetAllSuccessProgressBarOnly: Mock = makeObjectiveDetailMock(
  generateAll(false, false),
  ObjectiveDetailState.CompletedSuccess,
  'progress bar only'
);
export const mockSetAllFailedProgressBarOnly: Mock = makeObjectiveDetailMock(
  generateAll(false, false),
  ObjectiveDetailState.CompletedFailed,
  'progress bar only'
);
