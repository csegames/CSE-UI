/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { createSharedState } from 'cseshared/lib/sharedState';

interface SharedAbilityState {
  last: AbilityState | null;
  current: AbilityState;
}

const useStateMethods
  : Dictionary<() => [SharedAbilityState, (state: SharedAbilityState) => SharedAbilityState, () => void]>
  = {};

export const useAbilityState = (abilityID: string) => {

  let cachedUse = useStateMethods[abilityID];
  if (!cachedUse) {
    const initialState: SharedAbilityState = {
      last: null,
      current: { ...camelotunchained.game.abilityStates[abilityID] },
    };

    cachedUse = createSharedState(`ability-state-${abilityID}`, initialState);
    useStateMethods[abilityID] = cachedUse;
  }

  const [state, setState] = cachedUse();

  useEffect(() => {
    const handle = state.current.onUpdated(() => {
      setState({
        last: state.current,
        current: { ...camelotunchained.game.abilityStates[abilityID] },
      });
    });
    return () => handle.clear();
  }, []);

  return [state, setState];
};
