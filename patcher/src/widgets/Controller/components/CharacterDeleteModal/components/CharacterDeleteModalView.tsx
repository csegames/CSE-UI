/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Tooltip, Spinner } from '@csegames/camelot-unchained';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  left: 50%;
  top: 50%;
  margin: 0 auto;
  position: fixed;
  width: 400px;
  height: 200px;
  margin-left: -200px;
  margin-top: -100px;
  z-index: 99999;
  background: linear-gradient(#131313, rgba(16, 16, 16, 0.9));
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
  font-size: 2em;
  font-weight: 500;
  color: #3fd0b0;
`;

const Text = styled('div')`
  font-size: .9em;
  font-weight: 200;
  color: #3fd0b0;
`;

const Button = styled('div')`
  margin: 5px;
  padding: 11px;
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.2)' : '#ececec'};
  background-color: #1a1a1a;
  transition: all 0.3s;
  text-align: center;
  font-size: 1.3em;
  font-weight: 200;
  box-shadow: ${props => props.disabled ? 'inset 0px 0px 3px 0px rgba(100,100,100,.1)' :
    'inset 0px 0px 3px 0px rgba(200,200,200,.1)'};
  border: 1px solid #1a1a1a;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  &:hover {
    border: ${props => props.disabled ? '1px solid #1a1a1a' : '1px solid #3fd0b0'};
    color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.2)' : '#3fd0b0'};
  }

  &:focus {
    outline: 0;
  }
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
              <Button>
                <Spinner />
              </Button> :
              <Button
                disabled={!this.props.deleteEnabled}
                onClick={this.props.deleteEnabled ? this.props.onDeleteCharacter : () => {}}>
                Delete
              </Button>
          }
          <Button onClick={this.props.onCancelDelete}>Cancel</Button>
        </ButtonContainer>
      </Container>
    );
  }

  public componentDidMount() {
    this.nameInput.focus();
  }
}

export default CharacterDeleteModalView;
