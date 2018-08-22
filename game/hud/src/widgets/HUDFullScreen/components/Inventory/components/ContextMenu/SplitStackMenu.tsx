/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import * as React from 'react';
import styled, { keyframes } from 'react-emotion';
import { hideContextMenu } from 'actions/contextMenu';

const buttonGlow = keyframes`
  from {
    box-shadow: 0 0 4px rgba(255, 230, 186, 0.1);
  }
  to {
    box-shadow: 0 0 4px rgba(255, 230, 186, 1);
  }
`;

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  background-color: background-color: rgba(0, 0, 0, 0.3);
  padding: 5px;
`;

const InfoContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
`;

const Button = styled('div')`
  width: 50px;
  text-align: center;
  color: rgba(255, 230, 186, 1);
  background-color: rgba(0, 0, 0, 0.7);
  -webkit-animation: ${buttonGlow} 1s infinite alternate;
  animation: ${buttonGlow} 1s infinite alternate;
  cursor: pointer;
  pointer-events: all;

  &:hover {
    filter: brightness(150%);
  }
`;

const BoundNumber = styled('div')`
  color: white;
`;

const Slider = styled('input')`

`;

export interface SplitStackMenuProps {
  min: number;
  max: number;
  onSplit: (e: MouseEvent, amount: number) => void;
}

export interface SplitStackMenuState {
  value: number;
}

class SplitStackMenu extends React.Component<SplitStackMenuProps, SplitStackMenuState> {
  constructor(props: SplitStackMenuProps) {
    super(props);
    this.state = {
      value: Math.floor(props.max / 2) || props.min,
    };
  }

  public render() {
    const { min, max } = this.props;
    return (
      <Container>
        <InfoContainer>
          <BoundNumber>{min}</BoundNumber>
          <Button onClick={this.onSplit}>{this.state.value}</Button>
          <BoundNumber>{max}</BoundNumber>
        </InfoContainer>
        <Slider type='range' value={this.state.value} min={min} max={max} step={1} onChange={this.onSliderChange} />
      </Container>
    );
  }

  private onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    this.setState({ value });
  }

  private onSplit = (e: MouseEvent) => {
    hideContextMenu();
    this.props.onSplit(e, this.state.value);
  }
}

export default SplitStackMenu;
