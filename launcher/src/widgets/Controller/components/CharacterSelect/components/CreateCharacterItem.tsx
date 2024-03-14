/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { patcher } from '../../../../../services/patcher';
import { view } from '../../../../../components/OverlayView';
import { ControllerContext, PatcherServer, ServerType } from '../../../ControllerContext';
import { globalEvents } from '../../../../../lib/EventEmitter';
import { Sound, playSound } from '../../../../../lib/Sound';

declare var toastr: any;

const goldenColor = 'rgba(192, 173, 124, 0.4)';

const activeItem = `
  filter: brightness(180%);

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
    -webkit-animation: activeShine 2s ease forwards;
    animation: activeShine 2s ease forwards;
    -webkit-clip-path: polygon(5% 0%, 100% 0%, 90% 100%, 0% 100%);
    clip-path: polygon(5% 0%, 100% 0%, 90% 100%, 0% 100%);
  }

  @keyframes activeShine {
    from {
      opacity: 1;
      left: 30px;
    }
    to {
      opacity: 0;
      left: 30%;
    }
  }
`;

const Container = styled.div`
  position: relative;
  display: block;
  text-align: center;
  margin-left: -5px;
`;

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  text-align: center;
  pointer-events: all;
  color: white;
  font-family: 'Caudex';
  font-size: 13px;
  height: 50px;
  width: 345px;
  margin: 15px 15px 25px 15px;
  padding-bottom: 5px;
  background-size: contain;
  transition: all ease 0.1s;
  &:hover {
    ${activeItem};
  }
`;

const Plus = styled.span`
  font-size: 24px;
  margin-right: 5px;
`;

const Text = styled.div`
  position: absolute;
  top: 5px;
  right: 0;
  left: 0;
  bottom: 22px;
  font-size: 16px;
`;

const SubText = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  left: 0;
  bottom: 13px;
  text-align: center;
  color: #ff6a6a;
  font-size: 10px;
  text-transform: uppercase;
`;

export interface ComponentProps {
  server: PatcherServer;
  apiServerOnline: 'Online' | 'Offline' | undefined;
}

export interface InjectedProps {
  refetchCharacters: () => void;
}

export type Props = ComponentProps & InjectedProps;

class CreateCharacterItem extends React.Component<Props> {
  public render() {
    const { apiServerOnline } = this.props;
    const backgroundImg =
      apiServerOnline === 'Online'
        ? 'images/controller/create-new-button.png'
        : 'images/controller/create-new-button_offline.png';
    const isOnline = apiServerOnline === 'Online';
    const isOffline = apiServerOnline === 'Offline';
    const isChecking = typeof apiServerOnline === 'undefined';
    return (
      <Container>
        <ButtonContainer
          onMouseEnter={this.onMouseEnter}
          onClick={isOnline ? () => this.onClick() : this.onClickOffline}
          style={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundRepeat: 'no-repeat',
            cursor: isOnline ? 'pointer' : 'not-allowed'
          }}
        >
          <Text style={{ color: isOnline ? 'white' : '#FF6A6A' }}>
            <Plus>+</Plus>
            Create New Character
          </Text>
          {isOffline && <SubText>Unavailable</SubText>}
          {isChecking && <SubText>Checking if server is online</SubText>}
        </ButtonContainer>
      </Container>
    );
  }

  private onClick = (isOnline?: boolean) => {
    let creationView = this.props.server.type === ServerType.COLOSSUS ? view.COLOSSUSCREATION : view.CHARACTERCREATION;
    globalEvents.trigger('view-content', creationView, {
      selectedServer: this.props.server.name,
      apiHost: this.props.server.apiHost + '/',
      apiVersion: 1,
      shard: this.props.server.shardID,
      apiKey: patcher.getAccessToken(),
      created: (c: any) => {
        globalEvents.trigger('character-created', c.name);
        globalEvents.trigger('view-content', view.NONE);
        this.props.refetchCharacters();
      }
    });
    playSound(Sound.LaunchGame);
  };

  private onClickOffline = () => {
    if (this.props.apiServerOnline === 'Offline') {
      toastr.error(
        'You will not be able to create a character while the API server is offline',
        'API Server is offline',
        { timeOut: 3000 }
      );
    }

    if (typeof this.props.apiServerOnline === 'undefined') {
      toastr.error('Checking if API server is online', 'Checking', { timeOut: 3000 });
    }
  };

  private onMouseEnter = () => {
    playSound(Sound.SelectChange);
  };
}

class CreateCharacterItemWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <ControllerContext.Consumer>
        {({ refetch }) => <CreateCharacterItem {...this.props} refetchCharacters={refetch} />}
      </ControllerContext.Consumer>
    );
  }
}

export default CreateCharacterItemWithInjectedContext;
