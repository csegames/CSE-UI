/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { AbilityButton } from './AbilityButton';
import { ConsumableButton } from './ConsumableButton';

const ActionButtonsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    position: absolute;
    top: -12px;
    right: 0;
    left: -60px;
    height: 90%;
    width: 130%;
    background-image: url(../images/hud/skills-border.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
`;

const ActionButtonSpacing = css`
  margin: 0 5px;
`;

export interface Props {
}

const index2Icon = [
  'icon-sword-tab',
  'icon-target',
  'icon-damage-lightning',
  'icon-damage-spirit',
  'icon-sword-tab',
  'icon-target',
  'icon-damage-lightning',
  'icon-damage-spirit',
];

export function ActionButtons(props: Props) {
  const [weakAbility, setWeakAbility] = useState(hordetest.game.abilityBarState.weak);
  const [strongAbility, setStrongAbility] = useState(hordetest.game.abilityBarState.strong);
  const [ultimateAbility, setUltimateAbility] = useState(hordetest.game.abilityBarState.ultimate);

  useEffect(() => {
    const handle = hordetest.game.abilityBarState.onUpdated(() => {
      const abilityBarState = JSON.parse(JSON.stringify(hordetest.game.abilityBarState));
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

  function renderAbilityButton(ability: AbilityBarItem, i: number) {
    return (
      <AbilityButton
        key={ability.id}
        abilityID={ability.id}
        className={ActionButtonSpacing}
        actionIconClass={index2Icon[i]}
        keybindText={ability.boundKeyName}
      />
    );
  }

  return (
    <ActionButtonsContainer>
      {weakAbility && weakAbility.id >= 0 && renderAbilityButton(weakAbility, 0)}
      {strongAbility && strongAbility.id >= 0 && renderAbilityButton(strongAbility, 1)}
      {ultimateAbility && ultimateAbility.id >= 0 && renderAbilityButton(ultimateAbility, 2)}
      <ConsumableButton
        className={ActionButtonSpacing}
        actionIconClass={index2Icon[3]}
        keybindText={hordetest.game.consumableItemsState.keybindToUse.binds[0].name}
      />
    </ActionButtonsContainer>
  );
}
