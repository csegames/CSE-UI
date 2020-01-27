/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { ChampionDBModel, DefaultChampionDBModel, MatchStatsDBModel } from '@csegames/library/lib/hordetest/graphql/schema';
import { getConfig } from 'lib/gqlHelpers';
import { preloadQueryEvents } from '../fullscreen/Preloader';

const query = gql`
  query ColossusProfileContextQuery {
    colossusProfile {
      champions {
        championID
        stats {
          damageApplied
          damageTaken
          deathCount
          kills
          longestKillStreak
          longestLife
          matchesPlayed
          thumbsUp
          totalPlayTime
        }
      }

      defaultChampion {
        championID
        costumeID
      }

      lifetimeStats {
        damageApplied
        damageTaken
        deathCount
        kills
        longestKillStreak
        longestLife
        matchesPlayed
        thumbsUp
        totalPlayTime
      }
    }
  }
`;

export interface ColossusProfileModel {
  champions: ChampionDBModel[];
  defaultChampion: DefaultChampionDBModel;
  lifetimeStats: MatchStatsDBModel;
}

export interface ColossusProfileState {
  colossusProfile: ColossusProfileModel;
  graphql: GraphQLResult<{ colossusProfile: ColossusProfileModel }>;
}

const getDefaultColossusProfileState = (): ColossusProfileState => ({
  colossusProfile: {
    defaultChampion: null,
    champions: null,
    lifetimeStats: null,
  },
  graphql: null,
});

export const ColossusProfileContext = React.createContext(getDefaultColossusProfileState());

export class ColossusProfileProvider extends React.Component<{}, ColossusProfileState> {
  private isInitialQuery: boolean = true;
  constructor(props: {}) {
    super(props);

    this.state = getDefaultColossusProfileState();
  }

  public render() {
    return (
      <ColossusProfileContext.Provider value={this.state}>
        <GraphQL query={query} useConfig={getConfig} onQueryResult={this.handleQueryResult} />
        {this.props.children}
      </ColossusProfileContext.Provider>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<{ colossusProfile: ColossusProfileModel }>) => {
    if (!graphql || !graphql.data || !graphql.data.colossusProfile) {
      // Query failed but we don't want to hold up loading. In future, handle this a little better,
      // maybe try to refetch a couple times and if not then just continue on the flow.
      this.onDonePreloading();
      return graphql;
    }

    this.setState({ graphql, colossusProfile: graphql.data.colossusProfile });
    this.onDonePreloading();
    return graphql;
  }

  private onDonePreloading = () => {
    if (this.isInitialQuery) {
      game.trigger(preloadQueryEvents.colossusProfileContext);
      this.isInitialQuery = false;
    }
  }
}
