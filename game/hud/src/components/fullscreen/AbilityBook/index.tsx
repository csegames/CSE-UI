/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { styled } from '@csegames/linaria/react';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SideNav } from './SideNav';
import { AbilityBookQuery } from 'gql/interfaces';
import { AbilityPage } from './AbilityPage';
import { AbilityComponents } from './AbilityComponents';
import { Header } from './Header';
import { useAbilityBookReducer, Routes } from 'services/session/AbilityBookState';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  background-color: black;
`;

// #region PageContainer constants
const PAGE_CONTAINER_PADDING_TOP = 60;
const PAGE_CONTAINER_MARGIN_LEFT = 160;
const PAGE_CONTAINER_RIP_WIDTH = 60;
// #endregion
const PageContainer = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  padding-top: ${PAGE_CONTAINER_PADDING_TOP}px;
  margin-left: ${PAGE_CONTAINER_MARGIN_LEFT}px;
  background-image: url(../images/abilitybook/uhd/ability-book-paper-bg.jpg);
  -webkit-mask-image: url(../images/abilitybook/uhd/paper-mask-x-repeat.png);
  -webkit-mask-size: cover;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: ${PAGE_CONTAINER_RIP_WIDTH}px;
    background-image: url(../images/abilitybook/uhd/paper-left-rip.png);
    background-size: contain;
    background-repeat: repeat-y;
  }

  @media (max-width: 2560px) {
    padding-top: ${PAGE_CONTAINER_PADDING_TOP * MID_SCALE}px;
    margin-left: ${PAGE_CONTAINER_MARGIN_LEFT * MID_SCALE}px;
    &:before {
      width: ${PAGE_CONTAINER_RIP_WIDTH * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    padding-top: ${PAGE_CONTAINER_PADDING_TOP * HD_SCALE}px;
    margin-left: ${PAGE_CONTAINER_MARGIN_LEFT * HD_SCALE}px;
    background-image: url(../images/abilitybook/hd/ability-book-paper-bg.jpg);
    -webkit-mask-image: url(../images/abilitybook/hd/paper-mask-x-repeat.png);

    &:before {
      width: ${PAGE_CONTAINER_RIP_WIDTH * HD_SCALE}px;
      background-image: url(../images/abilitybook/hd/paper-left-rip.png);
    }
  }
`;

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

export interface State {
  refetch: () => void;
  abilityNetworks: AbilityNetworks;
  abilityNetworkToAbilities: AbilityNetworkToAbilities;
  abilityComponents: AbilityComponents;
  abilityComponentIDToProgression: AbilityComponentIDToProgression;
  componentCategoryToComponentIDs: ComponentCategoryToComponenentIDs;
}

export interface Props {
}

const defaultContextState: State = {
  refetch: () => {},
  abilityNetworks: {},
  abilityNetworkToAbilities: {},
  abilityComponents: {},
  abilityComponentIDToProgression: {},
  componentCategoryToComponentIDs: {},
};

export const AbilityBookContext = React.createContext(defaultContextState);

