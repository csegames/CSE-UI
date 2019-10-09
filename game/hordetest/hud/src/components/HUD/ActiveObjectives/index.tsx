/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { ActiveObjectivesContext } from 'components/context/ActiveObjectivesContext';
import { ActiveObjective } from './ActiveObjective';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export interface Props {
}

export interface State {
}

export function ActiveObjectives() {
  const activeObjectivesContext = useContext(ActiveObjectivesContext);
  return (
    <Container>
      {activeObjectivesContext.activeObjectives.map((objective) => {
        return (
          <ActiveObjective key={objective.entityState.entityID} activeObjective={objective} />
        );
      })}
    </Container>
  );
}
