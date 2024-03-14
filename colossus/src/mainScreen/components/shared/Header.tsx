/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { StarBadge } from '../../../shared/components/StarBadge';

const Container = 'Header-Container';
const Badge = 'Header-Badge';

export interface Props {
  className?: string;
  isSelected?: boolean;
  isBadged?: boolean;
  isDisabled?: boolean;
  children?: any;
  extraBadgeStyle?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

export function Header(props: Props) {
  const selectedClass = props.isSelected ? 'selected' : '';
  const badgedClass = props.isBadged ? 'Badged' : '';
  const disabledClass = props.isDisabled ? 'disabled' : '';
  return (
    <div
      className={`${Container} ${selectedClass} ${disabledClass} ${props.className || ''}`}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
    >
      {props.children}
      <StarBadge className={`${Badge} ${props.extraBadgeStyle ?? ''} ${badgedClass}`} />
    </div>
  );
}
