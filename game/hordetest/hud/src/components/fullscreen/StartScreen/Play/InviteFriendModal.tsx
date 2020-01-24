/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useContext } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/library/lib/hordetest';

import { WarbandContext } from 'context/WarbandContext';
import { MiddleModalComponent } from '../../MiddleModal';
import { Input } from '../../Input';
import { Button } from '../../Button';

const INVALID_ID = '0000000000000000000000';

const EnterNameText = styled.div`
  font-size: 38px;
  font-family: Colus;
  color: white;
  margin-bottom: 10px;
`;

const InputStyles = css`
  width: 300px;
  margin: 0;
  padding: 20px;
  font-size: 24px;
  font-family: Lato;

  &.error {
    border-color: #9B0700;
  }
`;

const ErrorMessage = styled.div`
  font-size: 26px;
  font-family: Lato;
  color: #9B0700;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ModalButtonStyles = css`
  padding: 15px 30px;
  font-size: 22px;
`;

export interface Props {
  isVisible: boolean;
  onClickOverlay: () => void;
}

export function InviteFriendModal(props: Props) {
  const [inviteName, setInviteName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const warbandContext = useContext(WarbandContext);

  async function onSendInviteClick() {
    const res = await webAPI.GroupsAPI.InviteV1(
      webAPI.defaultConfig,
      warbandContext.groupID,
      INVALID_ID,
      inviteName,
      GroupTypes.Warband as any,
    );

    if (res.ok) {
      game.trigger('hide-middle-modal');
    } else {
      // failed
      try {
        const reason = JSON.parse(res.data);
        setErrorMessage(`Error: ${typeof reason === 'string' ?
          reason : reason.FieldCodes[0] ?
          reason.FieldCodes[0].Actions[0].Message : 'Unknown reason.'}`);
      } catch (e) {
        setErrorMessage('An Unknown error occured.')
      }
    }
  }

  function onInviteNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInviteName(e.target.value);
  }

  return (
    <MiddleModalComponent isVisible={props.isVisible} onClickOverlay={props.onClickOverlay}>
      <EnterNameText>Enter a username</EnterNameText>
      <Input
        className={`${InputStyles} ${errorMessage ? 'error' : ''}`}
        placeholder='Username'
        value={inviteName}
        onChange={onInviteNameChange}
      />
      <ErrorMessage>{errorMessage}</ErrorMessage>
      <Button type='blue' text='Send Invite' styles={ModalButtonStyles} onClick={onSendInviteClick} />
    </MiddleModalComponent>
  );
}
