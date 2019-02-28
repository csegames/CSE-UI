/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from 'linaria/react';

const Button = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 170px;
  height: 50px;
  margin: 5px;
  text-align: center;
  font-family: Caudex;
  border-image: linear-gradient(180deg, #e2cb8e, #8e6d27) stretch;
  border-style: solid;
  border-width: 3px 1px;
  transition: background-color .3s;
  background-color: rgba(17, 17, 17, 0.8);
  border-image-slice: 1;
  color: #B89969;
  cursor: pointer;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  -webkit-mask-image: url(/ui/images/controller/button-mask.png);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  transition: all ease .2s;
  text-decoration: none;
  &:hover {
    background-color: rgba(36, 28, 28, 0.8);
    border-image-slice: 1;
    color: #ffd695;
  }

  &.disabled:hover {
    background-color: rgba(17, 17, 17, 0.8);
    border-image-slice: 1;
    color: #B89969;
  }
`;

export interface GenericButtonProps {
  onClick?: (e: React.MouseEvent<any>) => void;
  text?: string;
  className?: string;
  href?: string;
  disabled?: boolean;
}

class GenericButton extends React.Component<GenericButtonProps> {
  public render() {
    const className = `${this.props.disabled ? 'disabled' : ''} ${this.props.className ? this.props.className : ''}`;
    return (
      <Button
        onClick={this.props.onClick}
        className={className}
        href={this.props.href}
        target='_blank'
        style={{
          opacity: this.props.disabled ? 0.5 : 1,
        }}>
        {this.props.text}
        {this.props.children}
      </Button>
    );
  }
}

export default GenericButton;
