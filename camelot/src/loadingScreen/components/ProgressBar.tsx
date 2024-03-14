/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';

const BarContainer = 'ProgressBar-BarContainer';
const ProgressText = 'ProgressBar-ProgressText';
const Bar = 'ProgressBar-Bar';
const ButtonShine = 'ProgressBar-ButtonShine';

interface Props {
  progress: number;
}

// tslint:disable-next-line:function-name
export function ProgressBar(props: Props) {
  return (
    <div className={BarContainer}>
      <div className={ProgressText}>{props.progress}%</div>
      <div className={Bar} style={{ left: `${-(100 - props.progress)}%` }} />
      {props.progress === 100 && <div className={ButtonShine} />}
    </div>
  );
}
