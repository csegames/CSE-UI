/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { isArray } from 'lodash';
import { styled } from '@csegames/linaria/react';

import { ComponentSelector } from './ComponentSelector';
import { Preview } from './Preview';
import { CreateAbilityButton } from './CreateAbilityButton';
import { generateRandomAbilityName } from '../utils';
import { AbilityBuilderQuery } from 'gql/interfaces';
import { AbilityBuilderContext, ComponentIDToComponent, AbilityType } from '..';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 0 10px;
  margin-right: 5px;
`;

const ListContainer = styled.div`
  width: 100%;
  height: fit-content;
`;

export interface ComponentCategorySelector {
  def: AbilityBuilderQuery.ComponentCategories;
  components: AbilityBuilderQuery.AbilityComponents[];
  isMultiSelect?: boolean;
}

export interface SelectedComponentMap {
  [categoryID: string]: string | string[];
}

export interface ComponentProps {
  selectedType: AbilityType;
  componentCategories: ComponentCategorySelector[];
  onCreateAbility: (type: AbilityType, abilityComponents: string[], icon: string, name: string, description: string) => void;
}

export interface InjectedProps {
  componentIDToComponent: ComponentIDToComponent;
}

export type Props = ComponentProps & InjectedProps;

export interface State {
  name: string;
  nameHasBeenEdited: boolean;
  description: string;
  selectedIcon: string | null;
  selectedComponentMap: SelectedComponentMap;
}

class AbilityNetworkTemplateView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const selectedComponentMap = this.getDefaultSelectedComponentMap();
    this.state = {
      name: this.getRandomAbilityName(selectedComponentMap),
      nameHasBeenEdited: false,
      description: '',
      selectedIcon: this.props.componentCategories[0].components[0].display.iconURL,
      selectedComponentMap,
    };
  }

  public render() {
    const selectedComponentsList = this.getSelectedComponents();

    // Filter out empty categories
    const componentCategories = this.props.componentCategories.filter(category => category.components.length > 0);
    return (
      <Container className='cse-ui-scroller-thumbonly'>
        <ListContainer>
          {componentCategories.map(category => (
            <ComponentSelector
              selectedType={this.props.selectedType}
              optional={!category.def.isRequired}
              categoryID={category.def.id}
              title={`Select ${category.def.displayInfo.name}`}
              listItems={category.components.map(item => ({ id: item.id, data: item }))}
              selectedItem={this.state.selectedComponentMap[category.def.id]}
              onSelectedItemChange={this.onSelectedItemChange}
              selectedComponentsList={selectedComponentsList}
            />
          ))}
        </ListContainer>
        <Preview
          components={selectedComponentsList}
          selectedType={this.props.selectedType}
          selectedIcon={this.state.selectedIcon}
          onSelectedIconChange={this.onSelectedIconChange}
          name={this.state.name}
          onNameChange={this.onNameChange}
          description={this.state.description}
          onDescriptionChange={this.onDescriptionChange}
        />
        <CreateAbilityButton selectedType={this.props.selectedType} onClick={this.onCreateClick} />
      </Container>
    );
  }

  private getRandomAbilityName = (selectedComponentMap: { [categoryID: string]: string | string[] }) => {
    const { componentCategories } = this.props;
    let name = '';
    let componentOne: AbilityBuilderQuery.AbilityComponents = null;
    let componentTwo: AbilityBuilderQuery.AbilityComponents = null;
    Object.keys(selectedComponentMap).forEach((categoryID) => {
      if (componentCategories[0] && componentCategories[0].def.id === categoryID) {
        if (isArray(selectedComponentMap[categoryID])) {
          componentOne = this.props.componentIDToComponent[selectedComponentMap[categoryID][0]];
        } else {
          componentOne = this.props.componentIDToComponent[selectedComponentMap[categoryID] as string];
        }
      }

      if (componentCategories[1] && componentCategories[1].def.id === categoryID) {
        if (isArray(selectedComponentMap[categoryID])) {
          componentTwo = this.props.componentIDToComponent[selectedComponentMap[categoryID][0]];
        } else {
          componentTwo = this.props.componentIDToComponent[selectedComponentMap[categoryID] as string];
        }
      }
    });

    name = generateRandomAbilityName(componentOne, componentTwo);
    return name;
  }

  private getDefaultSelectedComponentMap = () => {
    const selectedComponentMap: { [categoryID: string]: string | string[] } = {};
    this.props.componentCategories.forEach((category) => {
      if (category.def.isRequired) {
        if (category.isMultiSelect) {
          selectedComponentMap[category.def.id] = [category.components[0].id];
        } else {
          selectedComponentMap[category.def.id] = category.components[0].id;
        }
      } else {
        if (category.isMultiSelect) {
          selectedComponentMap[category.def.id] = [];
        } else {
          selectedComponentMap[category.def.id] = null;
        }
      }
    });

    return selectedComponentMap;
  }

  private getSelectedComponents = (): AbilityBuilderQuery.AbilityComponents[] => {
    let componentItems: AbilityBuilderQuery.AbilityComponents[] = [];
    Object.keys(this.state.selectedComponentMap).forEach((key) => {
      const selectedComponent = this.state.selectedComponentMap[key];
      if (isArray(selectedComponent)) {
        componentItems = componentItems.concat(selectedComponent.map(id => this.props.componentIDToComponent[id]));
      } else if (selectedComponent) {
        componentItems.push(this.props.componentIDToComponent[selectedComponent]);
      }
    });
    return componentItems;
  }

  private onSelectedItemChange = (categoryID: string, componentID: string) => {
    const selectedComponentMap = { ...this.state.selectedComponentMap };
    if (isArray(selectedComponentMap[categoryID])) {
      // Is Multi select
      const selectedComponent = selectedComponentMap[categoryID] as string[];
      if (selectedComponent.includes(componentID)) {
        // Remove from array
        selectedComponentMap[categoryID] = selectedComponent.filter(component => component !== componentID);
      } else if (componentID !== null) {
        // Add to array
        (selectedComponentMap[categoryID] as string[]).push(componentID);
      } else {
        // Remove category
        delete selectedComponentMap[categoryID];
      }
    } else {
      if (componentID === null) {
        // Remove categoryID
        delete selectedComponentMap[categoryID];
      } else {
        selectedComponentMap[categoryID] = componentID;
      }
    }

    this.setState((state) => {
      if (this.state.nameHasBeenEdited) {
        return {
          ...state,
          selectedComponentMap,
        };
      }

      return {
        ...state,
        selectedComponentMap,
        name: this.getRandomAbilityName(selectedComponentMap),
      };
    });
  }

  private onDescriptionChange = (description: string) => {
    this.setState({ description });
  }

  private onSelectedIconChange = (icon: string) => {
    this.setState({ selectedIcon: icon });
  }

  private onNameChange = (name: string) => {
    this.setState({ name, nameHasBeenEdited: true });
  }

  private onCreateClick = () => {
    const selectedComponents = this.getSelectedComponents();
    const selectedComponentIDs = selectedComponents.map(c => c.id);

    this.props.onCreateAbility(
      this.props.selectedType,
      selectedComponentIDs,
      this.state.selectedIcon,
      this.state.name,
      this.state.description,
    );
  }
}

export class AbilityNetworkTemplate extends React.Component<ComponentProps> {
  public render() {
    return (
      <AbilityBuilderContext.Consumer>
        {({ componentIDToComponent }) => (
          <AbilityNetworkTemplateView {...this.props} componentIDToComponent={componentIDToComponent} />
        )}
      </AbilityBuilderContext.Consumer>
    );
  }
}
