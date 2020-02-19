/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { MATCH_CANCELED_ERROR } from '../MatchmakingContext';
import {
  ActiveMatchServer,
  MatchmakingServerReady,
  MatchmakingKickOff,
  MatchmakingError,
  MatchmakingUpdateType,
} from '@csegames/library/lib/hordetest/graphql/schema';
import {
  MatchmakingContextProvider,
  getDefaultMatchmakingContextState,
  MATCH_FAILED_ERROR,
} from '../MatchmakingContext';

const defaultContextState = getDefaultMatchmakingContextState();

beforeEach(() => {
  jest.resetModules();
});

describe('MatchmakingProvider Initialization', () => {
  it ('Initializes with good state', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });
});

describe('MatchmakingProvider handleQueryResult', () => {
  it('Malformed Context State - Null graphql', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql: { data: {  } } = null;
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  })

  it('Malformed Context State - Null graphql data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql: { data: {  } } = {
      data: null,
    };
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Good graphql data but null data value', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql: { data: {  } } = {
      data: {
        activeMatch: null,
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Completely invalid graphql data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql = {
      data: {
        this123: null,
        is123: null,
        bad123: null,
      } as any,
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Partially invalid graphql data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql = {
      data: {
        activeMatch: null,
        this123: null,
        is123: null,
        bad123: null,
      } as any,
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      expect(state).toHaveProperty(stateKey);
    });
  });

  it ('Good data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql: { data: { activeMatchServer: ActiveMatchServer } } = {
      data: {
        activeMatchServer: {
          serverPort: 1000,
          serverHost: 'testServerHost',
        }
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    // Ensure we only changed host and port
    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      switch(stateKey) {
        case 'host': {
          expect(state).toHaveProperty(stateKey, 'testServerHost');
          break;
        }

        case 'port': {
          expect(state).toHaveProperty(stateKey, 1000);
          break;
        }

        default: {
          expect(state).toHaveProperty(stateKey, defaultContextState[stateKey]);
          break;
        }
      }
    });
  });
});

describe('MatchmakingProvider handleSubscription', () => {
  it('Malformed Context State - Null graphql', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql: any = null;

    (wrapper.instance() as any).handleSubscription(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it('Malformed Context State - Null graphql data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const graphql: any = { data: null };

    (wrapper.instance() as any).handleSubscription(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });
});

describe('MatchmakingProvider handleMatchmakingServerReady', () => {
  it('Malformed Context State - Null', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const matchmakingUpdate: any = null;

    (wrapper.instance() as any).handleMatchmakingServerReady(matchmakingUpdate);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it('Good data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const matchmakingUpdate: MatchmakingServerReady = {
      type: MatchmakingUpdateType.ServerReady,
      host: 'testServerHost',
      port: 1000,
    };

    (wrapper.instance() as any).handleMatchmakingServerReady(matchmakingUpdate);

    // Ensure we only changed host and port
    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      switch(stateKey) {
        case 'host': {
          expect(state).toHaveProperty(stateKey, 'testServerHost');
          break;
        }

        case 'port': {
          expect(state).toHaveProperty(stateKey, 1000);
          break;
        }

        default: {
          expect(state).toHaveProperty(stateKey, defaultContextState[stateKey]);
          break;
        }
      }
    });
  });
});

describe('MatchmakingProvider handleMatchmakingKickOff', () => {
  it('Malformed Context State - Null', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const matchmakingUpdate: any = null;

    (wrapper.instance() as any).handleMatchmakingKickOff(matchmakingUpdate);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it('Good data', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const matchmakingUpdate: MatchmakingKickOff = {
      type: MatchmakingUpdateType.KickOff,
      matchID: 'testMatchID',
      secondsToWait: 30,
      serializedTeamMates: '{}',
    };

    (wrapper.instance() as any).handleMatchmakingKickOff(matchmakingUpdate);

    // Ensure we only changed matchID, secondsToWait, and serializedTeamMates
    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      switch(stateKey) {
        case 'matchID': {
          expect(state).toHaveProperty(stateKey, 'testMatchID');
          break;
        }

        case 'secondsToWait': {
          expect(state).toHaveProperty(stateKey, 30);
          break;
        }

        case 'teamMates': {
          expect(state).toHaveProperty(stateKey, '{}');
          break;
        }

        case 'isWaitingOnServer': {
          expect(state).toHaveProperty(stateKey, true);
          break;
        }

        default: {
          expect(state).toHaveProperty(stateKey, defaultContextState[stateKey]);
          break;
        }
      }
    });
  });
});

describe('MatchmakingProvider handleMatchmakingError', () => {
  it('Malformed Context State - Null', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const matchmakingUpdate: any = null;

    (wrapper.instance() as any).handleMatchmakingError(matchmakingUpdate);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it('Match Failed Error - should update state', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const matchmakingUpdate: MatchmakingError = {
      type: MatchmakingUpdateType.Error,
      message: 'TestErrorMessage',
      code: MATCH_FAILED_ERROR,
    };

    (wrapper.instance() as any).handleMatchmakingError(matchmakingUpdate);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      // error: message, isEntered: false, isWaitingOnServer: false, timeSearching: 0
      switch(stateKey) {
        case 'error': {
          expect(state).toHaveProperty(stateKey, 'TestErrorMessage');
          break;
        }

        case 'isEntered': {
          expect(state).toHaveProperty(stateKey, false);
          break;
        }

        case 'isWaitingOnServer': {
          expect(state).toHaveProperty(stateKey, false);
          break;
        }

        case 'timeSearching': {
          expect(state).toHaveProperty(stateKey, 0);
          break;
        }

        default: {
          expect(state).toHaveProperty(stateKey, defaultContextState[stateKey]);
          break;
        }
      }
    });
  });

  it ('Match Canceled Error - should NOT update state', () => {
    const wrapper = shallow(<MatchmakingContextProvider></MatchmakingContextProvider>);
    const matchmakingUpdate: MatchmakingError = {
      type: MatchmakingUpdateType.Error,
      message: 'TestErrorMessage',
      code: MATCH_CANCELED_ERROR,
    };

    (wrapper.instance() as any).handleMatchmakingError(matchmakingUpdate);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });
});
