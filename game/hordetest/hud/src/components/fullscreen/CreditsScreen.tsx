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
  background: black;
`;

const ContainerBg = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  &:before{
    content: '';
    position: absolute;
    height: 100vh;
    width: 100vw;
    background: url(../images/fullscreen/fullscreen-credits-bg.jpg);
    background-size: cover;
    animation-fill-mode: forwards;
    animation-name: background-zoom-in ;
    animation-duration: 200s;
  }

  @keyframes background-zoom-in {
    from {
      opacity: 0.4;
      transform: scale(1) translate(0%, 0%) ;
    }
    to {
      opacity: 1;
      transform: scale(1.5) translate(3%, 2%);
    }
  }
`;


const Ray = styled.div`
  position: absolute;
  animation-name: ray-fading;
  animation-iteration-count: infinite;

  &.ray1 {
    width:50%;
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
    transform:  translate(0%, -30%);
    filter: hue-rotate(-30deg);
    background:radial-gradient(rgba(84, 139, 255, 0.53) 0%, transparent 70%);
    animation-duration: 6s;
  }

  &.ray4 {
    width:100%;
    height:100%;
    transform:  translate(45%, -20%);
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
  transform: translate(20%, -103%);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-name: scroll-text;
  animation-duration: 350s;

  @keyframes scroll-text {
    0% {transform: translate(20%, -103%)}
    100% {transform: translate(20%, 300%)}
  }
`;

const SubText = styled.div`
  font-family: Colus;
  color: white;
  font-size: 0.8em;
  margin-top: 100px;
  opacity: 0.8;
`;

const SubTitle = styled.div`
  font-family: Colus;
  color: white;
  margin-bottom: 100px;
  opacity: 0.9;
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
  z-index: 1;
  bottom: 20px;
  right: 20px;
`;

