/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { mocks } from '@csegames/library/lib/hordetest/game/mock';

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  max-height: 400px;
  overflow: auto;
  padding: 5px;
  z-index: 99;
`;

const MockSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const Label = styled.div`
  font-family: Colus;
  font-size: 26px;
  color: white;
  text-align: center;
`;

const MockItem = styled.div`
  display: flex;
  flex-shrink: 0;
  &:hover {
    background-color: rgba(255, 217, 0, 0.4);
  }

  &:active {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
  }

  &.selected {
    background-color: rgba(255, 217, 0, 0.4);
  }
`;

const Name = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  color: orange;
`;

const Description = styled.div`
  color: white;
  border-bottom: 1px solid #ccc;
`;

const Button = styled.button`
  cursor: pointer;
`;

export interface State {
  isVisible: boolean;
  selectedMockId: string;
}

export class Mocks extends React.Component<{}, State> {
  constructor(props: {}) {
    super (props);
    this.state = {
      isVisible: false,
      selectedMockId: '',
    };
  }

  public render() {
    return this.state.isVisible ? (
      <Container>
        {Object.keys(mocks).map((sectionKey) => {
          return (
            <MockSection>
              <Label>{sectionKey.toTitleCase()}</Label>
              {mocks[sectionKey].map((mock) => {
                const mockId = `${sectionKey}-${mock.name}`;
                const isSelected = mockId === this.state.selectedMockId;
                return (
                  <MockItem className={isSelected ? 'selected' : ''} onClick={() => this.onMockSelect(mockId)}>
                    <Name>
                      {mock.name} -
                      <Button onClick={mock.function}>Run</Button>
                    </Name>
                    <Description>{mock.expectedOutcomeDescription}</Description>
                  </MockItem>
                );
              })}
            </MockSection>
          );
        })}
      </Container>
    ) : null;
  }

  public componentDidMount() {
    game.on('navigate', this.handleNavigate);
  }

  private handleNavigate = (name: string) => {
    if (name === 'mocks') {
      this.setState({ isVisible: !this.state.isVisible });
    }
  }

  private onMockSelect = (mockId: string) => {
    this.setState({ selectedMockId: mockId });
  }
}
