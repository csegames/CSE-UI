/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { QueryOptions } from '@csegames/camelot-unchained/lib/graphql/query';
import { patcher } from '../../../../services/patcher';
import { StatDefinitionGQL, StatBonusGQL, RaceStatBonuses, StatsSelectQuery, StatType } from 'gql/interfaces';

export const STATS_TOTAL_POINTS = 30;

export interface StatIdToValue {
  [statId: string]: number;
}

export interface StatObjectInfo {
  statDef: StatDefinitionGQL;
  value: number;
  defaultValue: number;
}

export interface ProviderState {
  remainingPoints: number;
  distributableStats: StatDefinitionGQL[];
  sortedStats: StatDefinitionGQL[];
  statIdToValue: StatIdToValue;

  onAllocatePoint: (statId: string, amount: number) => void;
  resetValues: () => void;
}

export interface ContextState extends ProviderState {
  // These values should not be changed outside of the ContextProvider
  primaryStats: StatObjectInfo[];
  secondaryStats: StatObjectInfo[];
  derivedStats: StatObjectInfo[];
}

function noOp() {}
const defaultProviderState: ProviderState = {
  remainingPoints: STATS_TOTAL_POINTS,
  distributableStats: [],
  sortedStats: [],
  statIdToValue: {},

  onAllocatePoint: noOp,
  resetValues: noOp,
};

export const defaultContextState: ContextState = {
  ...defaultProviderState,
  primaryStats: [],
  secondaryStats: [],
  derivedStats: [],
};

export const StatsSelectContext = React.createContext(defaultContextState);

const query = gql`
  query StatsSelectQuery {
    game {
      stats {
        id
        name
        description
        statType
        showAtCharacterCreation
        addPointsAtCharacterCreation
        operation
      }
      baseStatValues {
        stat
        amount
      }
      raceStatMods {
        race
        statBonuses {
          stat
          amount
        }
      }
    }
  }
`;

export interface Props {
  host: string;
  selectedRace: Race;
  selectedGender: Gender;
  selectedClass: Archetype;
}

