/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Tooltip, Spinner } from '@csegames/camelot-unchained';
import PatcherModal from '../../../../PatcherModal';
import GenericButton from '../../../../GenericButton';

const Container = styled('div')`
  left: 50%;
  top: 50%;
  margin: 0 auto;
  position: fixed;
  margin-left: -200px;
  margin-top: -100px;
  z-index: 99999;
`;

const Modal = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 400px;
  height: 200px;
  padding: 1em;
`;

const Input = styled('input')`
  margin: 5px 10px;
  background: transparent;
  padding: 15px;
  background: #1A1A1A;
  border: solid 1px #8f8f8f;
  transition: border 0.3s;
  box-shadow: none;
  color: #8f8f8f;
  box-shadow: inset 0px 0px 2px 0px rgba(200,200,200,.1);
  -webkit-mask-image: none !important;
  &:focus {
    outline: 0;
    border: solid .5px #3fd0b0;
    box-shadow: none;
  }
`;

const Label = styled('label')`
  color: #8f8f8f;
`;

const Title = styled('div')`
  font-size: 24px;
  font-weight: 500;
  color: #FFD9D2;
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 5px;
`;

const Text = styled('div')`
  font-size: 1em;
  color: rgb(255,95,76);
`;

const ModalError = styled('div')`
  color: red;
`;

const ModalSuccess = styled('div')`
  color: #3fd0b0;
`;

const ButtonContainer = styled('div')`
  display: flex;
`;

const FailedButton = css`
  background-color: rgba(112, 21, 30, 0.4);
  border-image: linear-gradient(180deg, #ff5f4c, #d13b29) stretch;
  border-image-slice: 1;
  a {
    color: #ff5f4c;
  }
`;

const ButtonGlow = styled('div')`
  position: absolute;
  right: 0;
  left: 10%;
  bottom: -60%;
  width: 80%;
  height: 60%;
  border-radius: 60%;
  box-shadow: 0 0 60px 20px rgba(184, 153, 105, 0.3);
`;


export interface CharacterDeleteModalViewProps {
  error: string;
  success: boolean;
  deleting: boolean;
  deleteEnabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteCharacter: () => void;
  onCancelDelete: () => void;
}

class CharacterDeleteModalView extends React.Component<CharacterDeleteModalViewProps> {
  private nameInput: HTMLInputElement;
  public render() {
    return (
      <Container>
        <PatcherModal
          accentColor='rgb(255,95,76)'
          highlightColorStrong='rgba(255, 95, 76, 0.7)'
          highlightColorWeak='rgba(255, 95, 76, 0.1)'>
          <Modal>
            <Title>Delete character?</Title>
            <Text>Warning! This cannot be undone.</Text>
            <Label>Enter character name to confirm</Label>
            <Input id='name' innerRef={ref => this.nameInput = ref} type='text' onChange={this.props.onChange} />
            {
              this.props.error ?
                <ModalError>
                  <Tooltip content={() => <span>{'An unknown error occurred.'}</span>}>
                      <i className='fa fa-exclamation-circle'></i> Delete failed.
                    </Tooltip>
                </ModalError> :
                null
            }

            {
              this.props.success ?
                <ModalSuccess>
                  <Tooltip
                    content={() => <span>{`Character was deleted.`}</span>}
                    styles={{ tooltip: { maxWidth: '400px' }}}>
                      <i className='fa fa-info-circle'></i> Success!
                  </Tooltip>
                </ModalSuccess> :
                null
            }
            <ButtonContainer>
              {
                this.props.deleting ?
                  <GenericButton>
                    <Spinner />
                  </GenericButton> :
                  <GenericButton
                    className={FailedButton}
                    disabled={!this.props.deleteEnabled}
                    onClick={this.props.deleteEnabled ? this.props.onDeleteCharacter : () => {}}>
                      Delete
                    <ButtonGlow />
                  </GenericButton>
              }
              <GenericButton onClick={this.props.onCancelDelete}>Cancel</GenericButton>
            </ButtonContainer>
          </Modal>
        </PatcherModal>
      </Container>
    );
  }

  public componentDidMount() {
    this.nameInput.focus();
  }
}

export default CharacterDeleteModalView;
