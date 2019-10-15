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

  function getColor(objective: ActiveObjective) {
    const objectiveColor = activeObjectivesContext.colorAssign[objective.entityState.entityID];

    if (!objectiveColor) {
      // We should not get here. Choose unique color that stands out if we do.
      return 'pink';
    }

    return objectiveColor.color;
  }

  const sortedObjectives = activeObjectivesContext.activeObjectives.sort((a, b) =>
    a.entityState.entityID.localeCompare(b.entityState.entityID));
  return (
    <Container>
      {sortedObjectives.map((objective) => {
        return (
          <ActiveObjective
            key={objective.entityState.entityID}
            activeObjective={objective}
            color={getColor(objective)}
          />
        );
      })}
    </Container>
  );
}
