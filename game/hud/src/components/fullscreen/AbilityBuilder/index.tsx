/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { styled } from '@csegames/linaria/react';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { AbilityTypeSelect } from './AbilityTypeSelect';
import { AbilityCreation } from './AbilityCreation';
import { Header } from './Header';
import { AbilityBuilderQuery } from 'gql/interfaces';

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
  query AbilityBuilderQuery($class: String!) {
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

      abilityComponents(class: $class) {
        id
        display {
          name
          description
          iconURL
        }
        abilityComponentCategory {
          id
        }
        abilityTags
        networkRequirements {
          requireTag {
            tag
          }
          excludeTag {
            tag
          }
          requireComponent {
            component {
              id
              display {
                name
              }
              abilityComponentCategory {
                displayInfo {
                  name
                }
              }
            }
          }
          excludeComponent {
            component {
              id
              display {
                name
              }
              abilityComponentCategory {
                displayInfo {
                  name
                }
              }
            }
          }
        }
      }

    }
  }
`;

export interface AbilityType {
  id: string;
  name: string;
}

export enum Routes {
  AbilityTypeSelect,
  AbilityCreation,
}

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
  currentRoute: Routes;
  selectedType: AbilityType;
  abilityNetworks: AbilityBuilderQuery.AbilityNetworks[];
  abilityComponents: AbilityBuilderQuery.AbilityComponents[];
  networkIDToCategories: NetworkIDToCategories;
  categoryIDToComponents: CategoryIDToComponents;
  componentIDToComponent: ComponentIDToComponent;
}

const defaultAbilityBuilderContext: State = {
  currentRoute: Routes.AbilityTypeSelect,
  selectedType: null,
  abilityNetworks: [],
  abilityComponents: [],
  networkIDToCategories: {},
  categoryIDToComponents: {},
  componentIDToComponent: {},
};

export const AbilityBuilderContext = React.createContext(defaultAbilityBuilderContext);

class AbilityBuilder extends React.PureComponent<{}, State> {
  private evh: EventHandle;
  constructor(props: {}) {
    super(props);
    this.state = { ...defaultAbilityBuilderContext };
  }

  public render() {
    return (
      <UIContext.Consumer>
        {(uiContext: UIContext) => (
          <AbilityBuilderContext.Provider value={this.state}>
            <GraphQL
              query={{
                query,
                variables: {
                  class: Archetype[game.selfPlayerState.classID],
                },
              }}
              onQueryResult={this.handleQueryResult}
            />
            <Container style={{ backgroundImage: `url(${this.getBackgroundImage(uiContext)})` }}>
              <Header title={this.getHeaderTitle()} selectedType={this.state.selectedType} />
              {this.renderPage()}
            </Container>
          </AbilityBuilderContext.Provider>
        )}
      </UIContext.Consumer>
    );
  }

  public componentDidMount() {
    this.evh = game.on('navigate', (name: string) => {
      if (name.includes('ability-builder')) {
        this.reset();
      }
    });
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private handleQueryResult = (graphql: GraphQLResult<AbilityBuilderQuery.Query>) => {
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

    this.setState({
      abilityNetworks,
      abilityComponents,
      networkIDToCategories,
      categoryIDToComponents,
      componentIDToComponent,
    });
  }

  private renderPage = () => {
    switch (this.state.currentRoute) {
      case Routes.AbilityTypeSelect: {
        return <AbilityTypeSelect onSelectType={this.onSelectType} />;
      }
      case Routes.AbilityCreation: {
        return <AbilityCreation reset={this.reset} />;
      }
      default: return null;
    }
  }

  private reset = () => {
    this.setState({ currentRoute: Routes.AbilityTypeSelect, selectedType: null });
  }

  private onSelectType = (type: AbilityType) => {
    this.setState({ selectedType: type, currentRoute: Routes.AbilityCreation });
  }

  private getHeaderTitle = () => {
    switch (this.state.currentRoute) {
      case Routes.AbilityTypeSelect: {
        return <div><HeaderLink onClick={this.reset}>Ability Builder</HeaderLink> | Choose an Ability Type'</div>;
      }

      case Routes.AbilityCreation: {
        return <div><HeaderLink onClick={this.reset}>Ability Builder</HeaderLink> | {this.state.selectedType.name}</div>;
      }

      default: {
        return 'Ability Builder';
      }
    }
  }

  private getBackgroundImage = (uiContext: UIContext) => {
    const hdPrefix = uiContext.isUHD() ? 'uhd' : 'hd';
    const imagePrefix = `images/abilitybuilder/${hdPrefix}/`;
    if (this.state.currentRoute === Routes.AbilityCreation) {
      return imagePrefix + 'classes-bg-texture.jpg';
    }

    const { classID } = game.selfPlayerState;
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
        return '';
      }
    }
  }
}

export default AbilityBuilder;
