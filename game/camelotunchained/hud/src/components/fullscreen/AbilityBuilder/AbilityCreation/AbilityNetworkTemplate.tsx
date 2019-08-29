/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useState, useEffect } from 'react';
import { isArray, isEmpty } from 'lodash';
import { styled } from '@csegames/linaria/react';

import { ComponentSelector } from './ComponentSelector';
import { Preview } from './Preview';
import { CreateAbilityButton } from './CreateAbilityButton';
import { generateRandomAbilityName } from '../utils';
import { AbilityBuilderQuery } from 'gql/interfaces';
import { AbilityBuilderContext, ComponentIDToComponent } from '..';
import { useAbilityBuilderReducer, AbilityType } from 'services/session/AbilityBuilderState';

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

// tslint:disable-next-line:function-name
export function AbilityNetworkTemplate(props: ComponentProps) {
  const { componentIDToComponent } = useContext(AbilityBuilderContext);
  const [state, dispatch] = useAbilityBuilderReducer();
  const [selectedComponentMap, setSelectedComponentMap] =
    useState<{ [categoryID: string]: string | string[] }>(getDefaultSelectedComponentMap());
  const [nameHasBeenEdited, setNameHasBeenEdited] = useState(false);

  useEffect(() => {
    if (state.name === '') {
      dispatch({ type: 'set-name', name: getRandomAbilityName(selectedComponentMap) });
    }

    if (state.icon === '') {
      dispatch({ type: 'set-icon', icon: componentCategories[0].components[0].display.iconURL });
    }
  }, []);

  useEffect(() => {
    setSelectedComponentMap(getDefaultSelectedComponentMap());
  }, [state.abilityComponents]);

  useEffect(() => {}, [componentIDToComponent, state, selectedComponentMap, nameHasBeenEdited]);

  function getDefaultSelectedComponentMap() {
    const selectedComponentMap: { [categoryID: string]: string | string[] } = {};
    props.componentCategories.forEach((category) => {
      if (!isEmpty(state.abilityComponents)) {
        // Preset abilities, example is from Ability Book
        const selectedAbilityComponents = state.abilityComponents
          .filter(id => componentIDToComponent[id].abilityComponentCategory.id === category.def.id);
        if (selectedAbilityComponents.length > 1) {
          selectedComponentMap[category.def.id] = selectedAbilityComponents;
        } else if (selectedAbilityComponents.length === 1) {
          selectedComponentMap[category.def.id] = selectedAbilityComponents[0];
        } else {
          if (category.isMultiSelect) {
            selectedComponentMap[category.def.id] = [];
          } else {
            selectedComponentMap[category.def.id] = null;
          }
        }

        return selectedComponentMap;
      }

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

  function getRandomAbilityName(selectedComponentMap: { [categoryID: string]: string | string[] }) {
    const { componentCategories } = props;
    let name = '';
    let componentOne: AbilityBuilderQuery.AbilityComponents = null;
    let componentTwo: AbilityBuilderQuery.AbilityComponents = null;
    Object.keys(selectedComponentMap).forEach((categoryID) => {
      if (componentCategories[0] && componentCategories[0].def.id === categoryID) {
        if (isArray(selectedComponentMap[categoryID])) {
          componentOne = componentIDToComponent[selectedComponentMap[categoryID][0]];
        } else {
          componentOne = componentIDToComponent[selectedComponentMap[categoryID] as string];
        }
      }

      if (componentCategories[1] && componentCategories[1].def.id === categoryID) {
        if (isArray(selectedComponentMap[categoryID])) {
          componentTwo = componentIDToComponent[selectedComponentMap[categoryID][0]];
        } else {
          componentTwo = componentIDToComponent[selectedComponentMap[categoryID] as string];
        }
      }
    });

    name = generateRandomAbilityName(componentOne, componentTwo);
    return name;
  }

  function getSelectedComponents(): AbilityBuilderQuery.AbilityComponents[] {
    let componentItems: AbilityBuilderQuery.AbilityComponents[] = [];
    Object.keys(selectedComponentMap).forEach((key) => {
      const selectedComponent = selectedComponentMap[key];
      if (isArray(selectedComponent)) {
        componentItems = componentItems.concat(selectedComponent.map(id => componentIDToComponent[id]));
      } else if (selectedComponent) {
        componentItems.push(componentIDToComponent[selectedComponent]);
      }
    });
    return componentItems;
  }

  function onSelectedItemChange(categoryID: string, componentID: string) {
    const selectedComponents = { ...selectedComponentMap };
    if (isArray(selectedComponents[categoryID])) {
      // Is Multi select
      const selectedComponent = selectedComponents[categoryID] as string[];
      if (selectedComponent.includes(componentID)) {
        // Remove from array
        selectedComponents[categoryID] = selectedComponent.filter(component => component !== componentID);
      } else if (componentID !== null) {
        // Add to array
        (selectedComponents[categoryID] as string[]).push(componentID);
      } else {
        // Remove category
        delete selectedComponents[categoryID];
      }
    } else {
      if (componentID === null) {
        // Remove categoryID
        delete selectedComponents[categoryID];
      } else {
        selectedComponents[categoryID] = componentID;
      }
    }

    if (nameHasBeenEdited) {
      setSelectedComponentMap(selectedComponents);
    } else {
      setSelectedComponentMap(selectedComponents);
      dispatch({ type: 'set-name', name: getRandomAbilityName(selectedComponents) });
    }
  }

  function onDescriptionChange(description: string) {
    // do nothing...
  }

  function onSelectedIconChange(icon: string) {
    dispatch({ type: 'set-icon', icon });
  }

  function onNameChange(name: string) {
    dispatch({ type: 'set-name', name });
    setNameHasBeenEdited(true);
  }

  function onCreateClick() {
    const selectedComponents = getSelectedComponents();
    const selectedComponentIDs = selectedComponents.map(c => c.id);

    props.onCreateAbility(
      state.selectedType,
      selectedComponentIDs,
      state.icon,
      state.name,
      '',
    );
  }

  // Filter out empty categories
  const selectedComponentsList = getSelectedComponents();
  const componentCategories = props.componentCategories.filter(category => category.components.length > 0);
  return (
    <Container className='cse-ui-scroller-thumbonly'>
      <ListContainer>
        {componentCategories.map(category => (
          <ComponentSelector
            selectedType={state.selectedType}
            optional={!category.def.isRequired}
            categoryID={category.def.id}
            title={`Select ${category.def.displayInfo.name}`}
            listItems={category.components.map(item => ({ id: item.id, data: item }))}
            selectedItem={selectedComponentMap[category.def.id]}
            onSelectedItemChange={onSelectedItemChange}
            selectedComponentsList={selectedComponentsList}
          />
        ))}
      </ListContainer>
      <Preview
        components={selectedComponentsList}
        selectedType={state.selectedType}
        selectedIcon={state.icon}
        onSelectedIconChange={onSelectedIconChange}
        name={state.name}
        onNameChange={onNameChange}
        description={''}
        onDescriptionChange={onDescriptionChange}
      />
      <CreateAbilityButton
        text={state.isModifying ? 'Modify Ability' : 'Create Ability'}
        selectedType={state.selectedType}
        onClick={onCreateClick}
      />
    </Container>
  );
}
