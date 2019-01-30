/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import styled from 'react-emotion';

import { AbilityViewAnchor, useAbilityStateReducer } from '../../services/session/AbilityViewState';
import { AbilityBarSlot } from './AbilityBarSlot';
import { ContextMenu } from '../ContextMenu';

const IMG = styled('img')`
  ${(props: { radius: number }) => {
    return `
      width: ${props.radius * 2}px;
      height: ${props.radius * 2}px;
    `;
  }}
`;

const AnchorWrapper = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Container = styled('div')`
  position: relative;
  ${(props: { radius: number }) => {
    return `
      width: ${props.radius * 2}px;
      height: ${props.radius * 2}px;
    `;
  }}
`;

// tslint:disable-next-line:function-name
function AnchorView(props: { index: number; radius: number }) {
  const faction = FactionExt.abbreviation(game.selfPlayerState.faction);
  const ui = useContext(UIContext);
  const definition = ui.isUHD() ? 'uhd' : 'hd';
  return <IMG
    radius={props.radius}
    src={`images/anchor/${definition}/${faction}-dock-${props.index + 1}.png`}
  />;
}

export interface AbilityBarAnchorProps extends AbilityViewAnchor {
}

// tslint:disable-next-line:function-name
export function AbilityBarAnchor(props: AbilityBarAnchorProps) {

  const [state, dispatch] = useAbilityStateReducer();

  const ui = useContext(UIContext);
  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.abilityButtons.display.uhd : theme.abilityButtons.display.hd;

  function handleMouseDown(e: React.MouseEvent) {

    if (e.button !== 0) return;

    // if ctrl+click, go to previous
    if (e.ctrlKey) {
      dispatch({
        type: 'activate-prev-group',
        anchor: props.id,
      });
      return;
    }
    dispatch({
      type: 'activate-next-group',
      anchor: props.id,
    });
  }

  function handleWheel(e: React.WheelEvent) {
    if (e.deltaY < 0) {
      dispatch({
        type: 'activate-prev-group',
        anchor: props.id,
      });
      return;
    }
    dispatch({
      type: 'activate-next-group',
      anchor: props.id,
    });
  }

  function contextMenuItems() {
    const items = [];

    if (state.editMode > 0) {
      items.push({
        title: 'Exit Bar Editor',
        onSelected: () => dispatch({ type: 'disable-edit-mode' }),
      });
    } else {
      items.push({
        title: 'Edit Abilities',
        onSelected: () => dispatch({ type: 'enable-ability-edit-mode' }),
      });
      items.push({
        title: 'Edit Slots',
        onSelected: () => dispatch({ type: 'enable-slot-edit-mode' }),
      });
    }

    return items;
  }

  return (
    <Container {...display}>
      {
        props.children.map(slotID => (
          <AbilityBarSlot
            key={slotID}
            sumAngle={0}
            activeGroup={props.groups[props.activeGroupIndex]}
            {...state.slots[slotID]}
          />
        ))
      }
      <ContextMenu
        type='items'
        getItems={contextMenuItems}
      >
        <AnchorWrapper
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        >
          <AnchorView
            index={props.activeGroupIndex}
            radius={display.radius}
          />
        </AnchorWrapper>
      </ContextMenu>
    </Container>
  );
}
