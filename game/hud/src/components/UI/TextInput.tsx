/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import * as React from 'react';
import { css } from 'emotion';
import styled from 'react-emotion';

const Wrapper = styled('div')`
  display: inline-block;
  position: relative;
`;

const inputStyle = css`
  padding: 10px;
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  margin: 5px;
  padding: 15px 10px;
  border: 1px #2c2c2c solid;
  color: #8f8f8f;
  -webkit-mask-image: url(images/button-mask.png);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  background: #2a2a2a;
  font-family:"Titillium Web";
  font-size: 1em;
  transition: border .2s;
  &:focus {
    border: 1px solid #d7bb4d !important;
    box-shadow: 0 1px 2px #d7bb4d !important;
    outline: none;
  }
  &::-webkit-input-placeholder {
    color: rgba(200, 200, 200, 0.2);
  }
`;

const ClickDiv = styled('div')`
  display: inline-block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: auto;
`;

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
  inputClassName?: string;
  getRef?: (r: HTMLInputElement) => void;
};

export class TextInput extends React.PureComponent<Props> {
  private inputRef: HTMLInputElement = null;

  public render() {
    return (
      <Wrapper className={this.props.wrapperClassName}>
        <input
          className={this.props.inputClassName + ' ' + inputStyle}
          type='text'
          ref={this.getRef}
          {...this.props}
        />
        <ClickDiv onClick={this.focus} />
      </Wrapper>
    );
  }

  public focus = () => {
    this.inputRef.focus();
  }

  public get value() {
    return this.inputRef.value;
  }

  private getRef = (r: HTMLInputElement) => {
    this.inputRef = r;

    if (this.props.getRef) {
      this.props.getRef(r);
    }
  }
}
