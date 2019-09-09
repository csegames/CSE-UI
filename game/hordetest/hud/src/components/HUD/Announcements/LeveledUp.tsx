/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const LeveledUpContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;

  &.announcement {
    justify-content: flex-end;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.7));
    padding-top: 5px;
    padding-bottom: 5px;
    padding-right: 20px;
    padding-left: 0;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    height: 1px;
    width: 100%;
    background: linear-gradient(to right, transparent 1%, white, transparent 99%);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 1px;
    width: 100%;
    background: linear-gradient(to right, transparent 1%, white, transparent 99%);
  }
`;

const LeveledUpText = styled.div`
  font-family: RobotoCondensed;
  font-weight: bold;
  color: #ffdf5d;
  text-shadow: 3px 3px 0 #884b02;
  font-size: 25px;
  text-transform: uppercase;
`;

const KeybindBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: RobotoCondensed;
  font-style: italic;
  font-weight: bold;
  font-size: 16px;
  width: 25px;
  height: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  margin-left: 10px;
  color: white;
`;

export interface Props {
  isAnnouncement?: boolean;
}

export function LeveledUp(props: Props) {
  const backgroundClass = props.isAnnouncement ? 'announcement' : '';
  return (
    <LeveledUpContainer className={backgroundClass}>
      <LeveledUpText>Leveled Up!</LeveledUpText>
      <KeybindBox>G</KeybindBox>
    </LeveledUpContainer>
  );
}