const Rune = styled.div`
  font-family: fs-icons;
  position: fixed;
  animation: rune-rising 5s infinite;
  opacity: 0;
  transform: translate(0%, 0%);
  font-size: 40px;
  color: white;
  text-shadow: 0px 0px 15px rgb(94, 78, 226);

  &.rune1 {
    top: 20%;
    left: 10%;
    animation-delay: 5s;
    animation-duration: 15s;
    font-size: 4em;
  }

  &.rune2 {
    top: 100%;
    left: 40%;
    animation-delay: 5s;
    animation-duration: 5s;
    font-size: 2em;
  }

  &.rune3 {
    top: 60%;
    left: 60%;
    animation-delay: 9s;
    animation-duration: 7s;
    font-size: 3em;
  }

  &.rune4 {
    top: 20%;
    left: 80%;
    animation-delay: 13s;
    animation-duration: 9s;
    font-size: 4em;
  }

  &.rune5 {
    top: 90%;
    left: 90%;
    animation-delay: 18s;
    animation-duration: 8s;
    font-size: 5em;
  }

  &.rune6 {
    top: 100%;
    left: 10%;
    animation-delay: 6s;
    animation-duration: 10s;
    font-size: 6em;
  }

  &.rune7 {
    top: 95%;
    left: 50%;
    animation-delay: 5s;
    animation-duration: 13s;
    font-size: 7em;
  }

  &.rune8 {
    top: 100%;
    left: 70%;
    animation-delay: 9s;
    animation-duration: 18s;
    font-size: 8em;
  }

  &.rune9 {
    top: 90%;
    left: 80%;
    animation-delay: 13s;
    animation-duration: 16s;
    font-size: 9em;
  }

  @keyframes rune-rising {
    0% {
      opacity: 0;
      transform: translate(0%, 0%);
    }
    30% {
      opacity: 0.8;
    }
    80%{
      opacity: 0;
    }
    100% {
      transform: translate(0%, -400%);
    }
  }
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
    role: 'Frontend UI Engineer',
  },
  {
    name: 'Andrew Meggs',
    role: 'CTO/Lead Software Architect',
  },
  {
    name: 'Anna Luu',
    role: 'Director of HR',
  },
  {
    name: 'Anthony Sermania',
    role: 'Engineer',
  },
  {
    name: 'Ben Pielstick',
    role: 'Co-Lead Designer',
  },
  {
    name: 'Brian Ward',
    role: 'Senior OPS/QA/CM',
  },
  {
    name: 'Bull Durham',
    role: 'Senior Tools Engineer',
  },
  {
    name: 'Brys Sepulveda',
    role: 'Senior Server Engineer',
  },
  {
    name: 'Charles Ribemont',
    role: 'Senior Web Admin',
  },
  {
    name: 'Cheyne Anderson',
    role: 'Client and Pipeline Engineer',
  },
  {
    name: 'Christina Carr',
    role: 'Lead Gameplay Engineer',
  },
  {
    name: 'Colin Sipherd',
    role: 'Senior Networking Engineer',
  },
  {
    name: 'Daniel Beck ',
    role: 'Lead Audio Designer/Producer',
  },
  {
    name: 'Elvin Hernandez',
    role: 'Illustrator',
  },
  {
    name: 'George Davison',
    role: 'Seattle Studio Director/Engineering Director ',
  },
  {
    name: 'Harrison Rea',
    role: 'Client Engineer',
  },
  {
    name: 'James Brown',
    role: 'Senior UI/Web Engineer',
  },
  {
    name: 'James Koo',
    role: 'Lead UI Artist',
  },
  {
    name: 'Joe Janca',
    role: 'Lead Animator',
  },
  {
    name: 'Jon Young',
    role: 'Lead Modeler',
  },
  {
    name: 'Joseph Burrage',
    role: 'Modeler/Material Artist',
  },
  {
    name: 'Judd Cohen',
    role: 'Gameplay Engineer',
  },
  {
    name: 'Kara Stover',
    role: 'Concept Artist',
  },
  {
    name: 'Lee Wilson',
    role: 'Senior Engineer',
  },
  {
    name: 'Mark Chae',
    role: 'Server Ops Engineer',
  },
  {
    name: 'Mark Jacobs',
    role: 'CEO/Creative Director',
  },
  {
    name: 'Matt Meehan',
    role: 'Senior Engineer',
  },
  {
    name: 'Matthew Lauritzen',
    role: 'Senior Gameplay Engineer',
  },
  {
    name: 'Max Porter',
    role: 'Co-writer/Editor',
  },
  {
    name: 'Michael Jacobs',
    role: 'Lead QA Tester',
  },
  {
    name: 'Michelle Davies',
    role: 'Art Director/Lead Concept Artist',
  },
  {
    name: 'Mike Crossmire',
    role: 'Senior VFX Artist',
  },
  {
    name: 'Mike Dickheiser',
    role: 'Senior Engineer',
  },
  {
    name: 'Mike Waver',
    role: 'Modeler',
  },
  {
    name: 'Rob Argue',
    role: 'Senior Server Engineer',
  },
  {
    name: 'Samantha Ng',
    role: 'Producer',
  },
  {
    name: 'Sandra Pavulaan',
    role: 'Animator',
  },
  {
    name: 'Scott Trolan',
    role: 'Animator',
  },
  {
    name: 'Sierra Boyette',
    role: 'Modeler',
  },
  {
    name: 'Tim Mills',
    role: 'Lead DevOps/Senior Engineer',
  },
  {
    name: 'Tina Fulton',
    role: 'Concept Artist',
  },
  {
    name: 'Tyler Rockwell',
    role: 'Environmental artist/Content Manager',
  },

]

interface CreditSubPerson {
  name: string;
  role: string;
}
const peopleLeft: CreditSubPerson[] = [
  {
    name: 'Andrew Phelan',
    role: 'Modeler',
  },
   {
    name: 'Ash Kain',
    role: 'Producer',
  },
   {
    name: 'Caleb Fisher',
    role: 'Gameplay Engineer',
  },
   {
    name: 'Jon Farinelli',
    role: 'Producer',
  },
   {
    name: 'Marc Hernandez',
    role: 'Senior Server Engineer',
  },
]

export class CreditsScreen extends React.Component<Props> {
  public render() {
    return (
      <Container>
        <HideButtonPosition>
          <ActionButton onClick={this.hideCreditsScreen}>Hide</ActionButton>
        </HideButtonPosition>
        <ContainerBg>
          <Ray className="ray1"></Ray>
          <Ray className="ray2"></Ray>
          <Ray className="ray3"></Ray>
          <Ray className="ray4"></Ray>

          <CreditsText>
            <SubText>
              {peopleLeft.sort((a, b) => b.name.localeCompare(a.name)).map((peopleLeft) => {
                return (
                  <Item>
                    {peopleLeft.name}
                    <Role>{peopleLeft.role}</Role>
                  </Item>
                );
              })}
              <SubTitle>Those who started, but didn't complete the journey</SubTitle>
            </SubText>
            {people.sort((a, b) => b.name.localeCompare(a.name)).map((person) => {
              return (
                <Item>
                  {person.name}
                  <Role>{person.role}</Role>
                </Item>
              );
            })}
          </CreditsText>

          <Rune className='rune1'>1</Rune>
          <Rune className='rune2'>2</Rune>
          <Rune className='rune3'>3</Rune>
          <Rune className='rune4'>4</Rune>
          <Rune className='rune5'>5</Rune>
          <Rune className='rune6'>6</Rune>
          <Rune className='rune7'>7</Rune>
          <Rune className='rune8'>8</Rune>
          <Rune className='rune9'>9</Rune>
        </ContainerBg>

      </Container>
    );
  }

  private hideCreditsScreen = () => {
    game.trigger('hide-credits-screen');
  }
}
