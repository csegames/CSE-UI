/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { debounce, isEqual } from 'lodash';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

import { KeyCodes } from '@csegames/camelot-unchained';
import { TextArea } from 'shared/TextArea';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const MAX_CHARACTERS = 1000;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextAreaStyle = css`
  padding: 0px !important;
  background-color: transparent;
  font-family: Caveat !important;
  font-size: 16px !important;
  color: black !important;
  min-height: 100px;
  width: 100%;
  align-self: center;
  border: 0px !important;
  overflow: hidden !important;
  resize: none !important;
  &::placeholder {
    color: black !important;
    opacity: 0.7;
  }
  &:focus::placeholder {
    color: transparent !important;
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 21px !important;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 32px !important;
  }
`;

const TextContent = styled.div`
  position: absolute;
  width: 100%;
  font-size: 16px;
  font-family: Caveat;
  padding: 0px;
  opacity: 0;
  visibility: hidden;
  white-space: pre;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 21px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 32px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderTitle = styled.div`
  font-family: TradeWinds;
  font-size: 14px;
  color: #0A0706;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 18px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 28px;
  }
`;

const CharacterCount = styled.div`
  width: 100%;
  text-align: right;
  font-family: Caveat;
  font-size: 16px;
  &.not-allowed {
    color: red;
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 21px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 32px;
  }
`;

export interface Props {
  id: string;
  onChange: (notes: string) => void;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface State {
  value: string;
}

class NotesEditor extends React.Component<Props, State> {
  private textAreaRef: HTMLTextAreaElement;
  private textContentRef: HTMLDivElement;
  private contentHeightCache: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.defaultValue || '',
    };

    this.onNoteChange = debounce(this.onNoteChange, 500);
  }

  public render() {
    const characterCount = this.state.value.length;
    return (
      <Container>
        <HeaderContainer>
          <HeaderTitle>Notes</HeaderTitle>
          <CharacterCount className={characterCount > MAX_CHARACTERS ? 'not-allowed' : ''}>
            {characterCount} / {MAX_CHARACTERS}
          </CharacterCount>
        </HeaderContainer>
        <TextArea
          ref={r => this.textAreaRef && (this.textAreaRef = r.ref)}
          disabled={this.props.disabled}
          placeholder={this.props.placeholder || 'Click to add some notes!'}
          value={this.state.value}
          inputClassName={TextAreaStyle}
          onChange={this.onChange}
          onClick={this.onTextAreaFocus}
          onBlur={this.onTextAreaBlur}
        />
        <TextContent ref={(r: HTMLDivElement) => this.textContentRef = r}>
          {this.state.value}
          &nbsp;
        </TextContent>
      </Container>
    );
  }

  public componentDidMount() {
    window.setTimeout(this.initTextAreaHeight, 1);
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.props.id !== nextProps.id || !isEqual(this.state, nextState);
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.props.id !== prevProps.id) {
      this.setState({ value: this.props.defaultValue || '' });
    }
    if (this.state.value !== prevState.value) {
      window.setTimeout(() => {
        if (!this.contentHeightCache || !this.contentHeightCache.floatEquals(this.textContentRef.clientHeight, 0.1)) {
          this.initTextAreaHeight();
        }
      }, 20);
    }
  }

  private initTextAreaHeight = () => {
    if (!this.textAreaRef || !this.textContentRef) return;

    this.contentHeightCache = this.textContentRef.clientHeight;
    this.textAreaRef.style.height = `${this.textContentRef.clientHeight}px`;
  }

  private onTextAreaFocus = () => {
    window.addEventListener('keydown', this.handleTabInput);
  }

  private onTextAreaBlur = () => {
    window.removeEventListener('keydown', this.handleTabInput);
  }

  private handleTabInput = (e: KeyboardEvent) => {
    if (e.keyCode === KeyCodes.KEY_Tab) {
      e.preventDefault();
      const currentVal = this.state.value;
      const selectionIndex = this.textAreaRef.selectionStart;
      const newVal = currentVal.substr(0, selectionIndex) + '    ' +
        currentVal.substr(selectionIndex, currentVal.length);
      this.textAreaRef.value = newVal;
      this.onValueChange(newVal, selectionIndex + 4);
    }
  }

  private onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!this.props.disabled) {
      this.onValueChange(e.target.value);
    }
  }

  private onValueChange = (value: string, newSelectionIndex?: number) => {
    this.setState({ value });

    if (typeof newSelectionIndex !== 'undefined') {
      this.textAreaRef.selectionStart = newSelectionIndex;
      this.textAreaRef.selectionEnd = newSelectionIndex;
    }

    if (value.length <= MAX_CHARACTERS) {
      this.onNoteChange(value);
    }
  }

  private onNoteChange = (notes: string) => {
    this.props.onChange(notes);
  }
}

export default NotesEditor;
