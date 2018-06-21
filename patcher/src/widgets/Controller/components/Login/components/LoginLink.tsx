/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';

const Link = styled('a')`
  margin: ${props => props.margin ? props.margin : 0};
  text-decoration: ${props => props.underline ? 'underline' : 'none'};
  color: ${utils.darkenColor('#d7bb4d', 10)};
  transition: all 0.3s;
  font-size: ${props => props.fontSize ? props.fontSize : '0.9em'};
  display: block;
  &:hover {
    color: ${utils.lightenColor('#d7bb4d', 10)};
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
        fontSize={this.props.fontSize}
        underline={this.props.underline}
        margin={this.props.margin}
        target='_blank'
      >
        {this.props.children}
      </Link>
    );
  }
}

export default LoginLink;
