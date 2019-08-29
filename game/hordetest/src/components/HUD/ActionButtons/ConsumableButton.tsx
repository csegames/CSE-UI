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
  top: -12px;
  left: 10px;
  right: 0;
  height: 20px;
`;

const Item = styled.div`
  font-size: 12px;
  color: #1c1a16;

  &.active {
    color: #fff;
  }
`;

export interface Props {
  actionIconClass: string;
  keybindText: string;
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
      <ItemList>
        {Object.values(consumableItemsState.items).map((item, i) => {
          const activeClass = consumableItemsState.activeIndex === i ? 'active' : '';
          return (
            <Item className={`${item.iconClass} ${activeClass}`} />
          );
        })}
      </ItemList>
      <ActionButton
        actionIconClass={
          !isEmpty(consumableItemsState.items) ?
            consumableItemsState.items[consumableItemsState.activeIndex].iconClass : ''}
        keybindText={props.keybindText}
        abilityID={props.abilityID}
        className={props.className}
      />
    </Container>
  );
}
