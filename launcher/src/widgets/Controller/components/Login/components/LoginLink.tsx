/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const Link = styled.a`
  color: #d7bb4d;
  transition: all 0.3s;
  display: block;
  &:hover {
    color: #dbc15e;
  }
`;

export interface LoginLinkProps {
  href: string;
  underline?: boolean;
  fontSize?: string;
  margin?: string;
}

class LoginLink extends React.Component<LoginLinkProps> {
  public render() {
    return (
      <Link
        href={this.props.href}
        style={{
          fontSize: this.props.fontSize || '0.9em',
          textDecoration: this.props.underline ? 'underline' : 'none',
          margin: this.props.margin || 0
        }}
        target='_blank'
      >
        {this.props.children}
      </Link>
    );
  }
}

export default LoginLink;
