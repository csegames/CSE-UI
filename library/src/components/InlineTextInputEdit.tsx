/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-22 12:08:53
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-22 16:36:35
 */

import * as React from 'react';
import InlineInputEdit, { InlineInputEditStyle, defaultInlineInputEditStyle,  } from './InlineInputEdit';

export interface InlineTextInputEditProps {
  value: string;
  onSave: (prev: string, entered: string) => Promise<{ok: boolean, error?: string}>;
  styles?: Partial<InlineInputEditStyle>;
}

export function InlineTextInputEdit(props: InlineTextInputEditProps) {
  return <InlineInputEdit type='text' value={props.value} onSave={props.onSave} styles={props.styles} />
};
