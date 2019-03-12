/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { AbilityNetworkTemplate, ComponentCategorySelector } from './AbilityNetworkTemplate';
import { Modal } from './Modal';
import { AbilityType, AbilityBuilderContext, NetworkIDToCategories, CategoryIDToComponents } from '..';
import { AbilityBuilderQuery } from 'gql/interfaces';
import { webAPI } from '@csegames/camelot-unchained';

const Container = styled.div`
  position: relative;
  width: calc(100% - 25px);
  height: calc(100% - 70px);
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 98;
`;

export interface ComponentProps {
  reset: () => void;
}

export interface InjectedProps {
  selectedType: AbilityType;
  abilityNetworks: AbilityBuilderQuery.AbilityNetworks[];
  networkIDToCategories: NetworkIDToCategories;
  categoryIDToComponents: CategoryIDToComponents;
}

export type Props = ComponentProps & InjectedProps;

export interface State {
  name: string;
  icon: string;
  abilityComponents: string[];
  showModal: boolean;
  errorMessage: string;
}

class AbilityCreationView extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      icon: '',
      abilityComponents: [],
      showModal: false,
      errorMessage: '',
    };
  }

  public render() {
    return (
      <Container>
        <AbilityNetworkTemplate
          selectedType={this.props.selectedType}
          componentCategories={this.getComponentCategorySelectors()}
          onCreateAbility={this.onCreateAbility}
        />
        {this.state.showModal &&
          <>
            <Overlay />
            <Modal
              type={this.state.errorMessage ? 'fail' : 'success'}
              name={this.state.name}
              icon={this.state.icon}
              errorMessage={this.state.errorMessage}
              abilityType={this.props.selectedType}
              onTryAgainClick={this.onTryAgainClick}
              onCreateNewClick={this.onCreateNewClick}
            />
          </>
        }
      </Container>
    );
  }

  private getComponentCategorySelectors = () => {
    const { abilityNetworks, selectedType, categoryIDToComponents } = this.props;
    const componentCategorySelectors: ComponentCategorySelector[] = [];
    const selectedNetwork = abilityNetworks.find(network => network.id === selectedType.id);
    selectedNetwork.componentCategories.forEach((category) => {
      componentCategorySelectors.push({
        isMultiSelect: false,
        def: category,
        components: categoryIDToComponents[category.id] || [],
      });
    });

    return componentCategorySelectors;
  }

  private onCreateAbility = async (type: AbilityType,
                                    abilityComponents: string[],
                                    icon: string,
                                    name: string,
                                    description: string) => {
    const { abilityNetworks } = this.props;
    const selectedNetwork = abilityNetworks.find(network => network.id === type.id);
    const createAbilityRequest: CreateAbilityRequest = {
      NetworkID: selectedNetwork.id,
      Name: name,
      Description: description,
      IconURL: icon,
      Components: abilityComponents,
    };
    const res = await webAPI.AbilitiesAPI.CreateAbility(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      createAbilityRequest,
    );

    if (res.ok) {
      this.setState({
        showModal: true,
        abilityComponents,
        icon,
        name,
      });
    } else if (res.data) {
      const errorMessage = JSON.parse(res.data).FieldCodes[0].AbilityResult.Details;
      this.setState({
        showModal: true,
        abilityComponents,
        icon,
        name,
        errorMessage,
      });
    }
  }

  private onTryAgainClick = () => {
    this.setState({
      showModal: false,
      abilityComponents: [],
      icon: '',
      name: '',
      errorMessage: '',
    });
  }

  private onCreateNewClick = () => {
    this.props.reset();
  }
}

export class AbilityCreation extends React.Component<ComponentProps> {
  public render() {
    return (
      <AbilityBuilderContext.Consumer>
        {({ selectedType, networkIDToCategories, categoryIDToComponents, abilityNetworks }) => (
          <AbilityCreationView
            {...this.props}
            selectedType={selectedType}
            networkIDToCategories={networkIDToCategories}
            categoryIDToComponents={categoryIDToComponents}
            abilityNetworks={abilityNetworks}
          />
        )}
      </AbilityBuilderContext.Consumer>
    );
  }
}
