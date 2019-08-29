/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
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
  const [abilities, setAbilities] = useState(getAbilities());

  useEffect(() => {
    const handle = hordetest.game.abilityBarState.onUpdated(() => {
      setAbilities(getAbilities());
    });

    return () => {
      handle.clear();
    };
  }, [hordetest.game.abilityBarState]);

  function getAbilities() {
    if (hordetest.game.abilityBarState) {
      return Object.values(hordetest.game.abilityBarState.abilities).slice(2, 5);
    }

    return [];
  }

  return (
    <ActionButtonsContainer>
      {abilities.map((ability, i) => {
        return (
          <AbilityButton
            key={ability.id}
            abilityID={ability.id}
            className={ActionButtonSpacing}
            actionIconClass={index2Icon[i]}
            keybindText={ability.boundKeyName}
          />
        );
      })}
      <ConsumableButton
        className={ActionButtonSpacing}
        actionIconClass={index2Icon[3]}
        keybindText={hordetest.game.consumableItemsState.keybindToUse.binds[0].name}
      />
    </ActionButtonsContainer>
  );
}
