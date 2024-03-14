/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const GeneralContainer = 'Announcements-General-GeneralContainer';
const Title = 'Announcements-General-Title';

const Icon = 'Announcements-General-Icon';

export interface Props {
  text: string;
  iconClass: string;
}

export function General(props: Props) {
  return (
    <div className={GeneralContainer}>
      <div className={Title}>{props.text}</div>
      <div className={`${Icon} ${props.iconClass}`} />
    </div>
  );
}
