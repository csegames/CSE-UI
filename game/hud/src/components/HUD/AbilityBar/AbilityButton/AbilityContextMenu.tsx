/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { hideContextMenu } from 'actions/contextMenu';
import { showModal } from 'utils/DynamicModal';

const DeleteButton = styled.div`
  cursor: pointer;
  color: white;
  pointer-events: all;
  &:hover {
    filter: brightness(140%);
  }
`;

const ModalContainer = styled.div`
  width: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  box-shadow: rgba(136, 70, 63, 0.52) 0px 0px 16px;
  flex: 0 0 auto;
  background: radial-gradient(rgba(255, 95, 76, 0.45), rgba(255, 95, 76, 0.0980392) 60%, transparent) 0% -140px /
    cover no-repeat,linear-gradient(to top,black, transparent), url(../images/contextmenu/modal-bg.jpg);
  border: 1px solid #6e6c6c;
  border-width: 1px;
  border-image:linear-gradient(to bottom,rgb(119, 69, 64), transparent) 1;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  -webkit-box-align: center;
  align-items: center;
  width: 400px;
  height: 200px;
  padding: 1em;
  font-family:titillium web;
`;

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  color: rgb(255, 217, 210);
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 5px;
`;

const ModalWarning = styled.div`
  font-size: 1em;
  color: rgb(255, 95, 76);
  font-family: TitilliumWeb;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const ModalButton = styled.div`
  font-size: 14px;
  padding: 10px 15px;
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
`;

export interface Props {
  onDeleteClick: () => void;
}

// tslint:disable-next-line:function-name
export function AbilityContextMenu(props: Props) {
  function onDeleteClick(modalProps: { onClose: (result: any) => void }) {
    props.onDeleteClick();
    modalProps.onClose(true);
  }

  function onOpenModal() {
    hideContextMenu();
    showModal({
      render: modalProps => (
        <ModalContainer>
          <ModalContent>
            <div>
              <ModalTitle>Are you sure?</ModalTitle>
              <ModalWarning>Warning! This action cannot be undone.</ModalWarning>
            </div>
            <ButtonContainer>
              <ModalButton className='red' onClick={() => onDeleteClick(modalProps)}>Delete</ModalButton>
              <ModalButton className='grey' onClick={modalProps.onClose}>Cancel</ModalButton>
            </ButtonContainer>
          </ModalContent>
        </ModalContainer>
      ),
      onClose: () => {},
    });
  }
  return (
    <DeleteButton onClick={onOpenModal}>Delete</DeleteButton>
  );
}
