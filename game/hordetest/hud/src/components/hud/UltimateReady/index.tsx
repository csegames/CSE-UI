/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { UltimateReadyView } from './UltimateReadyView';

export function UltimateReady() {
  const [ultAbilityID, setUltAbilityID] = useState(getUltAbilityID());

  useEffect(() => {
    const handle = hordetest.game.abilityBarState.onUpdated(() => {
      const newUltAbilityID = getUltAbilityID();
      if (newUltAbilityID !== ultAbilityID) {
        setUltAbilityID(newUltAbilityID);
      }
    });

    return () => {
      handle.clear();
    };
  }, [hordetest.game.abilityBarState.abilities]);

  function getUltAbilityID() {
    if (hordetest.game.abilityBarState &&
        hordetest.game.abilityBarState.ultimate &&
        hordetest.game.abilityBarState.ultimate.id >= 0) {
      return hordetest.game.abilityBarState.ultimate.id;
    }

    return null;
  }

  return typeof ultAbilityID === 'number' ? (
    <UltimateReadyView ultAbilityID={ultAbilityID} />
  ) : null;
}
