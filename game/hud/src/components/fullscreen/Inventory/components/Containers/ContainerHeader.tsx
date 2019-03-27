/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { css } from '@csegames/linaria';
import { webAPI } from '@csegames/camelot-unchained';
import { CloseButton } from 'shared/CloseButton';

import { nullVal, MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { getContainerColor } from 'fullscreen/lib/utils';
import { InventoryItem } from 'gql/interfaces';

// #region Container constants
const CONTAINER_HEIGHT = 90;
const CONTAINER_PADDING_HORIZONTAL = 10;
// #endregion
const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${CONTAINER_HEIGHT}px;
  padding: 0px ${CONTAINER_PADDING_HORIZONTAL}px;

  @media (max-width: 2560px) {
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;
    padding: 0px ${CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
    padding: 0 ${CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region ContainerName constants
const CONTAINER_NAME_FONT_SIZE = 36;
const CONTAINER_NAME_LETTER_SPACING = 4;
const CONTAINER_NAME_PADDING_HORIZONTAL = 10;
// #endregion
const ContainerName = styled.div`
  font-size: ${CONTAINER_NAME_FONT_SIZE}px;
  letter-spacing: ${CONTAINER_NAME_LETTER_SPACING}px;
  padding: 0 ${CONTAINER_NAME_PADDING_HORIZONTAL}px;
  font-family: Caudex;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-style: solid;
  border-image: linear-gradient(to right, ${((props: any) => props.borderColor)}, transparent 55%) 10% 1%;
  background: linear-gradient(to right, ${(props: any) => props.backgroundColor}, transparent 40%);
  flex: 1;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 2560px) {
    font-size: ${CONTAINER_NAME_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${CONTAINER_NAME_LETTER_SPACING * MID_SCALE}px;
    padding: 0 ${CONTAINER_NAME_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${CONTAINER_NAME_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${CONTAINER_NAME_LETTER_SPACING * HD_SCALE}px;
    padding: 0 ${CONTAINER_NAME_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region ContainerNameInput constants
const CONTAINER_NAME_INPUT_MARGIN_RIGHT = 10;
const CONTAINER_NAME_INPUT_FONT_SIZE = 36;
// #endregion
const ContainerNameInput = styled.input`
  cursor: ${(props: any) => props.cursor};
  width: ${(props: any) => props.width}px;
  color: white !important;
  margin-right: ${CONTAINER_NAME_INPUT_MARGIN_RIGHT}px !important;
  font-size: ${CONTAINER_NAME_INPUT_FONT_SIZE}px;
  background: transparent;
  outline: none;
  border: 0px;

  @media (max-width: 2560px) {
    margin-right: ${CONTAINER_NAME_INPUT_MARGIN_RIGHT * MID_SCALE}px !important;
    font-size: ${CONTAINER_NAME_INPUT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${CONTAINER_NAME_INPUT_MARGIN_RIGHT * HD_SCALE}px !important;
    font-size: ${CONTAINER_NAME_INPUT_FONT_SIZE * HD_SCALE}px;
  }
`;

const StaticDefName = styled.div`
  display: inline-block;
  width: fit-content;
`;

// #region CloseButtonPosition constants
const CLOSE_BUTTON_POSITION_MARGIN_RIGHT = 20;
// #endregion
const CloseButtonPosition = css`
  margin-right: ${CLOSE_BUTTON_POSITION_MARGIN_RIGHT}px;

  @media (max-width: 2560px) {
    margin-right: ${CLOSE_BUTTON_POSITION_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${CLOSE_BUTTON_POSITION_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

// #region InvisiDiv constants
const INVISI_DIV_FONT_SIZE = 36;
// #endregion
const InvisiDiv = styled.div`
  width: auto;
  position: fixed;
  pointer-events: none;
  white-space: pre;
  opacity: 1;
  overflow: hidden;
  font-family: Caudex;
  font-size: ${INVISI_DIV_FONT_SIZE}px;
  letter-spacing: 0px;
  opacity: 0;

  @media (max-width: 2560px) {
    font-size: ${INVISI_DIV_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${INVISI_DIV_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface ContainerHeaderProps {
  onCloseClick: () => void;
  containerItem: InventoryItem.Fragment;
}

export interface ContainerHeaderState {
  editModeOn: boolean;
  containerNameValue: string;
  inputWidth: number;
  maxInputWidth: number;
}

class ContainerHeader extends React.Component<ContainerHeaderProps, ContainerHeaderState> {
  private nameContainer: HTMLDivElement;
  private staticDefName: HTMLDivElement;
  private invisibleDiv: HTMLDivElement;

  constructor(props: ContainerHeaderProps) {
    super(props);
    this.state = {
      editModeOn: false,
      containerNameValue: '',
      inputWidth: 0,
      maxInputWidth: 0,
    };
  }

  public render() {
    const { containerItem, onCloseClick } = this.props;
    const { containerNameValue } = this.state;

    const backgroundColor = getContainerColor(containerItem, 0.17);
    const borderColor = getContainerColor(containerItem, 0.3);
    return (
      <UIContext.Consumer>
        {(uiContext: UIContext) => {
          const closeBtnDimensions = uiContext.isUHD() ? 36 : 18;
          return (
            <Container>
              <ContainerName
                ref={(r: HTMLDivElement) => this.nameContainer = r}
                backgroundColor={backgroundColor}
                borderColor={borderColor}
              >
                <ContainerNameInput
                  id={`${containerItem.id}-container-name-input`}
                  value={containerNameValue}
                  onChange={this.onContainerNameChange}
                  onClick={this.turnOnEditMode}
                  onBlur={this.turnOffEditMode}
                  cursor={this.state.editModeOn ? 'text' : 'pointer'}
                  width={this.state.inputWidth}
                />
                <StaticDefName ref={(r: HTMLDivElement) => this.staticDefName = r}>
                  {containerNameValue !== containerItem.staticDefinition.name ?
                    `[${containerItem.staticDefinition.name}]` : ''}
                </StaticDefName>
                <InvisiDiv ref={(r: HTMLDivElement) => this.invisibleDiv = r} />
              </ContainerName>
              <CloseButton
                width={closeBtnDimensions}
                height={closeBtnDimensions}
                onClick={onCloseClick}
                className={CloseButtonPosition}
              />
            </Container>
          );
        }}
      </UIContext.Consumer>
    );
  }

  public componentDidMount() {
    const { containerItem } = this.props;
    const containerNameValue = containerItem.givenName ? containerItem.givenName : containerItem.staticDefinition.name;
    this.setState({ containerNameValue });
    setTimeout(() => this.setMaxInputWidth(), 30);
    setTimeout(() => this.calculateWidthOfInput(containerNameValue), 100);

    window.addEventListener('resize', this.setMaxInputWidth);
  }

  public shouldComponentUpdate(nextProps: ContainerHeaderProps, nextState: ContainerHeaderState) {
    return this.state.containerNameValue !== nextState.containerNameValue ||
      this.state.inputWidth !== nextState.inputWidth ||
      this.state.editModeOn !== nextState.editModeOn ||
      this.state.maxInputWidth !== nextState.inputWidth ||
      !_.isEqual(this.props.containerItem, nextProps.containerItem);
  }

  public componentWillUpdate(nextProps: ContainerHeaderProps, nextState: ContainerHeaderState) {
    if (this.state.maxInputWidth !== nextState.maxInputWidth) {
      this.calculateWidthOfInput(nextState.containerNameValue, nextState);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.setMaxInputWidth);
  }

  private turnOnEditMode = () => {
    this.setState({ editModeOn: true });
  }

  private setMaxInputWidth = () => {
    this.setState({ maxInputWidth: this.nameContainer.clientWidth });
  }

  private turnOffEditMode = () => {
    const { containerItem } = this.props;
    this.setState({ editModeOn: false });
    this.makeRenameRequest(this.state.containerNameValue);
    if (this.state.containerNameValue === '') {
      this.setState({ containerNameValue: containerItem.staticDefinition.name });
      this.calculateWidthOfInput(containerItem.staticDefinition.name);
    }
  }

  private onContainerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ containerNameValue: e.target.value });
    this.calculateWidthOfInput(e.target.value);
  }

  private makeRenameRequest = (newName: string) => {
    const { containerItem } = this.props;
    webAPI.ItemAPI.RenameItem(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      containerItem.id,
      nullVal,
      newName,
    );
  }

  private calculateWidthOfInput = (value: string, state?: ContainerHeaderState) => {
    this.invisibleDiv.innerHTML = value;
    const _state = state || this.state;
    if (this.invisibleDiv.clientWidth <= _state.maxInputWidth - this.staticDefName.clientWidth) {
      this.setState({ inputWidth: this.invisibleDiv.clientWidth });
    }
  }
}

export default ContainerHeader;
