/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { useState } from 'react';

export function useForceUpdate() {
  const [, set] = useState(0);
  const update = () => {
    set(v => v + 1);
  };
  return update;
}
