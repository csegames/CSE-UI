/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import * as React from 'react';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * SplittingSpan splits all text children into individual, explicit spans by word.
 * This can be useful because Coherent doesn't handle span elements properly in
 * text-wrapping scenarios.
 */
export class SplittingSpan extends React.Component<Props> {
  private key = genID();
  public render(): React.ReactNode {
    const { children } = this.props;
    return (
      <>
        {React.Children.map(children, (child) => {
          if (typeof child === 'string') {
            return (
              <>
                {child.split(' ').map((word, index) => {
                  return <span key={`${this.key}${index}`} style={{ whiteSpace: 'pre' }}>{`${word} `}</span>;
                })}
              </>
            );
          } else {
            return child;
          }
        })}
      </>
    );
  }
}
