/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface CUIconProps<T> {
  iconContainer?: React.CSSProperties;
  className?: string;
  icon: string;
  iconStyle: React.CSSProperties;
  props?: T;
}

const defaultStyle: React.CSSProperties = {
  position: 'absolute',
  height: '100%',
};

export function renderCUIcon<T>(props: CUIconProps<T>) {
  const internalProps = props.props || {};
  return (
    <span style={{ position: 'relative', ...props.iconContainer }} className={props.className}>
      <span className={props.icon} style={{ ...defaultStyle, ...props.iconStyle }}/>
      <div style={props.iconContainer} {...internalProps} />
    </span>
  );
}

export const CUIcon = renderCUIcon;
export default CUIcon;
