/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

// Context
import ClientStateCommunicationContextProvider from './ClientStateCommunicationContext';

// Action Handlers
import { connect, useStore } from 'react-redux';
import { ChampionInfoService } from '../../dataSources/championInfoNetworking';
import { ProfileService } from '../../dataSources/profileNetworking';
import { TeamJoinNetworkingService } from '../../dataSources/teamJoinNetworking';
import { UserNetworkingService } from '../../dataSources/userNetworking';
import { FeatureFlagsService } from '../../dataSources/featureFlagsNetworking';
import { QuestNetworkingService } from '../../dataSources/questNetworking';
import { StoreNetworkingService } from '../../dataSources/storeNetworking';
import { GameSettingsNetworkingService } from '../../dataSources/gameSettingsNetworking';
import { FeatureFlags } from '../../redux/featureFlagsSlice';
import { RootState } from '../../redux/store';
import { ClientPerformanceDataService } from '../../dataSources/clientPerformanceDataService';
import { MatchService } from '../../dataSources/matchNetworking';
import { StringTableNetworkingService } from '../../dataSources/stringTableNetworking';
import { ScenariosNetworkingService } from '../../dataSources/scenariosNetworking';
import { DebugSessionService } from '../../dataSources/debugSessionNetworking';
import { ClockDataSource } from '../../dataSources/clockDataSource';
import { LocalStorageSource } from '../../dataSources/localStorageDataSource';

const SharedContextProvidersContainer = 'Context-SharedContextProvidersContainer';

interface ReactProps {}

interface InjectedProps extends FeatureFlags.Source {}

type Props = ReactProps & InjectedProps;

// function wrapper allows useStore() to work as intended
function ContextProviders(props: {}): JSX.Element {
  return <ClientStateCommunicationContextProvider store={useStore()} />;
}

class ASharedContextProviders extends React.Component<Props> {
  public render() {
    return (
      <div className={SharedContextProvidersContainer}>
        <MatchService />
        <DebugSessionService />
        <TeamJoinNetworkingService />
        <UserNetworkingService />
        <ProfileService />
        <FeatureFlagsService />
        <QuestNetworkingService />
        <StoreNetworkingService />
        <GameSettingsNetworkingService />
        <StringTableNetworkingService />
        <ChampionInfoService />
        <ClientPerformanceDataService />
        <ScenariosNetworkingService />
        <ContextProviders />
        <ClockDataSource />
        <LocalStorageSource />
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const featureFlags = state.featureFlags;
  return {
    ...ownProps,
    featureFlags
  };
}

export const SharedContextProviders = connect(mapStateToProps)(ASharedContextProviders);
