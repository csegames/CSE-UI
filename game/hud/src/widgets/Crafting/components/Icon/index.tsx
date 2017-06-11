/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-11 12:36:43
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-11 12:47:41
 */

import * as React from 'react';

interface IconProps {
  className?: string;
  src?: string;
}

const Icon = (props: IconProps) => {
  return <img className={props.className} src={props.src || 'images/crafting/blank-icon.png'}/>;
};

export default Icon;
