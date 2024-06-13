/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { Gender } from '../../../../api/helpers';
import { GraphQLClient, shard } from '../../../../api/graphql';
import { Pick2 } from '../../../../lib/Pick';
import { ArchetypeInfo, RaceInfo } from '../../../../api/webapi';
import { shardConf } from '../../../../api/networkConfig';
import { GraphQLQueryResult } from '../../../../api/query';

const StatType = shard.StatType;
type StatDefinitionGQL = shard.StatDefinitionGQL;
type RaceStatBonuses = shard.RaceStatBonuses;
type StatBonusGQL = shard.StatBonusGQL;

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
  maxPoints: number;
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
  remainingPoints: 0,
  maxPoints: 0,
  distributableStats: [],
  sortedStats: [],
  statIdToValue: {},

  onAllocatePoint: noOp,
  resetValues: noOp
};

export const defaultContextState: ContextState = {
  ...defaultProviderState,
  primaryStats: [],
  secondaryStats: [],
  derivedStats: []
};

export const StatsSelectContext = React.createContext(defaultContextState);

type StatSelectResult = Pick2<shard.CUQuery, 'game', 'settings' | 'stats' | 'baseStatValues' | 'raceStatMods'>;

const statQuery = gql`
  query StatsSelectQuery {
    game {
      settings {
        startingAttributePoints
      }
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
  shard: number;
  host: string;
  selectedRace: RaceInfo;
  selectedGender: Gender;
  selectedClass: ArchetypeInfo;
}

export class StatsSelectContextProvider extends React.Component<Props, ProviderState> {
  private graphql: GraphQLClient<StatSelectResult>;
  private defaultStatValueMap: { [statId: string]: number } = {};
  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultProviderState,
      onAllocatePoint: this.onAllocatePoint.bind(this),
      resetValues: this.resetValues.bind(this)
    };
  }

  public render() {
    const contextValue: ContextState = {
      ...this.state,
      primaryStats: this.getPrimaryStats(),
      secondaryStats: this.getSecondaryStats(),
      derivedStats: this.getDerivedStats()
    };
    return <StatsSelectContext.Provider value={contextValue}>{this.props.children}</StatsSelectContext.Provider>;
  }

  public componentDidMount(): void {
    this.fetchStats();
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.state.sortedStats.length == 0) this.fetchStats();
  }

  private fetchStats() {
    const { host, selectedRace, selectedGender, selectedClass } = this.props;
    if (!host || !selectedRace || !selectedGender || !selectedClass) return;
    this.graphql = new GraphQLClient<StatSelectResult>(shardConf(host));
    this.graphql.query({ query: statQuery }).then((value) => this.handleQueryResult(value));
  }

  private handleQueryResult(graphql: GraphQLQueryResult<StatSelectResult>) {
    if (!graphql || !graphql.ok || !graphql.data?.game) return graphql;

    var game = graphql.data.game;
    this.initializeStatDefs(game.settings.startingAttributePoints, game.stats, game.baseStatValues, game.raceStatMods);
  }

  private onAllocatePoint = (id: string, amount: number) => {
    const { remainingPoints } = this.state;
    const statIdToValue = { ...this.state.statIdToValue };

    // If trying to decrease below 0, or increase above total points, don't allocate any points
    const tryingToDecrease = amount < 0;
    const canDecrease = statIdToValue[id] != null && statIdToValue[id] + amount >= this.defaultStatValueMap[id];
    const tryingToIncrease = amount > 0;
    const canIncrease = remainingPoints > 0;
    if ((tryingToDecrease && !canDecrease) || (tryingToIncrease && !canIncrease)) return;

    if (statIdToValue[id] != null) {
      statIdToValue[id] += amount;
      this.setState({ statIdToValue, remainingPoints: this.state.remainingPoints - amount });
    }
  };

  private resetValues() {
    if (this.graphql) {
      this.graphql.refetch().then((value) => this.handleQueryResult(value));
    }
  }

  private initializeStatDefs(
    startingAttributePoints: number,
    statDefs: StatDefinitionGQL[],
    baseStatValues: StatBonusGQL[],
    raceStatMods: RaceStatBonuses[]
  ) {
    const statIdToValue: StatIdToValue = {};

    // add an entry for every stat
    statDefs.forEach((statDef) => {
      this.defaultStatValueMap[statDef.id] = 0;
      statIdToValue[statDef.id] = 0;
    });

    // Apply baseStatValues
    baseStatValues.forEach((baseStat) => {
      this.defaultStatValueMap[baseStat.stat] = baseStat.amount;
      statIdToValue[baseStat.stat] = baseStat.amount;
    });

    // Add race stat bonuses to stat values
    const selectedRaceStatBonuses = raceStatMods.find((statMod) => statMod.race === this.props.selectedRace.numericID);
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

    this.setState({
      statIdToValue,
      sortedStats,
      distributableStats,
      remainingPoints: startingAttributePoints,
      maxPoints: startingAttributePoints
    });
  }

  private getPrimaryStats() {
    const primaryStats: StatObjectInfo[] = this.state.sortedStats
      .filter((statDef) => statDef.statType === StatType.Primary)
      .map((statDef) => ({
        statDef,
        value: this.state.statIdToValue[statDef.id] || 0,
        defaultValue: this.defaultStatValueMap[statDef.id] || 0
      }));
    return primaryStats;
  }

  private getSecondaryStats() {
    const secondaryStats: StatObjectInfo[] = this.state.sortedStats
      .filter((statDef) => statDef.statType === StatType.Secondary)
      .map((statDef) => ({
        statDef,
        value: this.state.statIdToValue[statDef.id] || 0,
        defaultValue: this.defaultStatValueMap[statDef.id] || 0
      }));
    return secondaryStats;
  }

  private getDerivedStats() {
    const derivedStats: StatObjectInfo[] = this.state.sortedStats
      .filter((statDef) => statDef.statType === StatType.Derived)
      .map((statDef) => ({
        statDef,
        value: this.getStatValue(statDef.id),
        defaultValue: this.defaultStatValueMap[statDef.id] || 0
      }));
    return derivedStats;
  }

  private getStatValue(statID: string) {
    const statDef = this.state.sortedStats.find((statDef) => statDef.id == statID);
    if (statDef == null) {
      return 0;
    }

    const Stat = this.state.statIdToValue;
    let value = Stat[statDef.id];
    if (value == null) {
      value = 0;
    }

    if (statDef.operation == null || statDef.operation.length == 0) {
      return value;
    }

    // find casts to floats and remove them all together
    let operation = statDef.operation.replace(new RegExp(/\( *[Ff]loat *\)/g), '');

    // Find floats in operation and replace them with regular numbers
    operation = operation.replace(new RegExp(/\d[Ff]/g), (substr) => {
      return substr[0];
    });

    // Next change Min to min
    operation = operation.replace(new RegExp(/\Math.\w+/g), (substr) => {
      return `Math.${substr[5].toLowerCase()}${substr.substring(6, substr.length)}`;
    });

    // Get rid of Ctx.GetOrCalculateStat wrapper so it can read from Stat object
    operation = operation.replace(new RegExp(/\Ctx.GetOrCalculateStat\(\w+\W+\w+\)/g), (substr) => {
      return 'this.getStatValue("' + substr.substring(28, substr.length - 1) + '")';
    });

    // tslint:disable
    try {
      value += eval(operation);
    } catch (e) {
      console.error('Failed to evaluate statDef operation', e);
    }

    return value;
  }
}
