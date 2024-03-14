/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { PlayerDifferentiatorState } from '.';

const Container = 'WorldSpace-PlayerDifferentiator-Container';
const Diamond = 'WorldSpace-PlayerDifferentiator-Diamond';

const colors = ['#bd55fd', '#63263b', '#50b2e0', '#d3af4d', '#ab0d49', '#d9d82d', '#c1b2bf', '#14820e'];

export interface Props {
  state: PlayerDifferentiatorState;
}

export function PlayerDifferentiator(props: Props) {
  return (
    <div className={Container}>
      <div className={Diamond} style={{ backgroundColor: colors[props.state.differentiator] || 'blue' }} />
    </div>
  );
}
