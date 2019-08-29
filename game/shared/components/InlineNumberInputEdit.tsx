/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import InlineInputEdit, { InlineInputEditStyle } from './InlineInputEdit';

export interface InlineNumberInputEditProps {
  value: number;
  min?: number;
  max?: number;
  onSave: (prev: number, entered: string) => Promise<{ ok: boolean, error?: string }>;
  styles?: Partial<InlineInputEditStyle>;
}

export const InlineNumberInputEdit = (props: InlineNumberInputEditProps) => {
  return <InlineInputEdit
    type='number'
    inputProps={{ min: props.min, max: props.max }}
    value={props.value}
    onSave={props.onSave}
    styles={props.styles}/>;
};