export class StatsSelectContextProvider extends React.Component<Props, ProviderState> {
  private graphql: GraphQLResult<StatsSelectQuery.Query>;
  private defaultStatValueMap: { [statId: string]: number } = {};
  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultProviderState,
      onAllocatePoint: this.onAllocatePoint,
      resetValues: this.resetValues,
    };
  }

  public render() {
    const contextValue: ContextState = {
      ...this.state,
      primaryStats: this.getPrimaryStats(),
      secondaryStats: this.getSecondaryStats(),
      derivedStats: this.getDerivedStats(),
    };
    return (
      <StatsSelectContext.Provider value={contextValue}>
        {this.props.host &&
          <GraphQL
            query={{ query, useNamedQueryCache: false }}
            onQueryResult={this.handleQueryResult}
            useConfig={this.getConfig}
          />
        }
        {this.props.children}
      </StatsSelectContext.Provider>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.host !== this.props.host && this.graphql) {
      this.graphql.refetch();
    }
  }

  private handleQueryResult = (graphql: GraphQLResult<StatsSelectQuery.Query>) => {
    this.graphql = graphql;
    if (!graphql || !graphql.data) return graphql;

    this.initializeStatDefs(graphql.data.game.stats, graphql.data.game.baseStatValues, graphql.data.game.raceStatMods);
  }

  private getConfig = () => {
    const queryConf: QueryOptions = {
      url: this.props.host + '/graphql',
      requestOptions: {
        headers: {
          Authorization: `Bearer ${patcher.getAccessToken()}`,
          shardID: `${game.shardID}`,
          characterID: '',
        },
      },
      stringifyVariables: false,
    };

    return {
      queryConf,
      subsConf: null as any,
    };
  }

  private onAllocatePoint = (id: string, amount: number) => {
    const { remainingPoints } = this.state;
    const statIdToValue = { ...this.state.statIdToValue };

    // If trying to decrease below 0, or increase above total points, don't allocate any points
    const tryingToDecrease = amount < 0;
    const canDecrease = statIdToValue[id] && statIdToValue[id] + amount >= this.defaultStatValueMap[id];
    const tryingToIncrease = amount > 0;
    const canIncrease = remainingPoints > 0;
    if ((tryingToDecrease && !canDecrease) || (tryingToIncrease && !canIncrease)) return;

    if (statIdToValue[id]) {
      statIdToValue[id] += amount;
      this.setState({ statIdToValue, remainingPoints: this.state.remainingPoints - amount });
    }
  }

  private resetValues = () => {
    if (this.graphql) {
      this.graphql.refetch();
    }
  }

  private initializeStatDefs = (statDefs: StatDefinitionGQL[],
                                baseStatValues: StatBonusGQL[],
                                raceStatMods: RaceStatBonuses[]) => {
    const statIdToValue: StatIdToValue = {};

    // Initialize stat values with baseStatValues
    baseStatValues.forEach((baseStat) => {
      this.defaultStatValueMap[baseStat.stat] = baseStat.amount;
      statIdToValue[baseStat.stat] = baseStat.amount;
    });

    // Add race stat bonuses to stat values
    const selectedRaceStatBonuses = raceStatMods.find(statMod => statMod.race === Race[this.props.selectedRace]);
    if (selectedRaceStatBonuses) {
      selectedRaceStatBonuses.statBonuses.forEach((statBonus) => {
        this.defaultStatValueMap[statBonus.stat] += statBonus.amount;
        statIdToValue[statBonus.stat] += statBonus.amount;
      });
    }

    // Sort statDefs and if a stat can be modified during char creation, add to distributable stats.
    const sortedStats: StatDefinitionGQL[] = statDefs.sort((a, b) => a.name.localeCompare(b.name));
    const distributableStats: StatDefinitionGQL[] = sortedStats.filter((statDef) => {
      return statDef.addPointsAtCharacterCreation;
    });

    this.setState({ statIdToValue, sortedStats, distributableStats, remainingPoints: STATS_TOTAL_POINTS });
  }

  private getPrimaryStats = () => {
    const primaryStats: StatObjectInfo[] = this.state.sortedStats
      .filter(statDef => statDef.statType === StatType.Primary)
      .map(statDef => ({
        statDef,
        value: this.state.statIdToValue[statDef.id] || 0,
        defaultValue: this.defaultStatValueMap[statDef.id] || 0,
      }));
    return primaryStats;
  }

  private getSecondaryStats = () => {
    const secondaryStats: StatObjectInfo[] = this.state.sortedStats
      .filter(statDef => statDef.statType === StatType.Secondary)
      .map(statDef => ({
        statDef,
        value: this.state.statIdToValue[statDef.id] || 0,
        defaultValue: this.defaultStatValueMap[statDef.id] || 0,
      }));
    return secondaryStats;
  }

  private getDerivedStats = () => {
    const derivedStats: StatObjectInfo[] = this.state.sortedStats
      .filter(statDef => statDef.statType === StatType.Derived)
      .map(statDef => ({
        statDef,
        value: this.getDerivedStatValue(statDef),
        defaultValue: this.defaultStatValueMap[statDef.id] || 0,
      }));
    return derivedStats;
  }

  private getDerivedStatValue = (statDef: StatDefinitionGQL) => {
    // @ts-ignore: no-unused-locals
    const Stat = this.state.statIdToValue;

    // Find floats in operation and replace them with regular numbers
    let operation = statDef.operation.replace(new RegExp(/\dF/g), (substr) => {
      return substr[0];
    });

    // Next change Min to min
    operation = operation.replace(new RegExp(/\Math.\w+/g), (substr) => {
      return `Math.${substr[5].toLowerCase()}${substr.substring(6, substr.length)}`;
    });

    // Get rid of Ctx.GetOrCalculateStat wrapper so it can read from Stat object
    operation = operation.replace(new RegExp(/\Ctx.GetOrCalculateStat\(\w+\W+\w+\)/g), (substr) => {
      return substr.substring(23, substr.length - 1);
    });

    // tslint:disable
    let value = 0;
    try {
      value = eval(operation);
    } catch (e) {
      console.error('Failed to evaluate statDef operation', e);
    }

    return value;
  }
}
