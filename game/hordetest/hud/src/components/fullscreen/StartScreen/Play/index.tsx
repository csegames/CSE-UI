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
import { MatchmakingContext, MatchmakingContextState, PlayerNumberMode } from 'context/MatchmakingContext';
import { callEnterMatchmaking, callCancelMatchmaking } from 'context/actionhandler/MatchmakingActionHandler';
// import { InfoSection } from './InfoSection';
import { Button } from 'components/fullscreen/Button';
import { PlayerView } from './PlayerView';
import { ReadyButton } from './ReadyButton';
import { InviteFriendModal } from './InviteFriendModal';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// const RightSection = styled.div`
//   position: absolute;
//   top: 0;
//   right: 0;
//   height: 100%;
//   width: 300px;
// `;

const BottomRightSection = styled.div`
  display: flex;
  align-items: flex-end;
  position: absolute;
  bottom: 15px;
  right: 15px;
  opacity: 0;
  margin-bottom: -10%;
  animation: slideIn 0.3s forwards;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-bottom: -10%;
    }
    to {
      opacity: 1;
      margin-bottom: 0;
    }
  }
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

export interface Props {
  warbandContext: WarbandContextState;
  inputContext: InputContextState;
  matchmakingContext: MatchmakingContextState;
}

export interface State {
  isModalVisible: boolean;
  isReady: boolean;
}

class PlayWithInjectedContext extends React.Component<Props, State> {
  private evh: EventHandle;
  private enteredMatchmaking: boolean = false;
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalVisible: false,
      isReady: false,
    };
  }

  public render() {
    const { inputContext, warbandContext, matchmakingContext } = this.props;
    const maxPartySize = matchmakingContext.selectedPlayerNumberMode === PlayerNumberMode.SixMan ? 6 : 10;
    return (
      <Container>
        {/* <RightSection>
          <InfoSection />
        </RightSection> */}
        <BottomRightSection>
          {warbandContext.groupID &&
            <Button
              styles={SocialButtonStyles}
              type='blue'
              text='Leave'
              onClick={this.onLeaveClick}
            />
          }
          {/* <Button
            styles={SocialButtonStyles}
            type='blue'
            text={<div><ButtonIcon className='icon-people'></ButtonIcon>7</div>}
          /> */}
          <div>
            <PartyText>
              Party {warbandContext.groupID ? Object.keys(warbandContext.groupMembers).length : 1} / {maxPartySize}
            </PartyText>
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
          <ReadyButton
            onReady={this.onReady}
            onUnready={this.onUnready}
            enterMatchmaking={this.enterMatchmaking}
            cancelMatchmaking={this.cancelMatchmaking}
          />
        </BottomRightSection>
        <PlayerView isReady={this.state.isReady} />
        <InviteFriendModal isVisible={this.state.isModalVisible} onClickOverlay={this.onClickOverlay} />
      </Container>
    );
  }

  public componentDidMount() {
    this.evh = onActiveGroupUpdate(this.handleActiveGroupUpdate);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private enterMatchmaking = async (gameMode: string) => {
    console.log("Calling enter matchmaking");
    var res = await callEnterMatchmaking(gameMode);
    if (res.ok)
    {
      this.enteredMatchmaking = true;
    }
    else
    {
      this.enteredMatchmaking = false;
    }
    return res;
  }

  private cancelMatchmaking = async () => {
    var res = await callCancelMatchmaking();
    if (res.ok)
    {
      this.enteredMatchmaking = false;
    }
    return res;
  }

  private handleActiveGroupUpdate = () => {
    const { warbandContext, matchmakingContext } = this.props;
    const notReadyMembers = Object.values(warbandContext.groupMembers).filter(m => !m.isReady);

    const myMemberState = warbandContext.groupMembers[game.characterID];

    if (!myMemberState) {
      return;
    }

    if (notReadyMembers.length === 0 && myMemberState.isLeader && !this.enteredMatchmaking) {
      callEnterMatchmaking(matchmakingContext.selectedGameMode.mode);
    }
  }

  private handleInviteFriend = () => {
    console.log('clicked invite friend');
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP);
    this.setState({ isModalVisible: true });
  }

  private onClickOverlay = () => {
    this.setState({ isModalVisible: false });
  }

  private onLeaveClick = async () => {
    const { groupID } = this.props.warbandContext;
    // if (this.isLeader() && Object.keys(groupMembers).length == 1) {
    //   webAPI.GroupsAPI.DisbandV1(webAPI.defaultConfig, groupID);
    // } else {
    const res = await webAPI.GroupsAPI.QuitV1(webAPI.defaultConfig, groupID);
    if (res.ok) {
      this.props.warbandContext.reset();
    }
    // }
  }

  // private isLeader = () => {
  //   return this.props.warbandContext.groupMembers[game.characterID].isLeader;
  // }

  private onReady = () => {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
    this.setState({ isReady: true });
  }

  private onUnready = () => {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
    this.setState({ isReady: false });
  }
}

export function Play() {
  const warbandContext = useContext(WarbandContext);
  const inputContext = useContext(InputContext);
  const matchmakingContext = useContext(MatchmakingContext);
  return (
    <PlayWithInjectedContext
      warbandContext={warbandContext}
      inputContext={inputContext}
      matchmakingContext={matchmakingContext}
    />
  );
}
