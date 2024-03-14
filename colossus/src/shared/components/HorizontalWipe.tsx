/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import * as React from 'react';

const Root = 'HorizontalWipe-Root';

const DefaultWipeDurationMS = 1000;

export type WipeType = '' | 'white' | 'bifrost';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  type: WipeType;
  wipeDurationMS?: number;
}

export class HorizontalWipe extends React.Component<Props> {
  private keyframeId: string;

  constructor(props: Props) {
    super(props);

    const id = genID();
    this.keyframeId = `Wipe${id}`;
    this.generateKeyframes();
  }

  public render() {
    const { className, style, ...otherProps } = this.props;
    const finalStyle: React.CSSProperties = { ...(style ?? {}), ...this.getWipeStyle() };

    return <div className={`${className} ${Root} ${this.props.type}`} style={finalStyle} {...otherProps} />;
  }

  private getWipeStyle(): React.CSSProperties {
    if (this.props.type === '') {
      return {};
    } else {
      return {
        animation: `${this.keyframeId} ${this.props.wipeDurationMS ?? DefaultWipeDurationMS}ms linear`
      };
    }
  }

  private generateKeyframes(): void {
    // Because each HorizontalWipe needs to animate independently, we have to create unique
    // keyframes and animations for all of them.
    window.document.styleSheets[0].insertRule(
      `@keyframes ${this.keyframeId} { 0% {background-position-x: -30%;} 100% {background-position-x: 130%;}}`
    );
  }

  componentWillUnmount(): void {
    // Remove our keyframes to avoid polluting the style sheets indefinitely.
    // We have to find these by iteration because insertRule() and deleteRule() do not preserve previous indices.
    const styleSheet = window.document.styleSheets[0];
    const rules = styleSheet.cssRules;

    for (let i = 0; i < rules.length; ++i) {
      if (rules.item(i).cssText.includes(this.keyframeId)) {
        styleSheet.deleteRule(i);
        break;
      }
    }
  }
}
