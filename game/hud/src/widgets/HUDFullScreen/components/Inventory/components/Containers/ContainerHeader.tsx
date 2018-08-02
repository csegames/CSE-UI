/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';
import { client, webAPI } from '@csegames/camelot-unchained';
import { CloseButton } from 'UI/CloseButton';

import { nullVal } from '../../../../lib/constants';
import { getContainerColor, requestUIKeydown, releaseUIKeydown } from '../../../../lib/utils';
import { InventoryItemFragment } from '../../../../../../gqlInterfaces';

const Container = styled('div')`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  padding: 0px 5px;
`;

const ContainerName = styled('div')`
  font-size: 18px;
  font-family: Caudex;
  letter-spacing: 2px;
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
  padding: 0 5px;
`;

const ContainerNameInput = styled('input')`
  cursor: ${(props: any) => props.cursor};
  width: ${(props: any) => props.width}px;
  color: white !important;
  margin-right: 5px !important;
  font-size: 18px;
  background: transparent;
  outline: none;
  border: 0px;
`;

const StaticDefName = styled('div')`
  display: inline-block;
  width: fit-content;
`;

const CloseButtonPosition = css`
  margin-right: 10px;
`;

const InvisiDiv = styled('div')`
  width: auto;
  position: fixed;
  pointer-events: none;
  white-space: pre;
  opacity: 1;
  overflow: hidden;
  font-family: Caudex;
  font-size: 18px;
  letter-spacing: 0px;
  opacity: 0;
`;

export interface ContainerHeaderProps {
  onCloseClick: () => void;
  containerItem: InventoryItemFragment;
}

export interface ContainerHeaderState {
  editModeOn: boolean;
  containerNameValue: string;
  inputWidth: number;
  maxInputWidth: number;
}

class ContainerHeader extends React.Component<ContainerHeaderProps, ContainerHeaderState> {
  private nameContainer: HTMLDivElement;
  private nameInput: HTMLInputElement;
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
      <Container>
        <ContainerName
          innerRef={(r: HTMLDivElement) => this.nameContainer = r}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
        >
          <ContainerNameInput
            innerRef={(r: HTMLInputElement) => this.nameInput = r}
            id={`${containerItem.id}-container-name-input`}
            value={containerNameValue}
            onChange={this.onContainerNameChange}
            onClick={this.turnOnEditMode}
            onBlur={this.turnOffEditMode}
            cursor={this.state.editModeOn ? 'text' : 'pointer'}
            width={this.state.inputWidth}
          />
          <StaticDefName innerRef={(r: HTMLDivElement) => this.staticDefName = r}>
            {containerNameValue !== containerItem.staticDefinition.name ? `[${containerItem.staticDefinition.name}]` : ''}
          </StaticDefName>
          <InvisiDiv innerRef={(r: HTMLDivElement) => this.invisibleDiv = r} />
        </ContainerName>
        <CloseButton width={18} height={18} onClick={onCloseClick} className={CloseButtonPosition} />
      </Container>
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
    requestUIKeydown();
    this.setState({ editModeOn: true });
  }

  private setMaxInputWidth = () => {
    this.setState({ maxInputWidth: this.nameContainer.clientWidth });
  }

  private turnOffEditMode = () => {
    const { containerItem } = this.props;
    releaseUIKeydown();
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
      client.loginToken,
      client.shardID,
      client.characterID,
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
