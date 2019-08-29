/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { CloseButton } from 'cseshared/components/CloseButton';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// const DeleteButton = styled.div`
//   cursor: pointer;
//   color: white;
//   pointer-events: all;
//   &:hover {
//     filter: brightness(140%);
//   }
// `;

// #reegion ModalContainer constants
const MODAL_CONTAINER_WIDTH = 1000;
const MODAL_CONTAINER_BORDER_WIDTH = 2;
// #endregion
const ModalContainer = styled.div`
  width: ${MODAL_CONTAINER_WIDTH}px;
  border: ${MODAL_CONTAINER_BORDER_WIDTH}px solid #6e6c6c;
  border-width: ${MODAL_CONTAINER_BORDER_WIDTH}px;
  position: relative;
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  box-shadow: rgba(136, 70, 63, 0.52) 0px 0px 16px;
  flex: 0 0 auto;
  background: radial-gradient(rgba(255, 95, 76, 0.45), rgba(255, 95, 76, 0.0980392) 60%, transparent) 0% -140px /
    cover no-repeat,linear-gradient(to top,black, transparent), url(../images/contextmenu/modal-bg.jpg);
  border-image: linear-gradient(to bottom,rgb(119, 69, 64), transparent) 1;

  @media (max-width: 2560px) {
    width: ${MODAL_CONTAINER_WIDTH * MID_SCALE}px;
    border: ${MODAL_CONTAINER_BORDER_WIDTH * MID_SCALE}px solid #6e6c6c;
    border-width: ${MODAL_CONTAINER_BORDER_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${MODAL_CONTAINER_WIDTH * HD_SCALE}px;
    border: ${MODAL_CONTAINER_BORDER_WIDTH * HD_SCALE}px solid #6e6c6c;
    border-width: ${MODAL_CONTAINER_BORDER_WIDTH * HD_SCALE}px;
  }
`;

