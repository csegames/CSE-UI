/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const Container = 'MiddleModal-Container';
const Overlay = 'MiddleModal-Overlay';

interface ReactProps {
  onClickOverlay?: () => void;
  isVisible: boolean;
  heightOverride?: string;
  borderColorOverride?: string;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

export class MiddleModalDisplay extends React.Component<Props> {
  public render() {
    const style: React.CSSProperties = {};
    if ((this.props.heightOverride?.length ?? 0) > 0) {
      style.height = this.props.heightOverride;
    }
    if ((this.props.borderColorOverride?.length ?? 0) > 0) {
      style.borderColor = this.props.borderColorOverride;
    }
    const visibilityClassName = this.props.isVisible ? 'visible' : '';
    return (
      <>
        <div
          className={`${Overlay} ${visibilityClassName}`}
          id={'MiddleModal-Veil'}
          onClick={this.props.onClickOverlay}
        />
        <div className={`${Container} ${visibilityClassName}`} style={style} id={'MiddleModal-CenteringView'}>
          {this.props.children}
        </div>
      </>
    );
  }
}
