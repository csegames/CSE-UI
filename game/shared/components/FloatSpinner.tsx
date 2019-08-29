/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Spinner from './Spinner';
import { merge } from 'lodash';

export interface FloatSpinnerStyle {
  spinner: React.CSSProperties;
}

export const defaultFloatSpinnerStyle: FloatSpinnerStyle = {
  spinner: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    zIndex: 99999,
  },
};

export interface FloatSpinnerProps {
  styles?: Partial<FloatSpinnerStyle>;
}

export const FloatSpinner = (props: FloatSpinnerProps) => {
  return <Spinner styles={merge(defaultFloatSpinnerStyle, props.styles || {})}/>;
};

export default FloatSpinner;
