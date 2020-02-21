/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { GroupMemberRemovedUpdate } from '../../../../../../../library/tmp/_baseGame/graphql/schema';
import {
  WarbandContextProvider,
  WarbandContextState,
  getDefaultWarbandContextState,
} from '../WarbandContext';
import {
  GraphQLActiveWarband,
  GroupNotification,
  GroupNotificationType,
  GroupMemberUpdate,
  GroupUpdateType,
  GroupTypes,
} from '@csegames/library/lib/_baseGame/graphql/schema';

const defaultContextState: Readonly<WarbandContextState> = getDefaultWarbandContextState();

beforeEach(() => {
  jest.resetModules();
});

describe('WarbandContextProvider', () => {
  it ('Initializes with good state', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });
});

describe('WarbandContextProvider handleQueryResult', () => {
  it('Malformed Context State - Null graphql', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const graphql: { data: { myActiveWarband: GraphQLActiveWarband | null } } = null;
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  })

  it('Malformed Context State - Null graphql data', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const graphql: { data: { myActiveWarband: GraphQLActiveWarband | null } } = {
      data: null,
    };
    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Good graphql data but null data value', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const graphql: { data: { myActiveWarband: GraphQLActiveWarband | null } } = {
      data: {
        myActiveWarband: null,
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Completely invalid graphql data', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const graphql = {
      data: {
        myActiveWarband: {
          info: null,
          members: null,
          this123: null,
          is123: null,
          bad123: null,
        } as any,
      }
    };

    (wrapper.instance() as any).handleQueryResult(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it ('Malformed Context State - Partially invalid graphql data', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const graphql: { data: { myActiveWarband: GraphQLActiveWarband | null } } = {
      data: {
        myActiveWarband: {
          info: {
            id: 'testID',
          } as any,
          members: [],
          this123: null,
          is123: null,
          bad123: null,
        } as any,
      }
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      expect(state).toHaveProperty(stateKey);
    });
  });

  it ('Good data', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const graphql: { data: { myActiveWarband: GraphQLActiveWarband | null } } = {
      data: {
        myActiveWarband: {
          info: {
            id: 'testID',
          } as any,
          members: [],
        }
      },
    };

    (wrapper.instance() as any).handleQueryResult(graphql);

    const state = wrapper.state();
    Object.keys(defaultContextState).forEach((stateKey) => {
      expect(state).toHaveProperty(stateKey);
    });
  });
});

describe('WarbandContextProvider handleNotificationSubscription', () => {
  it('Malformed Context State - Null graphql', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const graphql: any = null;

    (wrapper.instance() as any).handleNotificationSubscription(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it('Malformed Context State - Null graphql data', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const graphql: any = { data: null };

    (wrapper.instance() as any).handleNotificationSubscription(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });
});

describe('WarbandContextProvider handleNotificationJoined', () => {
  it('Malformed Context State - Null', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const matchmakingUpdate: any = null;

    (wrapper.instance() as any).handleNotificationJoined(matchmakingUpdate);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it('Good data', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const notification: GroupNotification = {
      groupID: 'TestGroupID',
      characterID: '',
      groupType: GroupTypes.Warband,
      type: GroupNotificationType.Joined,
    };

    (wrapper.instance() as any).handleNotificationJoined(notification);

    const state = wrapper.state();  
    Object.keys(defaultContextState).forEach((stateKey) => {
      switch(stateKey) {
        case 'groupID': {
          expect(state).toHaveProperty(stateKey, 'TestGroupID');
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

describe('WarbandContextProvider handleNotificationRemoved', () => {
  it('Malformed Context State - Null', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const matchmakingUpdate: any = null;

    (wrapper.instance() as any).handleNotificationRemoved(matchmakingUpdate);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it('Good data', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const notification: GroupNotification = {
      groupID: 'TestGroupID',
      characterID: '',
      groupType: GroupTypes.Warband,
      type: GroupNotificationType.Removed,
    };

    (wrapper.instance() as any).handleNotificationRemoved(notification);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });
});

describe('WarbandContextProvider handleUpdateSubscription', () => {
  it('Malformed Context State - Null graphql', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const graphql: any = null;

    (wrapper.instance() as any).handleUpdateSubscription(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it('Malformed Context State - Null graphql data', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const graphql: any = { data: null };

    (wrapper.instance() as any).handleUpdateSubscription(graphql);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });
});

describe('WarbandContextProvider handleUpdateMemberUpdate', () => {
  it('Malformed Context State - Null', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const matchmakingUpdate: any = null;

    (wrapper.instance() as any).handleUpdateMemberUpdate(matchmakingUpdate);
    expect(wrapper.state()).toMatchObject(defaultContextState);
  });

  it('Good data', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const update: GroupMemberUpdate = {
      groupID: 'TestGroupID',
      characterID: '',
      updateType: GroupUpdateType.MemberUpdate,
      memberState: JSON.stringify({ characterID: 'testCharacterID' }),
    };

    (wrapper.instance() as any).handleUpdateMemberUpdate(update);
    expect(wrapper.state()).toHaveProperty('groupMembers',
      {
        testCharacterID: {
          characterID: 'testCharacterID',
        }
      });
  });
});

describe('WarbandContextProvider handleUpdateMemberRemoved', () => {
  it('Malformed Context State - Null', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const update: GroupMemberRemovedUpdate = null;

    (wrapper.instance() as any).handleUpdateMemberRemoved(update);
  });

  it ('Good data', () => {
    const wrapper = shallow(<WarbandContextProvider></WarbandContextProvider>);
    const update: GroupMemberRemovedUpdate = {
      characterID: 'characterID',
      groupID: 'TestGroupID',
      updateType: GroupUpdateType.MemberRemoved,
    };

    (wrapper.instance() as any).handleUpdateMemberRemoved(update);
    expect(wrapper.state()).toHaveProperty('groupMembers', {});
  });
});
