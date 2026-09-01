/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../redux/store';
import { connect } from 'react-redux';

const Root = 'BasicBorder-Root';
const CornerTL = 'BasicBorder-CornerTL';
const CornerTR = 'BasicBorder-CornerTR';
const CornerBL = 'BasicBorder-CornerBL';
const CornerBR = 'BasicBorder-CornerBR';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class ABasicBorder extends React.Component<Props> {
  render(): React.ReactNode {
    const { className, children, ...otherProps } = this.props;

    return (
      <div className={`${Root} ${className ?? ''}`} {...otherProps}>
        {children}
        <div className={CornerTL} />
        <div className={CornerTR} />
        <div className={CornerBL} />
        <div className={CornerBR} />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const BasicBorder = connect(mapStateToProps)(ABasicBorder);
