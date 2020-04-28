/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { VelocityTransitionGroup } from 'velocity-react';
import { KeyCodes } from '@csegames/library/lib/camelotunchained/utils';

import { ActionBarAnchor } from './ActionBarAnchor';
import { ActionViewContext, EditMode } from '../../context/ActionViewContext';


const Container = styled.div`
  position: fixed;
  pointer-events: none;
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

const ActionBarAnchorContainer = styled.div`
  pointer-events: all;
`;

// tslint:disable-next-line:function-name
export function ActionBars() {
  const actionViewContext = useContext(ActionViewContext);
  const inEditMode = actionViewContext.editMode !== EditMode.Disabled && actionViewContext.editMode !== EditMode.Changing;

  useEffect(() => {
    function disableEditMode(e: KeyboardEvent) {
      if (e.which === KeyCodes.KEY_Escape && actionViewContext.editMode) {
        actionViewContext.disableEditMode();
      }
    }
    if (inEditMode) {
      window.addEventListener('keydown', disableEditMode);
      return () => window.removeEventListener('keydown', disableEditMode);
    } else {
      window.removeEventListener('keydown', disableEditMode);
    }
  }, [actionViewContext.editMode]);

  return (
    <Container id='actionbar-view'>
      <VelocityTransitionGroup enter={{ animation: 'fadeIn' }} leave={{ animation: 'fadeOut' }}>
        {inEditMode && <Lock><Icon><i className='far fa-lock-open'></i></Icon></Lock>}
        {actionViewContext.editMode === EditMode.Changing && <Lock><Icon><i className='far fa-clock'></i></Icon></Lock>}
      </VelocityTransitionGroup>
      {
        Object.values(actionViewContext.anchors)
          .map(anchor => (
            <ActionBarAnchorContainer>
              <ActionBarAnchor
                key={anchor.id}
                {...anchor}
              />
            </ActionBarAnchorContainer>
          ))
      }
    </Container>
  );
}
