/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const StarIcon = 'StarBadge-Icon';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export class StarBadge extends React.Component<Props> {
  public render() {
    const { className, ...otherProps } = this.props;
    return (
      <div className={className} {...otherProps}>
        <div className={StarIcon} />
      </div>
    );
  }
}