// #region ModalContent constants
const MODAL_CONTENT_WIDTH = 800;
const MODAL_CONTENT_HEIGHT = 400;
// #endregion
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  -webkit-box-align: center;
  align-items: center;
  width: ${MODAL_CONTENT_WIDTH}px;
  height: ${MODAL_CONTENT_HEIGHT}px;
  padding: 1em;
  font-family:titillium web;

  @media (max-width: 2560px) {
    width: ${MODAL_CONTENT_WIDTH * MID_SCALE}px;
    height: ${MODAL_CONTENT_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${MODAL_CONTENT_WIDTH * HD_SCALE}px;
    height: ${MODAL_CONTENT_HEIGHT * HD_SCALE}px;
  }
`;

// #region ModalTitle constants
const MODAL_TITLE_FONT_SIZE = 48;
const MODAL_TITLE_LETTER_SPACING = 10;
// #endregion
const ModalTitle = styled.div`
  font-size: ${MODAL_TITLE_FONT_SIZE}px;
  letter-spacing: ${MODAL_TITLE_LETTER_SPACING}px;
  font-weight: 500;
  color: rgb(255, 217, 210);
  text-transform: uppercase;
  font-family: Caudex;
  text-align: center;

  @media (max-width: 2560px) {
    font-size: ${MODAL_TITLE_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${MODAL_TITLE_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${MODAL_TITLE_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${MODAL_TITLE_LETTER_SPACING * HD_SCALE}px;
  }
`;

const ModalWarning = styled.div`
  font-size: 1em;
  color: rgb(255, 95, 76);
  font-family: TitilliumWeb;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;

  &.column {
    flex-direction: column;
    align-items: center;
  }
`;

// #region ModalButton constants
const MODAL_BUTTON_FONT_SIZE = 28;
const MODAL_BUTTON_PADDING_VERT = 10;
const MODAL_BUTTON_PADDING_HORIZONTAL = 30;
// #endregion
const ModalButton = styled.div`
  font-size: ${MODAL_BUTTON_FONT_SIZE}px;
  padding: ${MODAL_BUTTON_PADDING_VERT}px ${MODAL_BUTTON_PADDING_HORIZONTAL}px;
  font-family: Caudex;
  background-color: rgba(17, 17, 17, 0.8);
  color: #ffdfa0;
  cursor: pointer;
  letter-spacing: .2em;
  text-transform: uppercase;
  transition: all ease .2s;
  border: 1px solid #404040;
  border-width: 2px 1px 2px 1px;
  border-image: url(../images/contextmenu/button-border-gold.png);
  border-image-slice: 2 1 2 1;
  margin:3px;

  &:hover {
    -webkit-filter: brightness(130%);
    background-image: url(../images/contextmenu/button-glow.png) ;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: cover;
    background-position: 50%;
  }

  &:focus, &:active {
    outline: -webkit-focus-ring-color auto 0px;
    background-color: rgba(35, 35, 35, 0.8);
  }

  &.red {
    border-image: url(../images/contextmenu/button-border-red.png);
    color: #dc5959;
  }

  &.red:hover {
    background-image: url(../images/contextmenu/button-glow-red.png) ;
  }

  &.grey {
    border-image: url(../images/contextmenu/button-border-grey.png);
    color: #f3f3f3;
  }

  &.grey:hover {
    background-image: url(../images/contextmenu/button-glow-grey.png) ;
  }

  @media (max-width: 2560px) {
    font-size: ${MODAL_BUTTON_FONT_SIZE * MID_SCALE}px;
    padding: ${MODAL_BUTTON_PADDING_VERT * MID_SCALE}px ${MODAL_BUTTON_PADDING_HORIZONTAL * MID_SCALE}px;
  }
`;

// #region Or constants
const OR_FONT_SIZE = 28;
// #endregion
const Or = styled.div`
  font-size: ${OR_FONT_SIZE}px;
  font-family: Caudex;
  color: #f3f3f3;
  text-transform: uppercase;

  @media (max-width: 2560px) {
    font-size: ${OR_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${OR_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region CloseButtonStyle constants
const CLOSE_BUTTON_STYLE_TOP = 10;
const CLOSE_BUTTON_STYLE_RIGHT = 10;
// #endregion
const CloseButtonStyle = css`
  position: absolute;
  top: ${CLOSE_BUTTON_STYLE_TOP}px;
  right: ${CLOSE_BUTTON_STYLE_RIGHT}px;

  @media (max-width: 2560px) {
    top: ${CLOSE_BUTTON_STYLE_TOP * MID_SCALE}px;
    right: ${CLOSE_BUTTON_STYLE_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${CLOSE_BUTTON_STYLE_TOP * HD_SCALE}px;
    right: ${CLOSE_BUTTON_STYLE_RIGHT * HD_SCALE}px;
  }
`;

export interface Props {
  onCloseClick: () => void;
  onDeleteClick: () => void;
  onModifyClick: () => void;
}

// tslint:disable-next-line:function-name
export function Modal(props: Props) {
  const [wantsToDelete, setWantsToDelete] = useState(false);

  function onFirstDeleteClick() {
    setWantsToDelete(true);
  }

  function onNoClick() {
    setWantsToDelete(false);
  }

  return (
    <ModalContainer>
      <CloseButton onClick={props.onCloseClick} className={CloseButtonStyle} />
      <ModalContent>
        <div>
          <ModalTitle>{wantsToDelete ? 'Are you sure?' : 'What would you like to do?'}</ModalTitle>
          {wantsToDelete && <ModalWarning>This action cannot be undone</ModalWarning>}
        </div>
        {!wantsToDelete ?
          <ButtonContainer className='column'>
            <ModalButton className='grey' onClick={props.onModifyClick}>Modify</ModalButton>
            <Or>OR</Or>
            <ModalButton className='red' onClick={onFirstDeleteClick}>Delete</ModalButton>
          </ButtonContainer> :
          <ButtonContainer>
            <ModalButton className='red' onClick={props.onDeleteClick}>Yes</ModalButton>
            <ModalButton className='grey' onClick={onNoClick}>No</ModalButton>
          </ButtonContainer>
        }
      </ModalContent>
    </ModalContainer>
  );
}
