/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { List } from './List';

const Container = 'Leaderboards-Container';
const ListContainer = 'Leaderboards-ListContainer';
const ImageContainer = 'Leaderboards-ImageContainer';

const Image = 'Leaderboards-Image';

export interface Props {}

export function Leaderboards(props: Props) {
  return (
    <div className={Container}>
      <div className={ListContainer}>
        <List />
      </div>
      <div className={ImageContainer}>
        <img className={Image} src='images/hud/champions/amazon.png' />
      </div>
    </div>
  );
}
