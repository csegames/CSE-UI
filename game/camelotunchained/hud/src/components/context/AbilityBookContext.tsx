/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { AbilityBookQuery } from 'gql/interfaces';
import { AbilityComponentFragment } from 'gql/fragments/AbilityComponentFragment';

const query = gql`
  query AbilityBookQuery($class: String!) {
    game {
      abilityComponents(class: $class) {
        ...AbilityComponent
      }
    }
    myCharacter {
      progression {
        abilityComponents {
          abilityComponentID
          level
          progressionPoints
        }
      }

      abilities {
        id
        name
        description
        icon
        readOnly
        abilityComponents {
          ...AbilityComponent
        }

        abilityNetwork {
          id
          componentCategories {
            id
            displayInfo {
              name
            }
          }
          display {
            name
          }
        }
      }
    }
  }
  ${AbilityComponentFragment}
`;

export enum Routes {
  Main,
  Magic,
  Melee,
  Archery,
  Throwing,
  Shout,
  Song,
  Misc,
  Components,
}

export interface AbilityNetworks {
  [name: string]: AbilityBookQuery.AbilityNetwork;
}

export interface AbilityNetworkToAbilities {
  [name: string]: AbilityBookQuery.Abilities[];
}

export interface AbilityComponents {
  [id: string]: AbilityBookQuery.AbilityComponents;
}

export interface AbilityComponentIDToProgression {
  [id: string]: AbilityBookQuery._AbilityComponents;
}

export interface ComponentCategoryToComponenentIDs {
  [categoryName: string]: string[];
}

interface State {
  loading: boolean;
  abilityNetworks: AbilityNetworks;
  abilityNetworkToAbilities: AbilityNetworkToAbilities;
  abilityComponents: AbilityComponents;
  abilityComponentIDToProgression: AbilityComponentIDToProgression;
  componentCategoryToComponentIDs: ComponentCategoryToComponenentIDs;
  activeRoute: Routes;
}

interface Functions {
  refetch: () => void;
  resetState: () => void;
  setActiveRoute: (route: Routes) => void;
}

export type ContextState = State & Functions;

function noOp() {}
const defaultAbilityBookState = (): ContextState => {
  return {
    activeRoute: Routes.Components,
    loading: true,
    abilityNetworks: {},
    abilityNetworkToAbilities: {},
    abilityComponents: {},
    abilityComponentIDToProgression: {},
    componentCategoryToComponentIDs: {},

    refetch: noOp,
    resetState: noOp,
    setActiveRoute: noOp,
  };
};

export const AbilityBookContext = React.createContext(defaultAbilityBookState());

export class AbilityBookContextProvider extends React.Component<{}, State> {
  private lastGQL: GraphQLResult<AbilityBookQuery.Query>;
  constructor(props: {}) {
    super(props);
    this.state = defaultAbilityBookState();
  }

  public render() {
    return (
      <AbilityBookContext.Provider value={{
        ...this.state,
        refetch: this.lastGQL && this.lastGQL.refetch ? this.lastGQL.refetch : noOp,
        resetState: this.resetState,
        setActiveRoute: this.setActiveRoute,
      }}>
        <GraphQL
          query={{
            query,
            variables: {
              class: Archetype[camelotunchained.game.selfPlayerState.classID],
            },
          }}
          onQueryResult={this.handleQueryResult}
        />
        {this.props.children}
      </AbilityBookContext.Provider>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<AbilityBookQuery.Query>) => {
    if (graphql.loading || !graphql.data) return graphql;

    this.lastGQL = graphql;
    this.initializeState(graphql);
  }

  private initializeState = (graphql: GraphQLResult<AbilityBookQuery.Query>) => {
    const myCharacter = graphql.data.myCharacter;
    const initialState = this.getInitialState(
      myCharacter.abilities,
      myCharacter.progression ? myCharacter.progression.abilityComponents : [],
      graphql.data.game.abilityComponents,
    );

    this.setState({ ...initialState, loading: false });

    const abilityNetworksArray = Object.keys(initialState.abilityNetworks);
    if (abilityNetworksArray.length > 0) {
      const newRoute = Routes[abilityNetworksArray.sort((a, b) => a.localeCompare(b))[0]];
      this.setActiveRoute(newRoute);
    }
  }

  private getInitialState = (abilities: AbilityBookQuery.Abilities[],
                              abilityComponentProgression: AbilityBookQuery._AbilityComponents[],
                              allAbilityComponents: AbilityBookQuery.AbilityComponents[]) => {
    const abilityNetworks: AbilityNetworks = {};
    const abilityNetworkToAbilities: AbilityNetworkToAbilities = {};
    const abilityComponents: AbilityComponents = {};
    const abilityComponentIDToProgression: AbilityComponentIDToProgression = {};
    const componentCategoryToComponentIDs: ComponentCategoryToComponenentIDs = {};
    abilities.forEach((ability) => {
      const name = ability.abilityNetwork.display.name;

      // Miscellaneous abilities
      if (name !== 'Magic' &&
          name !== 'Melee' &&
          name !== 'Archery' &&
          name !== 'Throwing' &&
          name !== 'Shout' &&
          name !== 'Song') {
        if (!abilityNetworkToAbilities['Misc']) {
          abilityNetworkToAbilities['Misc'] = [ability];
          abilityNetworks['Misc'] = ability.abilityNetwork;
        } else {
          abilityNetworkToAbilities['Misc'].push(ability);
        }
        return;
      }


      if (!abilityNetworkToAbilities[name]) {
        abilityNetworkToAbilities[name] = [ability];
        abilityNetworks[name] = ability.abilityNetwork;
      } else {
        abilityNetworkToAbilities[name].push(ability);
      }
    });

    allAbilityComponents.forEach((abilityComponent) => {
      abilityComponents[abilityComponent.id] = abilityComponent;

      const categoryName = abilityComponent.abilityComponentCategory.displayInfo.name;
      if (componentCategoryToComponentIDs[categoryName]) {
        if (componentCategoryToComponentIDs[categoryName].includes(abilityComponent.id)) {
          // Already contains component id, no need to add duplicate
          return;
        }

        componentCategoryToComponentIDs[categoryName].push(abilityComponent.id);
      } else {
        componentCategoryToComponentIDs[categoryName] = [abilityComponent.id];
      }
    });

    abilityComponentProgression.forEach((progression) => {
      abilityComponentIDToProgression[progression.abilityComponentID] = progression;
    });

    return {
      abilityNetworks,
      abilityNetworkToAbilities,
      abilityComponents,
      abilityComponentIDToProgression,
      componentCategoryToComponentIDs,
    };
  }

  private resetState = () => {
    if (!this.lastGQL) {
      return;
    }

    this.initializeState(this.lastGQL);
  }

  private setActiveRoute = (newRoute: Routes) => {
    this.setState({ activeRoute: newRoute });
  }
}
