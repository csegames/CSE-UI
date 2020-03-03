/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect } from 'react';
import { styled } from '@csegames/linaria/react';
import { VelocityTransitionGroup } from 'velocity-react';

import { useActionStateReducer, EditMode } from 'services/session/ActionViewState';

import { ActionBarAnchor } from './ActionBarAnchor';
import { KeyCodes } from '@csegames/library/lib/camelotunchained/utils';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-items: stretch;
  align-items: stretch;
  width: 100%;
  height: 100%;
  > :first-child {
    flex: 1 1 auto;
  }
`;

const Lock = styled.div`
  font-size: 10em;
  color: rgba(255, 255, 255, 0.6);
  width: 100%;
  height: 100%;
  background: rgba(10, 10, 10, 0.5);
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

// tslint:disable-next-line:function-name
export function ActionBars() {

  const [state, dispatch] = useActionStateReducer();
  console.log('action bar state');
  console.log(state);

  const editMode = state.editMode !== EditMode.Disabled;

  useEffect(() => {
    function disableEditMode(e: KeyboardEvent) {
      if (e.which === KeyCodes.KEY_Escape && state.editMode) {
        dispatch({ type: 'disable-edit-mode' });
      }
    }
    if (editMode) {
      window.addEventListener('keydown', disableEditMode);
      return () => window.removeEventListener('keydown', disableEditMode);
    } else {
      window.removeEventListener('keydown', disableEditMode);
    }
  }, [state.editMode]);

  return (
    <Container id='actionbar-view'>
      <VelocityTransitionGroup enter={{ animation: 'fadeIn' }} leave={{ animation: 'fadeOut' }}>
        {editMode && <Lock><Icon><i className='far fa-lock-open'></i></Icon></Lock>}
      </VelocityTransitionGroup>
      {
        Object.values(state.anchors)
          .map(anchor => (
            <ActionBarAnchor
              key={anchor.id}
              {...anchor}
            />
          ))
      }
    </Container>
  );
}
