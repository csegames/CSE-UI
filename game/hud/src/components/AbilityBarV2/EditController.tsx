/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from 'linaria/react';
import { useAbilityStateReducer, EditMode } from 'services/session/AbilityViewState';
import { DragMove } from 'components/Utilities/DragMove';

const Container = styled.div`
  position: fixed;
  color: #ececec;
  background: #333;
`;

const Header = styled.div`
  cursor: move;
  padding: 5px;
  padding-top: 10px;
  background: #222;
  position: relative;
  text-align: center;
  font-size: 0.8em;
  &:before {
    content: '';
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    height: 10px;
    background: #111;
  }
`;

const Options = styled.ul`
  margin: 0;
`;

const Option: any = styled.li`
  list-style: none;
  padding: 2px;
  border: 1px solid #666;
  cursor: pointer;
  &:hover {
    filter: brightness(120%);
  }
  ${({ selected }: {selected: boolean;}) => {
    if (selected) {
      return 'background-color: darkorange;';
    }
  }}
`;

interface EditControllerState {
  position: Vec2f;
}

const localStateKey = 'ability-view-edit-controller-state';
// tslint:disable-next-line:function-name
export function EditController() {
  const [abilityState, dispatch] = useAbilityStateReducer();

  const storedState = tryParseJSON<EditControllerState>(localStorage.getItem(localStateKey), false);
  const [state, _setState] = useState(storedState || {
    position: {
      x: 100,
      y: 100,
    },
  });

  function setState(state: EditControllerState) {
    if (state.position.x < 0) {
      state.position.x = 0;
    }
    if (state.position.y < 0) {
      state.position.y = 0;
    }
    _setState(state);
    localStorage.setItem(localStateKey, JSON.stringify(state));
  }

  if (!abilityState.editMode) return null;

  return (
    <Container style={{ top: `${state.position.y}px`, left: `${state.position.x}px` }}>
      <DragMove
        initialPosition={state.position}
        dragBoundary='window'
        onMove={e => setState({
          ...state,
          position: e.position,
        })}
      >
        <Header>
          Bar Control
        </Header>
      </DragMove>
      <Options>
        <Option
          selected={abilityState.editMode === EditMode.SlotEdit}
          onMouseDown={() => dispatch({ type: 'enable-slot-edit-mode' })}
        >
          [S] Edit Slots
        </Option>
        <Option
          selected={abilityState.editMode === EditMode.AbilityEdit}
          onMouseDown={() => dispatch({ type: 'enable-ability-edit-mode' })}
        >
          [A] Edit Abilities
        </Option>
      </Options>
    </Container>
  );
}
