/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { Ability } from '@csegames/library/lib/camelotunchained/graphql/schema';
import { DragAndDrop } from 'utils/DragAndDropV2';
import { ActionViewContext } from '../../context/ActionViewContext';
import { Container, AbilityIcon } from './ActionBtn';

export function AddActionBtn() {
  const actionViewContext = useContext(ActionViewContext);
  const ui = useContext(UIContext);

  if (typeof actionViewContext.queuedAbilityId !== 'number') {
    return null;
  }

  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;
  const abilityInfo: Ability = camelotunchained.game.store.getAbilityInfo(actionViewContext.queuedAbilityId);

  return (
    <DragAndDrop
      type='drag'
      defaultIsDragging
      dataTransfer={{
        queuedAbilityId: actionViewContext.queuedAbilityId,
      }}
      dataKey='action-button'
      dragRenderOffset={{ x: -display.radius, y: -display.radius }}
      dragRender={() => {
        return (
          <Container {...display} acceptInput={false}>
            <AbilityIcon icon={abilityInfo.icon} />
          </Container>
        );
    }}>
      <div />
    </DragAndDrop>
  );
}
