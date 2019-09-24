/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Button } from '../Button';

import { friends, PlayerStatus } from './testData';

const Container = styled.div`
  padding: 22px 0px;
  height: calc(100% - 22px);
`;

const TopSection = styled.div`
  height: 100px;
`;

const MenuTitle = styled.div`
  font-family: Colus;
  font-size: 24px;
  color: #3d3d3d;
  margin-right: 30px;
  margin-left: 60px;
  margin-bottom: 10px;
`;

const AddButtonStyles = css`
  font-size: 20px;
  margin-left: 60px;
  margin-right: 30px;
  margin-bottom: 10px;
`;

const List = styled.div`
  overflow: auto;
  flex: 1;
  height: calc(100% - 100px);

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: 5px;
    background-color: #111;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 5px;
  }
`;

const SectionTitle = styled.div`
  font-family: Colus;
  font-size: 18px;
  color: #8a8a8a;
  margin-left: 60px;
`;

const FriendItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Lato;
  font-size: 16px;
  padding-left: 60px;
  transition: padding-left 0.2s;
  cursor: pointer;
  height: 60px;

  div {
    cursor: pointer;
  }

  &:before {
    position: absolute;
    content: '';
    left: 0;
    right: 0;
    z-index: -1;
    background: transparent;
    transition: background 0.2s;
    height: 60px;
  }

  &:hover {
    padding-left: 90px;
  }

  &:hover:before {
    background: linear-gradient(to left, #273a64, transparent);
  }

  &:hover .plus {
    visibility: visible;
    opacity: 1;
  }
`;

const FriendName = styled.div`
  color: white;

  &.Offline {
    color: #545454;
  }
`;

const FriendStatus = styled.div`
  color: #545454;

  &.Online {
    color: #79f1ff;
  }
`;

const Plus = styled.div`
  font-family: Colus;
  font-size: 37px;
  color: white;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s;
  margin-right: 30px;

  &:hover {
    filter: brightness(150%);
  }
`;

export interface Props {
}

export function Social(props: Props) {
  function getOnlineFriends() {
    const onlineFriends = friends.filter(f => f.status === PlayerStatus.Online || f.status === PlayerStatus.Away);
    return onlineFriends;
  }

  function getOfflineFriends() {
    const offlineFriends = friends.filter(f => f.status === PlayerStatus.Offline);
    return offlineFriends;
  }

  const onlineFriends = getOnlineFriends();
  const offlineFriends = getOfflineFriends();
  return (
    <Container>
      <TopSection>
        <MenuTitle>Social</MenuTitle>
        <Button type='blue' text='+ Add Friend' styles={AddButtonStyles} />
      </TopSection>
      <List>
        <SectionTitle>Friends ({onlineFriends.length})</SectionTitle>
        {onlineFriends.map((friend) => {
          const playerStatus = PlayerStatus[friend.status];
          return (
            <FriendItem>
              <div>
                <FriendName className={playerStatus}>{friend.name}</FriendName>
                <FriendStatus className={playerStatus}>{playerStatus}</FriendStatus>
              </div>
              <Plus className='plus'>+</Plus>
            </FriendItem>
          );
        })}
        <SectionTitle>Offline ({offlineFriends.length})</SectionTitle>
        {offlineFriends.map((friend) => {
          const playerStatus = PlayerStatus[friend.status];
          return (
            <FriendItem>
              <div>
                <FriendName className={playerStatus}>{friend.name}</FriendName>
                <FriendStatus className={playerStatus}>{playerStatus}</FriendStatus>
              </div>
            </FriendItem>
          );
        })}
      </List>
    </Container>
  );
}
