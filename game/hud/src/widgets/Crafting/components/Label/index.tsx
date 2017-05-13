/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-05 20:53:01
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-13 19:54:19
 */

import * as React from 'react';

interface LabelProps {
  children?: any;
}

const Label = (props: LabelProps) => {
  return (
    <span className='prompt'>{props.children}:</span>
  );
};

export default Label;
