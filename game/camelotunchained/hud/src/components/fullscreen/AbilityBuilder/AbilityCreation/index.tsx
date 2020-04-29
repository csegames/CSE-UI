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
import { AbilityBookContext } from 'components/context/AbilityBookContext';
import { ActionViewContext } from 'components/context/ActionViewContext';

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
  const abilityBookContext = useContext(AbilityBookContext);
  const actionViewContext = useContext(ActionViewContext);
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
      createAbilityRequest,
    );

    if (res.ok) {
      setShowModal(true);
      // Note: We arent awaiting these refetchs cause they cant be a bit slow. Because of this, its possible that
      // the player will try to add the ability to the ability bar after its been created but before we have the ability
      // info retrieved. This results in not knowing what icon to display for the ability. To that end, we are placing
      // the info we have here into the ability info on the character knowing that it will be overridden when
      // retrieved from the api
      const abilitiesArray = Object.keys(camelotunchained.game.abilityBarState.abilities);
      const abilityId = Number.parseInt(abilitiesArray[abilitiesArray.length - 1]) + 1;

      console.log(`Setting temp ability ${abilityId} with ${icon}, ${name}`);

      camelotunchained.game.store.trySetTemporaryNewAbilityInfo(abilityId, {id: abilityId, icon, name, description})
      camelotunchained.game.store.refetch();
      abilityBookContext.refetch();
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
      state.modifiedAbilityID,
      createAbilityRequest,
    );

    if (res.ok) {
      setShowModal(true);
      camelotunchained.game.store.refetch();
      abilityBookContext.refetch();
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

  function onAddToHudClick() {
    game.trigger('navigate', 'ability-builder');

    try {
      const abilitiesArray = Object.keys(camelotunchained.game.abilityBarState.abilities);
      const abilityId = Number.parseInt(abilitiesArray[abilitiesArray.length - 1]);
      actionViewContext.queueAddAction(abilityId);
    } catch(e) {
      console.log('Tried to queueAddAction from the ability builder but failed.');
      console.log(e);
    }
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
            onAddToHudClick={onAddToHudClick}
          />
        </>
      }
    </Container>
  ) : null;
}
