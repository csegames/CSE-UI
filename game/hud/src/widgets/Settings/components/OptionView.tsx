/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

interface Props {
  option: GameOption;
  onChange: (option: GameOption) => any;
}

// tslint:disable-next-line:function-name
export function OptionView(props: Props) {
  return (
    <div>Option</div>
  );
}
