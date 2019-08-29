/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { AbilityNetworkTemplate, ComponentCategorySelector } from './AbilityNetworkTemplate';
import { Modal } from './Modal';
import { AbilityBuilderContext } from '..';
import { webAPI } from '@csegames/library/lib/camelotunchained';
import { useAbilityBuilderReducer, AbilityType } from 'services/session/AbilityBuilderState';

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

export interface Props {
  reset: () => void;
}

// tslint:disable-next-line:function-name
export function AbilityCreation(props: Props) {
  const abilityBuilderContext = useContext(AbilityBuilderContext);
  const [state] = useAbilityBuilderReducer();
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal) {
      setShowModal(false);
    }
  }, [state.modifiedAbilityID]);

  function getComponentCategorySelectors() {
    const { abilityNetworks, categoryIDToComponents } = abilityBuilderContext;
    const componentCategorySelectors: ComponentCategorySelector[] = [];
    const selectedNetwork = abilityNetworks.find(network => network.id === state.selectedType.id);
    selectedNetwork.componentCategories.forEach((category) => {
      componentCategorySelectors.push({
        isMultiSelect: false,
        def: category,
        components: categoryIDToComponents[category.id] || [],
      });
    });

    return componentCategorySelectors;
  }

  async function onCreateAbility(type: AbilityType,
                                  abilityComponents: string[],
                                  icon: string,
                                  name: string,
                                  description: string) {
    const { abilityNetworks } = abilityBuilderContext;
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
      camelotunchained.game.selfPlayerState.characterID,
      createAbilityRequest,
    );

    if (res.ok) {
      setShowModal(true);
    } else if (res.data) {
      const errorMessage = JSON.parse(res.data).FieldCodes[0].AbilityResult.Details;
      setErrorMessage(errorMessage);
      setShowModal(true);
    }
  }

  async function onModifyAbility(type: AbilityType,
                                  abilityComponents: string[],
                                  icon: string,
                                  name: string,
                                  description: string) {
    const { abilityNetworks } = abilityBuilderContext;
    const selectedNetwork = abilityNetworks.find(network => network.id === type.id);
    const createAbilityRequest: CreateAbilityRequest = {
      NetworkID: selectedNetwork.id,
      Name: name,
      Description: description,
      IconURL: icon,
      Components: abilityComponents,
    };
    const res = await webAPI.AbilitiesAPI.ModifyAbility(
      webAPI.defaultConfig,
      game.shardID,
      camelotunchained.game.selfPlayerState.characterID,
      state.modifiedAbilityID,
      createAbilityRequest,
    );

    if (res.ok) {
      setShowModal(true);
      game.trigger('refetch-ability-book');
      camelotunchained.game.store.refetch();
    } else if (res.data) {
      const errorMessage = JSON.parse(res.data).FieldCodes[0].AbilityResult.Details;
      setErrorMessage(errorMessage);
      setShowModal(true);
    }
  }

  function onTryAgainClick() {
    this.setState({
      showModal: false,
      abilityComponents: [],
      icon: '',
      name: '',
      errorMessage: '',
    });
  }

  function onCreateNewClick() {
    props.reset();
  }

  return !isEmpty(abilityBuilderContext.abilityNetworks) ? (
    <Container>
      <AbilityNetworkTemplate
        selectedType={state.selectedType}
        componentCategories={getComponentCategorySelectors()}
        onCreateAbility={state.isModifying ? onModifyAbility : onCreateAbility}
      />
      {showModal &&
        <>
          <Overlay />
          <Modal
            type={errorMessage ? 'fail' : 'success'}
            name={state.name}
            icon={state.icon}
            errorMessage={errorMessage}
            abilityType={state.selectedType}
            isModifying={state.isModifying}
            onTryAgainClick={onTryAgainClick}
            onCreateNewClick={onCreateNewClick}
          />
        </>
      }
    </Container>
  ) : null;
}
