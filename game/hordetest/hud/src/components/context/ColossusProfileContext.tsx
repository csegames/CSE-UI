/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { ChampionDBModel, DefaultChampionDBModel, MatchStatsDBModel } from '@csegames/library/lib/hordetest/graphql/schema';

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
  colossusProfile: null,
  graphql: null,
});

export const ColossusProfileContext = React.createContext(getDefaultColossusProfileState());

export class ColossusProfileProvider extends React.Component<{}, ColossusProfileState> {
  constructor(props: {}) {
    super(props);

    this.state = getDefaultColossusProfileState();
  }

  public render() {
    return (
      <ColossusProfileContext.Provider value={this.state}>
        <GraphQL query={query} onQueryResult={this.handleQueryResult} />
        {this.props.children}
      </ColossusProfileContext.Provider>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<{ colossusProfile: ColossusProfileModel }>) => {
    if (!graphql || !graphql.data || !graphql.data.colossusProfile) {
          return graphql;
    }

    this.setState({ graphql, colossusProfile: graphql.data.colossusProfile });
  }
}

