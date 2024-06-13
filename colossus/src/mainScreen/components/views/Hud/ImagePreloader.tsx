/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const Container = 'ImagePreloader-Container';

const imagesToPreload = [
  'images/fullscreen/loadingscreen/bg.jpg',
  'images/fullscreen/loadingscreen/loading-border.png',
  'images/fullscreen/loadingscreen/temp-logo.png'
];

export interface Props {}

export function ImagePreloader(props: Props) {
  return (
    <div className={Container}>
      {imagesToPreload.map((img) => {
        return <img src={img} />;
      })}
    </div>
  );
}
