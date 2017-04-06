/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-01 18:44:39
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-01 18:44:39
 */

import * as React from 'react';

export default (props: {
  containerClass?: string;
  icon: string;
}) => {
  return (
    <div className={this.props.containerClass || 'ActiveEffectIcon'}>
      <img src={this.props.icon} />
    </div>
  );
};
