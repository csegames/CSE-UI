/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Button } from 'components/fullscreen/Button';

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

const ConfirmBindingText = styled.span`
  display: flex;
  align-items: center;
  font-size: 30px;
  font-weight: 500;
  text-transform: uppercase;
  font-family: Colus;
  color: white;
`;

const Key = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
  box-sizing: border-box!important;
  background-color: rgb(7,7,7);
  background: radial-gradient(ellipse at center, rgba(12,12,12,1) 0%,rgba(7,7,7,1) 100%);
  text-align: center;
  padding: 4px 12px;
  margin-right: 7px;
  border: 1px solid #4c4c4c;

  &.unassigned {
    color: rgb(32,32,32);
  }
`;

const ClashContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const ClashContent = styled.div`
  display: flex;
  align-items: center;
  min-height: 26px;
  margin-right: 5px;
  line-height: 26px;
  font-size: 22px;
  color: #4c4c4c;

  .clash-key {
    align-self: center;
    pointer-events: none;
  }
`;

const ClashesContainer = styled.div`
  display: flex;
`;

const StillWantText = styled.i`
  color: #2e2e2e;
  font-size: 22px;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const ButtonStyles = css`
  width: fit-content;
  height: fit-content;
  margin: 40px 10px 0 10px;
  font-size: 22px;
  padding: 15px 0;
  width: 120px;
`;

const ClashingKey = styled.span`
  margin-left: 5px;
`;

export interface Props {
  keybind: Keybind;
  newBind: Binding;
  conflicts: Keybind[];
  onClose: () => void;
  onYesClick: () => void;
  onNoClick: () => void;
}

export class ConfirmBindDialog extends React.Component<Props> {
  public render() {
    return (
      <Container>
        <ConfirmBindingText>Key already bound</ConfirmBindingText>
        {this.props.conflicts.length >= 1 ?
          <ClashContainer>
            <ClashContent>
              <Key>{this.props.newBind.name}</Key> is also bound to
              <ClashesContainer>
                {this.props.conflicts.map((keybind, index) => (
                  <ClashingKey key={index}>
                    "{keybind.description.toTitleCase()}"
                    {index !== this.props.conflicts.length - 1 ? ', ' : ''}
                  </ClashingKey>
                ))}
              </ClashesContainer>
            </ClashContent>
            <StillWantText>Do you still want to rebind?</StillWantText>
          </ClashContainer> : null}
        <ButtonContainer>
          <Button type='blue' text='Yes' onClick={this.props.onYesClick} styles={ButtonStyles} />
          <Button type='gray' text='No' onClick={this.props.onNoClick} styles={ButtonStyles} />
        </ButtonContainer>
      </Container>
    );
  }
}
