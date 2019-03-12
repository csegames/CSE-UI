/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const ClickDiv = styled.div`
  display: inline-block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: auto;
`;

const TextAreaElement = styled.textarea`
  &:focus::placeholder {
    color: transparent;
  }
`;

type Props = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  getInputRef?: (r: HTMLTextAreaElement) => void;
  inputClassName?: string;
  wrapperClassName?: string;
};

export interface State {
  isFocused: boolean;
}

export class TextArea extends React.PureComponent<Props, State> {
  private inputRef: HTMLTextAreaElement = null;
  public render() {
    return (
      <Wrapper className={this.props.wrapperClassName}>
        <TextAreaElement
          ref={(r: HTMLTextAreaElement) => {
            this.inputRef = r;
            this.props.getInputRef(r);
          }}
          className={this.props.inputClassName}
          {...this.props}
        />
        <ClickDiv onClick={this.focus} />
      </Wrapper>
    );
  }

  public focus = () => {
    if (!this.props.disabled) {
      this.inputRef.focus();
      this.inputRef.select();
    }
  }

  public get ref() {
    return this.inputRef;
  }

  public get value() {
    return this.inputRef.value;
  }
}
