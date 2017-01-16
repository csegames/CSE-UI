/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-01 18:42:52
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-01 18:42:52
 */

import * as React from 'react';

export default (props: {
  sprite: string;
  svgClass?: string;
}) => {
  return (
    <svg className={this.props.svgClass || ''}
      dangerouslySetInnerHTML={{ __html: `<use xlink:href=${this.props.sprite}></use>` }}>
    </svg>
  );
}
