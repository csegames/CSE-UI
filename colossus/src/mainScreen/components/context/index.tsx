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
import { RootState } from '../../redux/store';
import { FeatureFlags } from '../../redux/featureFlagsSlice';
import { ChampionInfoService } from '../../dataSources/championInfoNetworking';
import { ClockDataSource } from '../../dataSources/clockDataSource';
import { DebugSessionService } from '../../dataSources/debugSessionNetworking';
import { FeatureFlagsService } from '../../dataSources/featureFlagsNetworking';
import { GameSettingsNetworkingService } from '../../dataSources/gameSettingsNetworking';
import { GameStatsNetworkingService } from '../../dataSources/gameStatsNetworking';
import { LocalStorageSource } from '../../dataSources/localStorageDataSource';
import { MatchService } from '../../dataSources/matchNetworking';
import { NotificationsService } from '../../dataSources/notificationsNetworking';
import { ProfileService } from '../../dataSources/profileNetworking';
import { QuestNetworkingService } from '../../dataSources/questNetworking';
import { ScenariosNetworkingService } from '../../dataSources/scenariosNetworking';
import { StoreNetworkingService } from '../../dataSources/storeNetworking';
import { StringTableNetworkingService } from '../../dataSources/stringTableNetworking';
import { TeamJoinNetworkingService } from '../../dataSources/teamJoinNetworking';
import { UserNetworkingService } from '../../dataSources/userNetworking';
import { WarningIconsDataService } from '../../dataSources/warningIconsDataService';

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
        <ChampionInfoService />
        <ClockDataSource />
        <ContextProviders />
        <DebugSessionService />
        <FeatureFlagsService />
        <GameSettingsNetworkingService />
        <GameStatsNetworkingService />
        <LocalStorageSource />
        <MatchService />
        <NotificationsService />
        <ProfileService />
        <QuestNetworkingService />
        <ScenariosNetworkingService />
        <StoreNetworkingService />
        <StringTableNetworkingService />
        <TeamJoinNetworkingService />
        <UserNetworkingService />
        <WarningIconsDataService />
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