// tslint:disable-next-line:function-name
export function AbilityBook(props: Props) {
  const [state, dispatch] = useAbilityBookReducer();
  const [abilityNetworks, setAbilityNetworks] = useState(defaultContextState.abilityNetworks);
  const [abilityNetworkToAbilities, setAbilityNetworkToAbilities] = useState(defaultContextState.abilityNetworkToAbilities);
  const [abilityComponents, setAbilityComponents] = useState(defaultContextState.abilityComponents);
  const [abilityComponentIDToProgression, setAbilityComponentIDToProgression] =
    useState(defaultContextState.abilityComponentIDToProgression);
  const [componentCategoryToComponentIDs, setComponentCategoryToComponentIDs] =
    useState(defaultContextState.componentCategoryToComponentIDs);

  useEffect(() => {
    return function() {
      dispatch({ type: 'reset' });
    };
  }, []);

  useEffect(() => {},
    [state, abilityNetworks, abilityNetworkToAbilities, abilityComponents, abilityComponentIDToProgression]);

  function onRouteClick(route: Routes) {
    dispatch({ type: 'set-active-route', activeRoute: route });
  }

  function handleQueryResult(graphql: GraphQLResult<AbilityBookQuery.Query>) {
    if (graphql.loading || !graphql.data) return graphql;

    const myCharacter = graphql.data.myCharacter;
    const initialState = getInitialState(
      myCharacter.abilities,
      myCharacter.progression ? myCharacter.progression.abilityComponents : [],
      graphql.data.game.abilityComponents,
    );

    setAbilityNetworks(initialState.abilityNetworks);
    setAbilityNetworkToAbilities(initialState.abilityNetworkToAbilities);
    setAbilityComponents(initialState.abilityComponents);
    setAbilityComponentIDToProgression(initialState.abilityComponentIDToProgression);
    setComponentCategoryToComponentIDs(initialState.componentCategoryToComponentIDs);

    const abilityNetworksArray = Object.keys(initialState.abilityNetworks);
    if (abilityNetworksArray.length > 0) {
      dispatch({
        type: 'set-active-route', activeRoute: Routes[abilityNetworksArray.sort((a, b) => a.localeCompare(b))[0]],
      });
    }
  }

  function getInitialState(abilities: AbilityBookQuery.Abilities[],
                            abilityComponentProgression: AbilityBookQuery._AbilityComponents[],
                            allAbilityComponents: AbilityBookQuery.AbilityComponents[]) {
    const abilityNetworks: AbilityNetworks = {};
    const abilityNetworkToAbilities: AbilityNetworkToAbilities = {};
    const abilityComponents: AbilityComponents = {};
    const abilityComponentIDToProgression: AbilityComponentIDToProgression = {};
    const componentCategoryToComponentIDs: ComponentCategoryToComponenentIDs = {};
    abilities.forEach((ability) => {
      const name = ability.abilityNetwork.display.name;

      // Miscellaneous abilities
      if (name !== 'Magic' && name !== 'Melee' && name !== 'Archery' && name !== 'Throwing' && name !== 'Shout') {
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

  function getHeaderTitle() {
    switch (state.activeRoute) {
      case Routes.Components: {
        return 'Abilities | Components';
      }
      case Routes.Magic: {
        return 'Abilities | Magic';
      }
      case Routes.Melee: {
        return 'Abilities | Melee';
      }
      case Routes.Shout: {
        return 'Abilities | Shout';
      }
      case Routes.Throwing: {
        return 'Abilities | Throwing';
      }
      case Routes.Misc: {
        return 'Abilities | Miscellaneous';
      }
      case Routes.Archery: {
        return 'Abilities | Archery';
      }
      default: {
        return 'Abilities';
      }
    }
  }

  function renderSelectedPage() {
    switch (state.activeRoute) {
      case Routes.Main: {
        return null;
      }
      case Routes.Components: {
        return <AbilityComponents />;
      }
      default: {
        return <AbilityPage />;
      }
    }
  }

  return (
    <GraphQL
      query={{
        query,
        variables: {
          class: Archetype[game.selfPlayerState.classID],
        },
      }}
      onQueryResult={handleQueryResult}>
      {(graphql: GraphQLResult<AbilityBookQuery.Query>) => {
        return (
          <AbilityBookContext.Provider
            value={{
              refetch: graphql.refetch,
              abilityNetworks,
              abilityNetworkToAbilities,
              abilityComponents,
              abilityComponentIDToProgression,
              componentCategoryToComponentIDs,
            }}>
            <Container>
              <Header title={getHeaderTitle()} />
              <Content>
                <SideNav
                  activeRoute={state.activeRoute}
                  onRouteClick={onRouteClick}
                  abilityNetworkNames={Object.keys(abilityNetworks)}
                />
                <PageContainer>
                  {renderSelectedPage()}
                </PageContainer>
              </Content>
            </Container>
          </AbilityBookContext.Provider>
        );
      }}
    </GraphQL>
  );
}
