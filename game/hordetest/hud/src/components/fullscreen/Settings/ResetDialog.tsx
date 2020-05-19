/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Button } from '../Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background-image: url(../images/fullscreen/settings/modal-middle.png);
  background-size: 100% 100%;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 500;
  text-transform: uppercase;
  font-family: Colus;
  color: white;
  text-align: center;
`;

const Text = styled.div`
  font-size: 22px;
  margin-top: 20px;
  text-align: center;
  font-style: italic;
  color: #4d4d4d;
`;

const ButtonsContainer = styled.div`
  display: flex;
`;

const ButtonStyles = css`
  width: fit-content;
  height: fit-content;
  margin: 40px 10px 0 10px;
  font-size: 22px;
  padding: 15px;
`;

export interface Props {
  onYesClick: () => void;
  onNoClick: () => void;
}

export function ResetDialog(props: Props) {
  function onYesClick() {
    props.onYesClick();
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);
  }

  function onNoClick() {
    props.onNoClick();
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
  }

  return (
    <Container>
      <Title>Are you sure?</Title>
      <Text>There's no way to go back!</Text>
      <ButtonsContainer>
        <Button text='Yes' type='blue' onClick={onYesClick} styles={ButtonStyles} />
        <Button text='No' type='gray' onClick={onNoClick} styles={ButtonStyles} />
      </ButtonsContainer>
    </Container>
  );
}
