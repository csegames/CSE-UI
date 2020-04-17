/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect, useContext } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { AbilityButton } from './AbilityButton';
import { InputContext } from 'components/context/InputContext';

const ActionButtonsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const ActionButtonSpacing = css`
  margin: 0 5px;
`;

export interface Props {
}

export function ActionButtons(props: Props) {
  const inputContext = useContext(InputContext);
  const [weakAbility, setWeakAbility] = useState(cloneDeep(hordetest.game.abilityBarState.weak));
  const [strongAbility, setStrongAbility] = useState(cloneDeep(hordetest.game.abilityBarState.strong));
  const [ultimateAbility, setUltimateAbility] = useState(cloneDeep(hordetest.game.abilityBarState.ultimate));

  useEffect(() => {
    const handle = hordetest.game.abilityBarState.onUpdated(() => {
      const abilityBarState = JSON.parse(JSON.stringify(hordetest.game.abilityBarState));
      if (!abilityBarState) return;

      if (abilityBarState.weak && abilityBarState.weak.id >= 0) {
        setWeakAbility(abilityBarState.weak);
      }

      if (abilityBarState.strong && abilityBarState.strong.id >= 0) {
        setStrongAbility(abilityBarState.strong);
      }

      if (abilityBarState.ultimate && abilityBarState.ultimate.id >= 0) {
        setUltimateAbility(abilityBarState.ultimate);
      }
    });

    return () => {
      handle.clear();
    }
  }, [hordetest.game.abilityBarState]);

  function getAbilityIconClass(abilityIndex: number) {
    let myClass: DeepImmutableObject<CharacterClassDef>;
    try {
      myClass = hordetest.game.classes.find(c => c.id === hordetest.game.selfPlayerState.classID);
    } catch {
    }
    if  (!myClass) {
      console.error('Could not find character def class for ability icon class');
      return '';
    }

    const ability = myClass.abilities[abilityIndex];
    if (!ability) return '';

    return ability.iconClass;
  }

  function getKeybind(index: number, type: 'weak' | 'strong' | 'ultimate') {
    return Object.values(game.keybinds).find(k => k.description === `Ability ${index} (${type})`);
  }

  function renderAbilityButton(ability: AbilityBarItem, i: number, type: 'weak' | 'strong' | 'ultimate') {
    const keybind = getKeybind(i - 1, type);
    const bind = inputContext.isConsole ? keybind.binds[1] : keybind.binds[0];
    return (
      <AbilityButton
        type={type}
        key={ability.id}
        abilityID={ability.id}
        className={ActionButtonSpacing}
        actionIconClass={getAbilityIconClass(i)}
        keybindText={bind ? bind.name : ''}
        keybindIconClass={bind ? bind.iconClass : ''}
      />
    );
  }

  return (
    <ActionButtonsContainer>
      {weakAbility && weakAbility.id >= 0 && renderAbilityButton(weakAbility, 2, 'weak')}
      {strongAbility && strongAbility.id >= 0 && renderAbilityButton(strongAbility, 3, 'strong')}
      {ultimateAbility && ultimateAbility.id >= 0 && renderAbilityButton(ultimateAbility, 4, 'ultimate')}
    </ActionButtonsContainer>
  );
}
