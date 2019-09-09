/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { InfoSection } from './InfoSection';
import { Button } from 'components/fullscreen/Button';
import { PlayerView } from './PlayerView';
import { InputContext, InputContextState } from 'context/InputContext';
import { ReadyButton } from './ReadyButton';

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

export interface Props {
  onReady: () => void;
}

export function Play(props: Props) {
  return (
    <InputContext.Consumer>
      {(inputContext: InputContextState) => {
        return (
          <Container>
            <RightSection>
              <InfoSection />
            </RightSection>
            <BottomRightSection>
              <Button
                styles={SocialButtonStyles}
                type='blue'
                text={<div><ButtonIcon className='icon-people'></ButtonIcon>7</div>}
              />
              <div>
                <PartyText>Party 5 / 8</PartyText>
                {!inputContext.isConsole ?
                  <Button styles={SocialButtonStyles} type='blue' text={'Invite Friend'} /> :
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
              <ReadyButton onReady={props.onReady} />
            </BottomRightSection>
            <PlayerView players={[ { id: 'test1', image: 'test1' } ]} />
          </Container>
        );
      }}
    </InputContext.Consumer>
  );
}
