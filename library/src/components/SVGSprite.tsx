/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export const SVGSprite = (props: {
  sprite: string;
  svgClass?: string;
}) => {
  return (
    <svg
      className={this.props.svgClass || ''}
      dangerouslySetInnerHTML={{ __html: `<use xlink:href=${this.props.sprite}></use>` }}>
    </svg>
  );
};

export default SVGSprite;
