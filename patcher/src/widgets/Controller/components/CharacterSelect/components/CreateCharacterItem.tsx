/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { keyframes, css } from 'react-emotion';
import { events, signalr } from 'camelot-unchained';

import { patcher } from '../../../../../services/patcher';
import { PatcherServer } from '../../../services/session/controller';
import { view } from '../../../../../components/OverlayView';

declare var toastr: any;

const goldenColor = 'rgba(192, 173, 124, 0.4)';

const activeShine = keyframes`
  from {
    opacity: 1;
    left: 30px;
  }

  to {
    opacity: 0;
    left: 30%;
  }
`;

const activeItem = css`
  filter: brightness(180%);
  left: -2px;
  top: -2px;

  &:before {
    content: "";
    position: absolute;
    height: 100%;
    width: 70%;
    border-left-radius: 50%;
    background: linear-gradient(to right, transparent, ${goldenColor}, transparent);
    bottom: 0px;
    left: 20px;
    opacity: 0;
    -webkit-animation: ${activeShine} 2s ease forwards;
    animation: ${activeShine} 2s ease forwards;
    -webkit-clip-path: polygon(5% 0%, 100% 0%, 90% 100%, 0% 100%);
    clip-path: polygon(5% 0%, 100% 0%, 90% 100%, 0% 100%);
  }
`;

const Container = styled('div')`
  display: flex;
  justify-content: flex-end;
`;

const ButtonContainer = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  cursor: ${props => props.cursor};
  color: white;
  font-family: "Caudex";
  font-size: 13px;
  height: 51px;
  width: 85%;
  margin: 15px 15px 25px 15px;
  background: url(images/controller/create-new-button.png) no-repeat;
  background-size: cover;
  transition: all ease .1s;
  &:hover {
    ${activeItem};
  }
`;

const Plus = styled('span')`
  font-size: 24px;
  margin-right: 10px;
`;

const Text = styled('div')`
  display: flex;
  align-items: center;
  color: white;
  font-size: 16px;
`;

export interface CreateCharacterItemProps {
  server: PatcherServer;
}

class CreateCharacterItem extends React.Component<CreateCharacterItemProps> {
  public render() {
    return (
      <Container>
        <ButtonContainer
          onClick={this.onClick}
          onMouseEnter={this.onMouseEnter}
          cursor={this.props.server.available ? 'pointer' : 'not-allowed'}>
          <Text>
            <Plus>+</Plus>
            Create New Character
          </Text>
        </ButtonContainer>
      </Container>
    );
  }

  private onClick = () => {
    if (signalr.patcherHub.connectionState === signalr.ConnectionState.Connected &&
        (!this.props.server.shardID || this.props.server.available)) {
      events.fire('view-content', view.CHARACTERCREATION, {
        selectedServer: this.props.server.name,
        apiHost: this.props.server.apiHost,
        apiVersion: 1,
        shard: this.props.server.shardID,
        apiKey: patcher.getLoginToken(),
        created: (c) => {
          events.fire('character-created', c.name);
          events.fire('view-content', view.NONE);
        },
      });
    } else {
      toastr.error(
        'You will not be able to create a character while the server is offline',
        'Server is offline',
        {timeOut: 5000},
      );
    }
  }

  private onMouseEnter = () => {

  }
}

export default CreateCharacterItem;
