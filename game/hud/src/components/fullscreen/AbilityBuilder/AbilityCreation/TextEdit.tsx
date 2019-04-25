/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { TextArea } from 'shared/TextArea';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';
import { AbilityType } from 'services/session/AbilityBuilderState';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

// #region TextAreaStyle constants
const TEXT_AREA_MIN_HEIGHT = 60;
const TEXT_AREA_FONT_SIZE = 40;
const TEXT_AREA_LETTER_SPACING = 10;
// #endregion
const TextAreaStyle = css`
  padding: 0px !important;
  background-color: transparent;
  font-family: Caudex !important;
  color: #D5A5FF !important;
  font-size: ${TEXT_AREA_FONT_SIZE}px !important;
  letter-spacing: ${TEXT_AREA_LETTER_SPACING}px !important;
  min-height: ${TEXT_AREA_MIN_HEIGHT}px;
  width: 100%;
  align-self: center;
  border: 0px !important;
  overflow: hidden !important;
  resize: none !important;
  word-break: break-all !important;

  &.Melee {
    filter: hue-rotate(110deg);
  }

  &.Archery {
    filter: hue-rotate(-75deg);
  }

  &.Shout {
    filter: hue-rotate(135deg);
  }

  &.Throwing {
    filter: hue-rotate(-135deg);
  }

  &::placeholder {
    color: black !important;
    opacity: 0.7;
  }
  &:focus::placeholder {
    color: transparent !important;
  }

  @media (max-width: 2560px) {
    min-height: ${TEXT_AREA_MIN_HEIGHT * MID_SCALE}px;
    font-size: ${TEXT_AREA_FONT_SIZE * MID_SCALE}px !important;
    letter-spacing: ${TEXT_AREA_LETTER_SPACING * MID_SCALE}px !important;
  }

  @media (max-width: 1920px) {
    min-height: ${TEXT_AREA_MIN_HEIGHT * HD_SCALE}px;
    font-size: ${TEXT_AREA_FONT_SIZE * HD_SCALE}px !important;
    letter-spacing: ${TEXT_AREA_LETTER_SPACING * HD_SCALE}px !important;
  }
`;

// #region TextContent constants
const TEXT_CONTENT_FONT_SIZE = 40;
const TEXT_CONTENT_LETTER_SPACING = 10;
// #endregion
const TextContent = styled.div`
  position: absolute;
  width: fit-conent;
  font-family: Caudex;
  color: #D5A5FF;
  font-size: ${TEXT_CONTENT_FONT_SIZE}px;
  letter-spacing: ${TEXT_CONTENT_LETTER_SPACING}px;
  padding: 0px;
  word-break: break-all;
  pointer-events: none;

  @media (max-width: 2560px) {
    font-size: ${TEXT_CONTENT_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${TEXT_CONTENT_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TEXT_CONTENT_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${TEXT_CONTENT_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region EditIcon constants
const EDIT_ICON_FONT_SIZE = 34;
const EDIT_ICON_MARGIN_LEFT = 10;
// #endregion
const EditIcon = styled.div`
  display: inline-block;
  position: relative;
  top: 0px;
  right: 0px;
  font-size: ${EDIT_ICON_FONT_SIZE}px;
  margin-left: ${EDIT_ICON_MARGIN_LEFT}px;
  color: #F5C79A;
  cursor: pointer;
  pointer-events: all;

  &:hover {
    filter: brightness(150%);
  }

  @media (max-width: 2560px) {
    font-size: ${EDIT_ICON_FONT_SIZE * MID_SCALE}px;
    margin-left: ${EDIT_ICON_MARGIN_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${EDIT_ICON_FONT_SIZE * HD_SCALE}px;
    margin-left: ${EDIT_ICON_MARGIN_LEFT * HD_SCALE}px;
  }
`;

export interface Props {
  value: string;
  onChange: (value: string) => void;
  selectedType: AbilityType;

  maxTextLength?: number;
  placeholder?: string;
  containerClass?: string;
  textAreaClass?: string;
}

export class TextEdit extends React.PureComponent<Props> {
  private textAreaRef: HTMLTextAreaElement;
  private textContentRef: HTMLDivElement;
  public render() {
    const { value, placeholder, selectedType, textAreaClass, containerClass } = this.props;
    return (
      <Container className={containerClass}>
        <TextArea
          maxLength={this.props.maxTextLength}
          placeholder={placeholder}
          getInputRef={r => this.textAreaRef = r}
          className={`${selectedType.name} ${TextAreaStyle} ${textAreaClass}`}
          value={value}
          onChange={this.onChange}
        />
        <TextContent ref={(r: HTMLDivElement) => this.textContentRef = r} className={textAreaClass}>
          <span style={{ visibility: 'hidden', opacity: 0 }}>{value}</span>
          &nbsp;
          <EditIcon
            className='icon-edit'
            onClick={this.onEditClick}
          />
        </TextContent>
      </Container>
    );
  }

  public componentDidMount() {
    this.initTextAreaHeight();
  }

  private onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      this.initTextAreaHeight();
      this.props.onChange(value);
    }
  }

  private initTextAreaHeight = () => {
    if (!this.textAreaRef || !this.textContentRef) return;
    this.textAreaRef.style.height = `${this.textContentRef.clientHeight}px`;
  }

  private onEditClick = () => {
    this.textAreaRef.focus();
    this.textAreaRef.select();
  }
}
