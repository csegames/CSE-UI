/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import * as React from 'react';
import { styled } from 'linaria/react';
import { Dialog } from 'components/UI/Dialog';
import { TextInput } from 'components/UI/TextInput';

const Container = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 300px;
  pointer-events: auto;
  z-index: 1;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  justify-content: space-around;
  color: #ececec;
  padding-top: 10px;
  background-image: url(/hud-new/images/settings/bag-bg-grey.png);
  background-repeat: no-repeat;
  background-position: top center;
  overflow: auto;
  box-sizing: border-box!important;
  min-height: 150px;
`;

export const Btn = styled.div`
  position: relative;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 170px;
  height: 50px;
  margin: 5px;
  text-align: center;
  font-family: Caudex;
  border-image: linear-gradient(180deg, #e2cb8e, #8e6d27) stretch;
  border-style: solid;
  border-width: 3px 1px;
  transition: background-color .3s;
  background-color: rgba(17, 17, 17, 0.8);
  border-image-slice: 1;
  color: ${(props: any) => props.textColor ? props.textColor : '#B89969'};
  cursor: pointer;
  opacity: ${(props: any) => props.disabled ? 0.5 : 1};
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  -webkit-mask-image: url(/hud-new/images/button-mask.png);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  transition: all ease .2s;
  text-decoration: none;
  &:hover {
    background-color: ${(props: any) => props.disabled ? '' : 'rgba(36, 28, 28, 0.8)'};
    border-image-slice: 1;
    color: ${(props: any) => props.disabled ? '' : '#ffd695'};
  }
`;


const Error = styled.div`
  color: darkred;
`;

export interface BlueprintNameDialogProps {
}

export interface BlueprintNameDialogState {
  visible: boolean;
  failure?: Failure;
}

export class BlueprintNameDialog extends React.PureComponent<BlueprintNameDialogProps, BlueprintNameDialogState> {
  private createBPHandle: EventHandle = null;
  private inputRef: TextInput = null;

  constructor(props: BlueprintNameDialogProps) {
    super(props);
    this.state = {
      visible: false,
    };

    this.createBPHandle = game.onWantCreateBlueprintFromSelection(this.toggleVisibility);
  }

  public render() {
    return this.state.visible ? (
      <Container className='cse-ui-scroller-thumbonly'>
        <Dialog title='Create Blueprint' onClose={() => this.setState({ visible: false })}>
          <Content>
            {this.state.failure ? <Error>({this.state.failure.reason})</Error> : null}
            <TextInput type='text' placeholder='Enter a name' ref={r => this.inputRef = r} />
            <Btn onClick={this.saveBP}>Save</Btn>
          </Content>
        </Dialog>
      </Container>
    ) : null;
  }

  public componentWillUnmount() {
    if (this.createBPHandle) {
      this.createBPHandle.clear();
      this.createBPHandle = null;
    }
  }

  private toggleVisibility = () => {
    this.setState(state => ({ visible: !state.visible }));
  }

  private saveBP = () => {
    game.building.createBlueprintFromSelectionAsync(this.inputRef.value)
    .then((result) => {
      if (result.success) {
        this.toggleVisibility();
        game.trigger('_cse_dev_bp-reload');
        return;
      }
      this.setState({
        failure: result as Failure,
      });
      console.error('Failed to create blueprint: ' + JSON.stringify(result));
      game.trigger('_cse_dev_bp-reload');
    })
    .catch((reason) => {
      console.error(JSON.stringify(reason));
      this.toggleVisibility();
      game.trigger('_cse_dev_bp-reload');
    });
  }
}
