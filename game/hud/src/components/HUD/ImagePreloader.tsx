/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const Image = styled.img`
  position: fixed;
  top: -9999px;
  left: -9999px;
`;

const hdImagesToPreload: string[] = [
  'images/abilitybuilder/hd/mask-archery.png',
  'images/abilitybuilder/hd/mask-magic.png',
  'images/abilitybuilder/hd/mask-melee.png',
  'images/abilitybuilder/hd/mask-shout.png',
  'images/abilitybuilder/hd/mask-thrown.png',
];

const uhdImagesToPreload: string[] = [
  'images/abilitybuilder/uhd/mask-archery.png',
  'images/abilitybuilder/uhd/mask-magic.png',
  'images/abilitybuilder/uhd/mask-melee.png',
  'images/abilitybuilder/uhd/mask-shout.png',
  'images/abilitybuilder/uhd/mask-thrown.png',
];

export interface Props {
}

export class ImagePreloader extends React.Component<Props> {
  public render() {
    return (
      <UIContext.Consumer>
        {(uiContext: UIContext) => {
          const imagesToPreload = uiContext.isUHD() ? uhdImagesToPreload : hdImagesToPreload;
          return (
            <div id='image-preloader'>
              {imagesToPreload.map((image) => {
                return <Image src={image} />;
              })}
            </div>
          );
        }}
      </UIContext.Consumer>
    );
  }
}
