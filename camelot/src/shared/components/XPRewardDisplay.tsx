/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';

// Styles
const Root = 'Shared-XPRewardDisplay-Root';
const Icon = 'Shared-XPRewardDisplay-Icon';
const Label = 'Shared-XPRewardDisplay-Label';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  // Progression track icon. Tracks can be authored without one, so we fall back to a plain "XP" suffix.
  iconUrl?: string;
}

export class XPRewardDisplay extends React.Component<Props> {
  public render() {
    const { amount, iconUrl, className, ...otherProps } = this.props;

    return (
      <div className={`${Root} ${className}`} {...otherProps}>
        <div className={Label}>{addCommasToNumber(amount.toFixed(0))}</div>
        {iconUrl ? <img className={Icon} src={iconUrl} /> : <div className={`${Label} suffix`}>{'XP'}</div>}
      </div>
    );
  }
}
