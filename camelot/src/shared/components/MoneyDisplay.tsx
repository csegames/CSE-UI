/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import GoldCoinURL from '../../images/icons/coin-gold.png';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';

const DEFAULT_SIZE_VMIN = 2;

// Styles
const Root = 'Shared-MoneyDisplay-Root';
const Icon = 'Shared-MoneyDisplay-Icon';
const Label = 'Shared-MoneyDisplay-Label';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  sizeOverrideVmin?: number;
  isDelta?: boolean;
}

export class MoneyDisplay extends React.Component<Props> {
  public render() {
    const { amount, sizeOverrideVmin, isDelta, className, ...otherProps } = this.props;

    return (
      <div className={`${Root} ${className}`} {...otherProps}>
        <div
          className={`${Label}${isDelta ? ' delta' : ''} ${amount < 0 ? 'negative' : 'positive'}`}
          style={this.buildLabelStyle()}
        >
          {isDelta && amount >= 0 ? '+' : ''}
          {addCommasToNumber(amount.toFixed(0))}
        </div>
        <img className={Icon} src={GoldCoinURL} style={this.buildIconStyle()} />
      </div>
    );
  }

  private getScale(): number {
    return this.props.sizeOverrideVmin ? this.props.sizeOverrideVmin / DEFAULT_SIZE_VMIN : 1;
  }

  private buildIconStyle(): React.CSSProperties {
    const scale = this.getScale();
    let style: React.CSSProperties = {};
    if (scale !== 1) {
      style = {
        width: `${DEFAULT_SIZE_VMIN * scale}vmin`,
        height: `${DEFAULT_SIZE_VMIN * scale}vmin`
      };
    }
    return style;
  }

  private buildLabelStyle(): React.CSSProperties {
    const scale = this.getScale();
    let style: React.CSSProperties = {};
    if (scale !== 1) {
      style = {
        fontSize: `${DEFAULT_SIZE_VMIN * scale * 0.75}rem`
      };
    }
    return style;
  }
}
