/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { styled } from '@csegames/linaria/react';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { AbilityTypeSelect } from './AbilityTypeSelect';
import { AbilityCreation } from './AbilityCreation';
import { Header } from './Header';
import { AbilityBuilderQuery } from 'gql/interfaces';
import { useAbilityBuilderReducer, AbilityType, Routes } from 'services/session/AbilityBuilderState';
import { AbilityComponentFragment } from 'gql/fragments/AbilityComponentFragment';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
`;

const HeaderLink = styled.span`
  pointer-events: all;
  cursor: pointer;

  &:hover {
    filter: brightness(150%);
  }
`;

const query = gql`
  query AbilityBuilderQuery($race: String!, $class: String!) {
    game {
      abilityNetworks {
        id
        display {
          name
        }
        componentCategories {
          id
          isPrimary
          isRequired
          displayOption
          displayInfo {
            name
          }
        }
      }

      abilityComponents(race: $race, class: $class) {
        ...AbilityComponent
      }

    }
  }
  ${AbilityComponentFragment}
`;

export interface NetworkIDToCategories {
  [networkID: string]: AbilityBuilderQuery.ComponentCategories[];
}

export interface CategoryIDToComponents {
  [categoryID: string]: AbilityBuilderQuery.AbilityComponents[];
}

export interface ComponentIDToComponent {
  [componentID: string]: AbilityBuilderQuery.AbilityComponents;
}

export interface State {
  abilityNetworks: AbilityBuilderQuery.AbilityNetworks[];
  abilityComponents: AbilityBuilderQuery.AbilityComponents[];
  networkIDToCategories: NetworkIDToCategories;
  categoryIDToComponents: CategoryIDToComponents;
  componentIDToComponent: ComponentIDToComponent;
}

const defaultAbilityBuilderContext: State = {
  abilityNetworks: [],
  abilityComponents: [],
  networkIDToCategories: {},
  categoryIDToComponents: {},
  componentIDToComponent: {},
};

export const AbilityBuilderContext = React.createContext(defaultAbilityBuilderContext);

// tslint:disable-next-line:function-name
function AbilityBuilder(props: {}) {
  const evh: EventHandle[] = [];
  const [state, dispatch] = useAbilityBuilderReducer();
  const [contextState, setContextState] = useState(defaultAbilityBuilderContext);

  useEffect(() => {
    evh.push(game.on('navigate', (name: string) => {
      if (name.includes('ability-builder')) {
        reset();
      }
    }));

    return function() {
      evh.forEach(e => e.clear());
      reset();
    };
  }, []);

  useEffect(() => {}, [state, contextState]);

  function handleQueryResult(graphql: GraphQLResult<AbilityBuilderQuery.Query>) {
    if (graphql.loading || !graphql.data) return graphql;

    const { abilityNetworks, abilityComponents } = graphql.data.game;
    const networkIDToCategories: NetworkIDToCategories = {};
    const categoryIDToComponents: CategoryIDToComponents = {};
    const componentIDToComponent: ComponentIDToComponent = {};
    abilityNetworks.forEach((network) => {
      networkIDToCategories[network.id] = network.componentCategories;

      network.componentCategories.forEach((category) => {
        // Initialize categoryIDToComponents
        categoryIDToComponents[category.id] = [];
      });
    });

    abilityComponents.forEach((component) => {
      componentIDToComponent[component.id] = component;

      if (categoryIDToComponents[component.abilityComponentCategory.id]) {
        categoryIDToComponents[component.abilityComponentCategory.id].push(component);
      }
    });

    setContextState({
      abilityNetworks,
      abilityComponents,
      networkIDToCategories,
      categoryIDToComponents,
      componentIDToComponent,
    });
  }

  function reset() {
    dispatch({ type: 'reset' });
  }

  function onSelectType(type: AbilityType) {
    dispatch({ type: 'set-selected-type', selectedType: type });
  }

  function renderPage() {
    switch (state.currentRoute) {
      case Routes.AbilityTypeSelect: {
        return <AbilityTypeSelect onSelectType={onSelectType} />;
      }
      case Routes.AbilityCreation: {
        return <AbilityCreation reset={reset} />;
      }
      default: return null;
    }
  }

  function getHeaderTitle() {
    switch (state.currentRoute) {
      case Routes.AbilityTypeSelect: {
        return <div><HeaderLink onClick={reset}>Ability Builder</HeaderLink> | Choose an Ability Type'</div>;
      }

      case Routes.AbilityCreation: {
        return <div><HeaderLink onClick={reset}>Ability Builder</HeaderLink> | {state.selectedType.name}</div>;
      }

      default: {
        return 'Ability Builder';
      }
    }
  }

  function getBackgroundImage(uiContext: UIContext) {
    const hdPrefix = uiContext.isUHD() ? 'uhd' : 'hd';
    const imagePrefix = `images/abilitybuilder/${hdPrefix}/`;
    if (state.currentRoute === Routes.AbilityCreation) {
      return imagePrefix + 'classes-bg-texture.jpg';
    }

    const { classID } = camelotunchained.game.selfPlayerState;
    switch (classID) {
      case Archetype.BlackKnight: {
        return imagePrefix + 'classes-bg-black-knight.jpg';
      }
      case Archetype.Blackguard: {
        return imagePrefix + 'classes-bg-blackguard.jpg';
      }
      case Archetype.Druid: {
        return imagePrefix + 'classes-bg-druid.jpg';
      }
      case Archetype.Empath: {
        return imagePrefix + 'classes-bg-empath.jpg';
      }
      case Archetype.Fianna: {
        return imagePrefix + 'classes-bg-fianna.jpg';
      }
      case Archetype.FlameWarden: {
        return imagePrefix + 'classes-bg-flame-warden.jpg';
      }
      case Archetype.ForestStalker: {
        return imagePrefix + 'classes-bg-forest-stalker.jpg';
      }
      case Archetype.Mjolnir: {
        return imagePrefix + 'classes-bg-mjolnir.jpg';
      }
      case Archetype.Physician: {
        return imagePrefix + 'classes-bg-physician.jpg';
      }
      case Archetype.Stonehealer: {
        return imagePrefix + 'classes-bg-stonehealer.jpg';
      }
      case Archetype.WaveWeaver: {
        return imagePrefix + 'classes-bg-wave-weaver.jpg';
      }
      case Archetype.WintersShadow: {
        return imagePrefix + 'classes-bg-wintersshadow.jpg';
      }
      default: {
        return imagePrefix + 'classes-bg-generic.jpg';
      }
    }
  }

  return (
    <UIContext.Consumer>
        {(uiContext: UIContext) => (
          <AbilityBuilderContext.Provider value={contextState}>
            <GraphQL
              query={{
                query,
                variables: {
                  race: Race[camelotunchained.game.selfPlayerState.race],
                  class: Archetype[camelotunchained.game.selfPlayerState.classID],
                },
              }}
              onQueryResult={handleQueryResult}
            />
            <Container style={{ backgroundImage: `url(${getBackgroundImage(uiContext)})` }}>
              <Header title={getHeaderTitle()} selectedType={state.selectedType} />
              {renderPage()}
            </Container>
          </AbilityBuilderContext.Provider>
        )}
      </UIContext.Consumer>
  );
}

export default AbilityBuilder;
