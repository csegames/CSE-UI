/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/library/lib/hordetest';

import { WarbandContext, onActiveGroupUpdate, WarbandContextState } from 'context/WarbandContext';
import { InputContext, InputContextState } from 'context/InputContext';
import { InfoSection } from './InfoSection';
import { Button } from 'components/fullscreen/Button';
import { PlayerView } from './PlayerView';
import { ReadyButton } from './ReadyButton';
import { Input } from '../../Input';
import { showActionAlert } from 'components/shared/ActionAlert';
import { InviteAlerts } from 'components/fullscreen/InviteAlerts';

const INVALID_ID = '0000000000000000000000';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const RightSection = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 300px;
`;

const BottomRightSection = styled.div`
  display: flex;
  align-items: flex-end;
  position: absolute;
  bottom: 15px;
  right: 15px;
`;

const PartyText = styled.div`
  font-size: 24px;
  font-family: Lato;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 12px;
  margin-right: 14px;
  text-align: right;
`;

const SocialButtonStyles = css`
  font-size: 20px;
  color: white;
  height: fit-content;
  margin-right: 14px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

const ConsoleButton = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonIcon = styled.span`
  margin-right: 5px;
`;

const EnterNameText = styled.div`
  font-size: 24px;
  font-family: Lato;
  color: white;
`;

const InputStyles = css`
  width: 300px;
  margin: 10px 0;
  padding: 5px;
`;

const ModalContainer = styled.div`
  position: fixed;
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
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

export interface Props {
  warbandContext: WarbandContextState;
  inputContext: InputContextState;
}

export interface State {
  inviteName: string;
  isVisible: boolean;
  isReady: boolean;
}

class PlayWithInjectedContext extends React.Component<Props, State> {
  private evh: EventHandle;
  private enteredMatchmaking: boolean = false;
  constructor(props: Props) {
    super(props);
    this.state = {
      inviteName: '',
      isVisible: false,
      isReady: false,
    };
  }

  public render() {
    const { inputContext, warbandContext } = this.props;
    return (
      <Container>
        <InviteAlerts />
        <RightSection>
          <InfoSection />
        </RightSection>
        <BottomRightSection>
          {warbandContext.groupID &&
            <Button
              styles={SocialButtonStyles}
              type='blue'
              text='Leave'
              onClick={this.onLeaveClick}
            />
          }
          <Button
            styles={SocialButtonStyles}
            type='blue'
            text={<div><ButtonIcon className='icon-people'></ButtonIcon>7</div>}
          />
          <div>
            <PartyText>Party 5 / 8</PartyText>
            {!inputContext.isConsole ?
              <Button styles={SocialButtonStyles} type='blue' text={'Invite Friend'} onClick={this.handleInviteFriend} /> :
              <Button
                styles={SocialButtonStyles}
                type='blue'
                text={
                  <ConsoleButton>
                    <ButtonIcon className='icon-xb-r-down'></ButtonIcon> Invite Friend
                  </ConsoleButton>
                }
              />
            }
          </div>
          <ReadyButton onReady={this.onReady} onUnready={this.onUnready} />
        </BottomRightSection>
        <PlayerView isReady={this.state.isReady} />
        <>
          <Overlay className={this.state.isVisible ? 'visible' : ''} onClick={this.onClickOverlay} />
          <ModalContainer className={this.state.isVisible ? 'visible' : ''}>
            <EnterNameText>Enter a username</EnterNameText>
            <Input
              className={InputStyles}
              placeholder='Username'
              value={this.state.inviteName}
              onChange={this.onInviteNameChange}
            />
            <Button type='blue' text='Send Invite' onClick={this.onSendInviteClick} />
          </ModalContainer>
        </>
      </Container>
    );
  }

  public componentDidMount() {
    this.evh = onActiveGroupUpdate(this.handleActiveGroupUpdate);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private enterMatchmaking = async () => {
    this.enteredMatchmaking = true;
    const request = {
      mode: 'inttest',
    };
    const res = await webAPI.MatchmakingAPI.EnterMatchmaking(webAPI.defaultConfig, request as any);

    if (!res.ok) {
      this.enteredMatchmaking = false;
    }
  }

  private onSendInviteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const res = await webAPI.GroupsAPI.InviteV1(
      webAPI.defaultConfig,
      game.shardID,
      hordetest.game.selfPlayerState.characterID,
      this.props.warbandContext.groupID,
      INVALID_ID,
      this.state.inviteName,
      GroupTypes.Warband as any,
    );

    if (res.ok) {
      showActionAlert('Invite Sent Successfully', { clientX: e.clientX, clientY: e.clientY });
      game.trigger('hide-middle-modal');
    } else {
      showActionAlert('Failed To Send Invite', { clientX: e.clientX, clientY: e.clientY });
    }
  }

  private handleActiveGroupUpdate = () => {
    const { warbandContext } = this.props;
    const notReadyMembers = Object.values(warbandContext.groupMembers).filter(m => !m.isReady);

    const myMemberState = warbandContext.groupMembers[hordetest.game.selfPlayerState.characterID];
    if (notReadyMembers.length === 0 && myMemberState.isLeader && !this.enteredMatchmaking) {
      this.enterMatchmaking();
    }
  }

  private handleInviteFriend = () => {
    this.setState({ isVisible: true });
  }

  private onInviteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inviteName: e.target.value });
  }

  private onClickOverlay = () => {
    this.setState({ isVisible: false });
  }

  private onLeaveClick = () => {
    const { groupID } = this.props.warbandContext;
    if (this.isLeader()) {
      webAPI.GroupsAPI.DisbandV1(webAPI.defaultConfig, game.shardID, hordetest.game.selfPlayerState.characterID, groupID);
    } else {
      webAPI.GroupsAPI.QuitV1(webAPI.defaultConfig, game.shardID, hordetest.game.selfPlayerState.characterID, groupID);
    }
  }

  private isLeader = () => {
    return this.props.warbandContext.groupMembers[hordetest.game.selfPlayerState.characterID].isLeader;
  }

  private onReady = () => {
    this.setState({ isReady: true });
  }

  private onUnready = () => {
    this.setState({ isReady: false });
  }
}

export function Play() {
  const warbandContext = useContext(WarbandContext);
  const inputContext = useContext(InputContext);
  return (
    <PlayWithInjectedContext warbandContext={warbandContext} inputContext={inputContext} />
  );
}
