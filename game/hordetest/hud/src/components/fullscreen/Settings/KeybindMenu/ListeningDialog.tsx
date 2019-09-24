/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Button } from '../../Button';

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

const ListeningTitle = styled.div`
  font-size: 30px;
  font-weight: 500;
  text-transform: uppercase;
  font-family: Colus;
  color: white;
  text-align: center;
`;

const ListeningKey = styled.div`
  font-size: 22px;
  margin-top: 20px;
  text-align: center;
  font-style: italic;
  color: #4d4d4d;
`;

const InstructionsText = styled.div`
  font-size: 22px;
  text-align: center;
  color: #2e2e2e;
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
  keybind: Keybind;
  onRemoveBind: () => void;
  onClose: () => void;
}

export class ListeningDialog extends React.Component<Props> {
  public render() {
    return (
      <Container>
        <ListeningTitle>Press any key</ListeningTitle>
        <ListeningKey>Binding: {this.props.keybind.description.toTitleCase()}</ListeningKey>
        <InstructionsText>
          Press the key / key combination you wish to bind to {this.props.keybind.description}.
        </InstructionsText>
        <ButtonsContainer>
          <Button text='Remove' type='gray' onClick={this.props.onRemoveBind} styles={ButtonStyles} />
          <Button text='Cancel' type='gray' onClick={this.props.onClose} styles={ButtonStyles} />
        </ButtonsContainer>
      </Container>
    );
  }
}
