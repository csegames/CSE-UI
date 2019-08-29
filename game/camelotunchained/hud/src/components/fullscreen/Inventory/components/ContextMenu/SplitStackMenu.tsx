/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { KeyCodes } from '@csegames/library/lib/camelotunchained';
import { hideContextMenu } from 'actions/contextMenu';
import { Slider } from 'cseshared/components/Slider';
import { TextInput } from 'shared/TextInput';

const Container = styled.div`
  font-family: Titillium Web;
  color: #aaa;
  text-transform: initial;
  font-size: 14px;
  letter-spacing: .5px;
  display: inline-block;
  padding: 10px 10px;
  width: 150px;
  border: 1px solid transparent;
  border-image: url(../images/inventory/border-texture.png);
  border-image-slice: 1;
  border-image-repeat: round;
  background: url(../images/inventory/filter-input-texture.png), rgba(40, 40, 40, 1);
  text-decoration: none;
  pointer-events: all;
  z-index: 99;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  pointer-events: all;
`;

const Input = css`
  height: 20px;
  width: 50px;
  text-align: center;
  color: rgba(255, 230, 186, 1);
  background-color: rgba(0, 0, 0, 0.7);
  -webkit-animation: buttonGlow 1s infinite alternate;
  animation: buttonGlow 1s infinite alternate;
  cursor: pointer;
  pointer-events: all;

  &:hover {
    filter: brightness(150%);
  }

  @keyframes buttonGlow {
    from {
      box-shadow: 0 0 4px rgba(255, 230, 186, 0.1);
    }
    to {
      box-shadow: 0 0 4px rgba(255, 230, 186, 1);
    }
  }
`;

const BoundNumber = styled.div`
  color: white;
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
  private mouseOver: boolean = false;
  private valueBeforeEdit: number = null;
  constructor(props: SplitStackMenuProps) {
    super(props);
    this.state = {
      value: Math.floor(props.max / 2) || props.min,
    };
  }

  public render() {
    const { min, max } = this.props;
    return (
      <div>
        <Overlay onClick={this.onSplit} />
        <Container onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
          <InfoContainer>
            <BoundNumber>{min}</BoundNumber>
            <TextInput
              inputClassName={Input}
              value={this.state.value}
              onBlur={this.onBlur}
              onChange={this.onInputChange}
            />
            <BoundNumber>{max}</BoundNumber>
          </InfoContainer>
          <Slider updateInterval={0} current={this.state.value} min={min} max={max} onChange={this.onSliderChange} />
        </Container>
      </div>
    );
  }

  public componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === KeyCodes.KEY_Escape) {
      hideContextMenu();
    }
  }

  private onMouseOver = () => {
    this.mouseOver = true;
  }

  private onMouseLeave = () => {
    this.mouseOver = false;
  }

  private onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (typeof value === 'number' && value <= this.props.max) {
      if (this.valueBeforeEdit == null) {
        this.valueBeforeEdit = this.state.value;
      }

      this.setState({ value });
    }
  }

  private onBlur = () => {
    if (!this.isValueValid()) {
      this.setState({ value: this.valueBeforeEdit });
    }

    this.valueBeforeEdit = null;
  }

  private isValueValid = () => {
    return this.state.value <= this.props.max && this.state.value >= this.props.min;
  }

  private onSliderChange = (value: number) => {
    this.setState({ value });
  }

  private onSplit = (e: React.MouseEvent) => {
    if (!this.mouseOver) {
      hideContextMenu();
      if (!this.isValueValid()) {
        this.props.onSplit(e as any, this.valueBeforeEdit);
      } else {
        this.props.onSplit(e as any, this.state.value);
      }

      this.valueBeforeEdit = null;
    }
  }
}

export default SplitStackMenu;
