/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ResourceBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  transform: skewX(-10deg);

  &.square {
    transform: none;
  }
`;

const BackFill = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 0;
  background-color: rgba(255, 255, 255, 1);
  transition: width 0.3s;
  animation: pulse 0.5s infinite;
  box-shadow: 0px 0px 60px 15px rgba(255,0,0,1);

  @keyframes pulse {
    from {
      opacity: 1;
    }
    to {
      opacity: .6;
    }
  }
`;

const FillContainer = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 0;

  &.blue {
    backgronud-color: #1d2c54;
  }

  &.green {
    background-color: #002e0b;
  }

  &.orange {
    background-color: #1b1b1b;
  }

  &.red {
    background-color: #3e0000;
  }
`;

const Fill = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  &:before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(to right, transparent 85%, rgba(255, 255, 255, 0.6));
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 2px solid rgba(255, 255, 255, 0.15);
  }

  &.blue {
    background-color: #2a52b9;
    &:before {
      background: linear-gradient(138deg, transparent 70%, rgba(5, 255, 251, 0.6));
    }

    &:after {
      border: 2px solid rgba(40, 235, 255, 0.25);
    }
  }

  &.red {
    background: #D22026;

    &:after {
      border: 2px solid rgba(254, 255, 64, 0.3);
    }
  }

  &.green {
    background-color: rgba(68, 174, 104, 1);

    &:before {
      background: linear-gradient(138deg, transparent 85%, rgba(227, 255, 89, 0.8));
    }

    &:after {
      border: 2px solid rgba(254, 255, 64, 0.3);
    }
  }

  &.orange {
    background-color: #ec7b20;
    &:before {
      background: linear-gradient(138deg, transparent 85%, rgba(227, 255, 89, 0.8));
    }

    &:after {
      border: 2px solid rgba(254, 255, 64, 0.3);
    }
  }

  &.red {
    background-color: rgba(125, 4, 2, 1);

    &: before {
      background: linear-gradient(138deg, transparent 85%, rgba(255, 8, 5, 0.3));
    }

    &:after {
      border: 2px solid rgba(201, 26, 20, 0.3);
    }
  }

  &.rage {
    background: linear-gradient(to right, #ffb000, #ffff98);

    &:after {
      border: 2px solid rgba(254, 255, 64, 0.3);
    }
  }
`;

const Text = styled.div`
  font-family: Colus;
  color: white;
  font-size: 13px;
  z-index: 1;
  transform: skewX(10deg);

  &.square {
    transform: none;
  }
`;

export interface Props {
  type: 'blue' | 'green' | 'orange' | 'red' | 'rage';
  current: number;
  max: number;
  text?: string;
  hideText?: boolean;
  containerStyles?: string;
  isSquare?: boolean;
  unsquareText?: boolean;
  textStyles?: string;
  shouldPlayBackfill?: boolean;
}

export interface State {
  backFillPercentage: number;
}

export class ResourceBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      backFillPercentage: (this.props.current / this.props.max) * 100,
    };
  }

  public render() {
    const squareClass = this.props.isSquare ? 'square' : '';
    const textSquareClass = !this.props.unsquareText && this.props.isSquare ? 'square' : '';
    const barPercentage = (this.props.current / this.props.max) * 100;
    return (
      <ResourceBarContainer className={`${squareClass} ${this.props.containerStyles || ''}`}>
        {this.props.shouldPlayBackfill && <BackFill style={{ width: `${this.state.backFillPercentage}%` }} />}
        <FillContainer className={this.props.type} style={{ width: `${barPercentage}%` }}>
          <Fill className={this.props.type} />
        </FillContainer>
        {!this.props.hideText && !this.props.text &&
          <Text className={`${textSquareClass} ${this.props.textStyles ? this.props.textStyles : ''}`}>
            {Math.round(this.props.current).toFixed(0)} / {Math.round(this.props.max).toFixed(0)}
          </Text>
        }
        {this.props.text && <Text className={squareClass}>{this.props.text}</Text>}
      </ResourceBarContainer>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.shouldPlayBackfill && (prevProps.current !== this.props.current || prevProps.max !== this.props.max)) {
      this.setState({ backFillPercentage: (this.props.current / this.props.max) * 100 });
    }
  }
}
