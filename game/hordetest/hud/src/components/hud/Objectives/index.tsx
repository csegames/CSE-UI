/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { ObjectivesContext, ObjectiveState } from 'components/context/ObjectivesContext';
import { Objective } from './Objective';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export interface Props {
}

export interface State {
}

export function Objectives() {
  const objectivesContext = useContext(ObjectivesContext);

  function getIndicator(objective: ObjectiveState) {
    return objective.indicator;
  }

  function getHUDObjectives() {
    return objectivesContext.objectives.filter((entity) => {
      const { objective } = entity;
      return (objective.visibility & ObjectiveUIVisibility.Hud);
    });
  }

  return (
    <Container>
      {getHUDObjectives().map((objective) => {
        return (
          <Objective
            key={objective.entityID}
            objective={objective}
            indicator={getIndicator(objective)}
          />
        );
      })}
    </Container>
  );
}
