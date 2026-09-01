/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';

const Link = 'Controller-Login-LoginLink';

interface ReactProps {
  href: string;
  underline?: boolean;
  fontSize?: string;
  margin?: string;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class ALoginLink extends React.Component<Props> {
  public render() {
    return (
      <a
        className={Link}
        href={this.props.href}
        style={{
          fontSize: this.props.fontSize || '0.9em',
          textDecoration: this.props.underline ? 'underline' : 'none',
          margin: this.props.margin || 0
        }}
        target='_blank'
      >
        {this.props.children}
      </a>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const LoginLink = connect(mapStateToProps)(ALoginLink);
