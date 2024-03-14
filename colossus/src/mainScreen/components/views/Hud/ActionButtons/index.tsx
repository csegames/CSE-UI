/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { strongAbilityID, ultimateAbilityID, weakAbilityID } from '../../../../redux/abilitySlice';
import { ActionButton } from './ActionButton';

const ActionButtonsContainer = 'ActionButtons-ActionButtonsContainer';

export class ActionButtons extends React.Component {
  public render() {
    return (
      <div id='ActionButtonsContainer' className={ActionButtonsContainer}>
        <ActionButton type='weak' abilityIndex={weakAbilityID} />
        <ActionButton type='strong' abilityIndex={strongAbilityID} />
        <ActionButton type='ultimate' abilityIndex={ultimateAbilityID} />
      </div>
    );
  }
}
