/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { ActionButton } from './ActionButton';

const Container = styled.div`
  position: relative;
`;

const ItemList = styled.div`
  display: flex;
  position: absolute;
  bottom: -13px;
  left: 0px;
  right: 0;
  height: 20px;
`;

const Item = styled.div`
  font-size: 12px;
  color: #fff;
  opacity: 0.5;

  &.active {
    opacity: 1;
  }
`;

export interface Props {
  actionIconClass: string;
  abilityID?: number;
  className?: string;
}

export function ConsumableButton(props: Props) {
  const [consumableItemsState, setConsumableItemsState] = useState(cloneDeep(hordetest.game.consumableItemsState));

  useEffect(() => {
    const handle = hordetest.game.consumableItemsState.onUpdated(() => {
      setConsumableItemsState(cloneDeep(hordetest.game.consumableItemsState));
    });

    return () => {
      handle.clear();
    };
  });

  return (
    <Container>
      <ActionButton
        actionIconClass={
          (!isEmpty(consumableItemsState.items) && consumableItemsState.items[consumableItemsState.activeIndex].iconClass) ?
            consumableItemsState.items[consumableItemsState.activeIndex].iconClass : 'fas fa-question'}
        keybindText={consumableItemsState.keybindToUse.name}
        keybindIconClass={consumableItemsState.keybindToUse.iconClass}
        abilityID={props.abilityID}
        className={props.className}
      />
      <ItemList>
        {Object.values(consumableItemsState.items).map((item, i) => {
          const activeClass = consumableItemsState.activeIndex === i ? 'active' : '';
          return (
            <Item className={`${item.iconClass || 'fas fa-question'} ${activeClass}`} />
          );
        })}
      </ItemList>
    </Container>
  );
}
