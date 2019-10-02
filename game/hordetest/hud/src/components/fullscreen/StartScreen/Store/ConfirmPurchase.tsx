/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Button } from '../../Button';
import { Skin } from './testData';
import { SkinItem } from './SkinItem';
import { InputContext } from 'components/context/InputContext';

const Container = styled.div`
  width: 65%;
  height: 100%;
  display: flex;
  align-self: center;
  flex-direction: column;
  justify-content: center;
  align-self: center;
`;

const Title = styled.div`
  font-family: Colus;
  font-size: 23px;
  color: #4c4c4c;
  width: 100%;
  margin-bottom: 25px;
  border-width: 0;
  border-bottom-width: 2px;
  border-image: url(../images/fullscreen/underline-border.png);
  border-image-slice: 2;
`;

const CostTitle = styled.div`
  font-family: Lato;
  font-weight: bold;
  color: #8c8c8c;
  margin-bottom: 18px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 50px;
`;

const ButtonStyle = css`
  display: flex;
  padding: 18px 30px;
  font-size: 24px;
  margin-right: 15px;
`;

const ConsoleIcon = styled.span`
  margin-right: 5px;
`;

export interface Props {
  skin: Skin;
}

function noOp() {}

export function ConfirmPurchase(props: Props) {
  function onCancelClick() {
    game.trigger('hide-right-modal');
  }

  return (
    <InputContext.Consumer>
      {({ isConsole }) => (
        <Container>
          <Title>Confirm Purchase</Title>
          <CostTitle>You will use {props.skin.cost} to purchase:</CostTitle>
          <SkinItem disabled width={'70%'} height={'40%'} skin={props.skin} onSkinClick={noOp} />
          <ButtonsContainer>
            {isConsole ?
              <Button
                text={<><ConsoleIcon className='icon-xb-a'></ConsoleIcon> Purchase</>}
                type='blue'
                styles={ButtonStyle}
              /> :
              <Button text='Purchase' type='blue' styles={ButtonStyle} />
            }
            {isConsole ?
              <Button
                text={<><ConsoleIcon className='icon-xb-b'></ConsoleIcon> Cancel</>}
                type='gray'
                styles={ButtonStyle}
              /> :
              <Button text='Cancel' type='gray' onClick={onCancelClick} styles={ButtonStyle} />
            }
          </ButtonsContainer>
        </Container>
      )}
    </InputContext.Consumer>
  );
}
