/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect } from 'react';
import styled from 'react-emotion';

import { useAbilityStateReducer } from '../../services/session/AbilityViewState';

import { AbilityBarAnchor } from './AbilityBarAnchor';
import { KeyCodes } from '@csegames/camelot-unchained/lib/utils';
import { EditController } from './EditController';

const Container = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  ${({ editMode }: {editMode: boolean}) => editMode && 'background: rgba(255, 0, 0, 0.2);'}
`;

export interface AbilitiesViewProps {
}

// tslint:disable-next-line:function-name
export function AbilitiesView(props: AbilitiesViewProps) {

  const [state, dispatch] = useAbilityStateReducer();

  useEffect(() => {
    function disableEditMode(e: KeyboardEvent) {
      if (e.which === KeyCodes.KEY_Escape && state.editMode) {
        dispatch({ type: 'disable-edit-mode' });
      }
    }
    if (state.editMode) {
      window.addEventListener('keydown', disableEditMode);
      return () => window.removeEventListener('keydown', disableEditMode);
    } else {
      window.removeEventListener('keydown', disableEditMode);
    }
  }, [state.editMode]);

  return (
    <Container editMode={state.editMode}>
      {
        Object.values(state.anchors)
          .map(anchor => (
            <AbilityBarAnchor
              key={anchor.id}
              {...anchor}
            />
          ))
      }
      <EditController />
    </Container>
  );
}

