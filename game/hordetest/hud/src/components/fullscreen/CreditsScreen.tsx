/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ActionButton } from './ActionButton';

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  background: url(../images/fullscreen/fullscreen-credits-bg.jpg);
  background-size: cover;
  animation-fill-mode: forwards;
  animation-name: background-fading-in ;
  animation-duration: 50s;
  overflow: hidden;
`;

const Ray = styled.div`
  position: absolute;
  animation-name: ray-fading;
  animation-iteration-count: infinite;

  &.ray1 {
    width:15%;
    height:100%;
    transform:  translate(350%, -50%) rotate(35deg);
    background:radial-gradient(rgba(84, 250, 255, 0.53) 0%, transparent 70%);
    animation-duration: 8s;
  }

  &.ray2 {
    width:100%;
    height:100%;
    transform:  translate(10%, -40%);
    filter:hue-rotate(25deg);
    background:radial-gradient(rgba(186, 84, 255, 0.53) 0%, transparent 70%);
    animation-duration: 5s;
  }

  &.ray3 {
    width:100%;
    height:100%;
    transform:  translate(0%, -50%);
    filter: hue-rotate(-30deg);
    background:radial-gradient(rgba(84, 139, 255, 0.53) 0%, transparent 70%);
    animation-duration: 6s;
  }

  &.ray4 {
    width:100%;
    height:100%;
    transform:  translate(45%, -50%);
    filter: hue-rotate(-35deg);
    background:radial-gradient(rgba(84, 255, 205, 0.53) 0%, transparent 70%);
    animation-duration: 7s;
  }

  @keyframes ray-fading {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      opacity: 0;
    }
  }
`;

const CreditsText = styled.div`
  font-family: Colus;
  color: white;
  font-size: 24px;
  transform: translate(20%, -90%);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-name: scroll-text;
  animation-duration: 30s;

  @keyframes scroll-text {
    0% {transform: translate(20%, -100%)}
    100% {transform: translate(20%, 300%)}
  }
`;

const Item = styled.div`
  margin-bottom: 40px;
`;

const Role = styled.div`
  font-size: 16px;
  color: #00d3c2;
`;

const HideButtonPosition = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
`;

export interface Props {
}

interface CreditPerson {
  name: string;
  role: string;
}

const people: CreditPerson[] = [
  {
    name: 'Andrew Jackson',
    role: 'UI Engineer',
  },
  {
    name: 'SAndrew Jackson',
    role: 'UI Engineer',
  },
  {
    name: 'TAndrew Jackson',
    role: 'UI Engineer',
  },
  {
    name: 'BAndrew Jackson',
    role: 'UI Engineer',
  },
  {
    name: 'QAndrew Jackson',
    role: 'UI Engineer',
  },
  {
    name: 'OAndrew Jackson',
    role: 'UI Engineer',
  },
  {
    name: 'LAndrew Jackson',
    role: 'UI Engineer',
  },
  {
    name: 'MAndrew Jackson',
    role: 'UI Engineer',
  },
]

export function CreditsScreen(props: Props) {
  function hideCreditsScreen() {
    game.trigger('hide-credits-screen');
  }

  return (
    <Container>
      <Ray className="ray1"></Ray>
      <Ray className="ray2"></Ray>
      <Ray className="ray3"></Ray>
      <Ray className="ray4"></Ray>

      <CreditsText>
        {people.sort((a, b) => b.name.localeCompare(a.name)).map((person) => {
          return (
            <Item>
              {person.name}
              <Role>{person.role}</Role>
            </Item>
          );
        })}
      </CreditsText>

      <HideButtonPosition>
        <ActionButton onClick={hideCreditsScreen}>Hide</ActionButton>
      </HideButtonPosition>
    </Container>
  );
}
