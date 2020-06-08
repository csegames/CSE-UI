/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { isArray } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { css } from '@csegames/linaria';

import ListSelector, { ListItem } from './ListSelector';
import { Tooltip } from 'shared/Tooltip';
import { TooltipContent } from './TooltipContent';
import { FallbackIcon } from 'hud/FallbackIcon';
import { checkNetworkRequirements } from '../utils';
import { AbilityBuilderQuery } from 'gql/interfaces';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';
import { AbilityType } from 'services/session/AbilityBuilderState';
import { getScaledValue } from 'hudlib/scale';

// #region Item Dimension Constants
const ITEM_DIMENSIONS_UHD = 128;
const ITEM_MARGIN_UHD = 5;
// #endregion

// #region Container Constants
const CONTAINER_PADDING_TOP = 80;
const CONTAINER_PADDING_HORIZONTAL = 60;

const CONTAINER_BORDER_WIDTH = 369;
const CONTAINER_BORDER_HEIGHT = 498;
// #endregion
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${CONTAINER_PADDING_TOP}px ${CONTAINER_PADDING_HORIZONTAL}px 0 ${CONTAINER_PADDING_HORIZONTAL}px;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    background-image: url(../images/abilitybuilder/uhd/component-border-right.png);
    background-repeat: no-repeat;
    background-size: contain;
    width: ${CONTAINER_BORDER_WIDTH}px;
    height: ${CONTAINER_BORDER_HEIGHT}px;
    pointer-events: none;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background-image: url(../images/abilitybuilder/uhd/component-border-left.png);
    background-repeat: no-repeat;
    background-size: contain;
    width: ${CONTAINER_BORDER_WIDTH}px;
    height: ${CONTAINER_BORDER_HEIGHT}px;
    pointer-events: none;
  }

  @media (max-width: 2560px) {
    padding: ${CONTAINER_PADDING_TOP * MID_SCALE}px ${CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px
     0 ${CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;

    &:before {
      width: ${CONTAINER_BORDER_WIDTH * MID_SCALE}px;
      height: ${CONTAINER_BORDER_HEIGHT * MID_SCALE}px;
    }

    &:after {
      width: ${CONTAINER_BORDER_WIDTH * MID_SCALE}px;
      height: ${CONTAINER_BORDER_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    padding: ${CONTAINER_PADDING_TOP * HD_SCALE}px ${CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px
     0 ${CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px;
    &:before {
      background-image: url(../images/abilitybuilder/hd/component-border-right.png);
      width: ${CONTAINER_BORDER_WIDTH * HD_SCALE}px;
      height: ${CONTAINER_BORDER_HEIGHT * HD_SCALE}px;
    }

    &:after {
      background-image: url(../images/abilitybuilder/hd/component-border-left.png);
      width: ${CONTAINER_BORDER_WIDTH * HD_SCALE}px;
      height: ${CONTAINER_BORDER_HEIGHT * HD_SCALE}px;
    }
  }
`;

const ContainerBG = styled.div`
  z-index: -1;
  position: absolute;
  top: -7px;
  right: 0;
  left: 0;
  height: 100%;
  background-image: url(../images/abilitybuilder/uhd/component-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  pointer-events: none;

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybuilder/hd/component-bg.png);
  }
`;

// #region Title & Closed Container Constants
const TITLE_HEIGHT = 86;
const TITLE_FONT_SIZE = 36;
const TITLE_LETTER_SPACING = 4;
// #endregion
const ClosedContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${TITLE_HEIGHT}px;
  pointer-events: none;

  @media (max-width: 2560px) {
    height: ${TITLE_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${TITLE_HEIGHT * HD_SCALE}px;
  }
`;

const TitleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: ${TITLE_HEIGHT}px;
  display: flex;
  justify-content: center;
  pointer-events: none;

  @media (max-width: 2560px) {
    height: ${TITLE_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${TITLE_HEIGHT * HD_SCALE}px;
  }
`;

// #region Component BG Constants
const COMPONENT_BG_HEIGHT = 180;
const COMPONENT_BG_PADDING = 10;
// #endregion
const ComponentBG = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  width: fit-content;
  max-width: 100%;
  background-image: url(../images/abilitybuilder/uhd/component-select-bg.png);
  background-size: 92% 100%;
  background-repeat: no-repeat;
  background-position: center center;
  height: ${COMPONENT_BG_HEIGHT}px;
  padding: 0 ${COMPONENT_BG_PADDING}px;

  @media (max-width: 2560px) {
    height: ${COMPONENT_BG_HEIGHT * MID_SCALE}px;
    padding: 0 ${COMPONENT_BG_PADDING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${COMPONENT_BG_HEIGHT * HD_SCALE}px;
    padding: 0 ${COMPONENT_BG_PADDING * HD_SCALE}px;
    background-image: url(../images/abilitybuilder/hd/component-select-bg.png);
  }
`;

// #region ListContainerStyles Constants
const LIST_CONTAINER_PADDING_VERT = 40;
const LIST_CONTAINER_PADDING_HORIZONTAL = 10;
// #endregion
const ListContainerStyles = css`
  padding: ${LIST_CONTAINER_PADDING_VERT}px ${LIST_CONTAINER_PADDING_HORIZONTAL}px;

  @media (max-width: 2560px) {
    padding: ${LIST_CONTAINER_PADDING_VERT * MID_SCALE}px ${LIST_CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${LIST_CONTAINER_PADDING_VERT * HD_SCALE}px ${LIST_CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

const Title = styled.div`
  text-transform: uppercase;
  text-align: center;
  font-family: TradeWinds;
  color: #cebd9d;
  width: 70%;
  letter-spacing: ${TITLE_LETTER_SPACING}px;
  font-size: ${TITLE_FONT_SIZE}px;
  height: ${TITLE_HEIGHT}px;
  background-image: url(../images/abilitybuilder/uhd/component-title.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none;
  z-index: 1;

  @media (max-width: 2560px) {
    letter-spacing: ${TITLE_LETTER_SPACING * MID_SCALE}px;
    font-size: ${TITLE_FONT_SIZE * MID_SCALE}px;
    height: ${TITLE_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybuilder/hd/component-title.png);
    letter-spacing: ${TITLE_LETTER_SPACING * HD_SCALE}px;
    font-size: ${TITLE_FONT_SIZE * HD_SCALE}px;
    height: ${TITLE_HEIGHT * HD_SCALE}px;
  }
`;

// #region OptionalButton Constants
const OPTIONAL_BUTTON_WIDTH = 339;
const OPTIONAL_BUTTON_HEIGHT = 75;
const OPTIONAL_BUTTON_FONT_SIZE = 36;
const OPTIONAL_BUTTON_TOP = 10;
// #endregion
const OptionalButton = styled.div`
  position: absolute;
  right: 0px;
  top: ${OPTIONAL_BUTTON_TOP}px;
  width: ${OPTIONAL_BUTTON_WIDTH}px;
  height: ${OPTIONAL_BUTTON_HEIGHT}px;
  font-size: ${OPTIONAL_BUTTON_FONT_SIZE}px;
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  pointer-events: all;
  color: #cebd9d;
  font-family: TradeWinds;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  &:hover {
    filter: brightness(130%);
  }

  &.add {
    background-image: url(../images/abilitybuilder/hd/component-optional-add-btn.png);
  }

  &.remove {
    background-image: url(../images/abilitybuilder/hd/component-optional-remove-btn.png);
  }

  &.disabled {
    cursor: not-allowed;
    &:hover {
      filter: brightness(100%);
    }
  }

  @media (max-width: 2560px) {
    width: ${OPTIONAL_BUTTON_WIDTH * MID_SCALE}px;
    height: ${OPTIONAL_BUTTON_HEIGHT * MID_SCALE}px;
    font-size: ${OPTIONAL_BUTTON_FONT_SIZE * MID_SCALE}px;
    top: ${OPTIONAL_BUTTON_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${OPTIONAL_BUTTON_WIDTH * HD_SCALE}px;
    height: ${OPTIONAL_BUTTON_HEIGHT * HD_SCALE}px;
    font-size: ${OPTIONAL_BUTTON_FONT_SIZE * HD_SCALE}px;
    top: ${OPTIONAL_BUTTON_TOP * HD_SCALE}px;
  }
`;

// #region Next & Prev Button Constants
const SCROLL_BUTTON_WIDTH = 76;
const SCROLL_BUTTON_HEIGHT = 140;
const SCROLL_BUTTON_MARGIN = 20;
// #endregion
const NextButton = styled.div`
  width: ${SCROLL_BUTTON_WIDTH}px;
  height: ${SCROLL_BUTTON_HEIGHT}px;
  margin-left: ${SCROLL_BUTTON_MARGIN}px;
  background-image: url(../images/abilitybuilder/uhd/right-arrow.png);
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
  pointer-events: all;
  z-index: 1;

  &:hover {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
  }

  &:active {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
  }

  @media (max-width: 2560px) {
    width: ${SCROLL_BUTTON_WIDTH * MID_SCALE}px;
    height: ${SCROLL_BUTTON_HEIGHT * MID_SCALE}px;
    margin-left: ${SCROLL_BUTTON_MARGIN * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybuilder/hd/right-arrow.png);
    width: ${SCROLL_BUTTON_WIDTH * HD_SCALE}px;
    height: ${SCROLL_BUTTON_HEIGHT * HD_SCALE}px;
    margin-left: ${SCROLL_BUTTON_MARGIN * HD_SCALE}px;
  }
`;

const PrevButton = styled.div`
  width: ${SCROLL_BUTTON_WIDTH}px;
  height: ${SCROLL_BUTTON_HEIGHT}px;
  margin-right: ${SCROLL_BUTTON_MARGIN}px;
  background-image: url(../images/abilitybuilder/uhd/left-arrow.png);
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
  pointer-events: all;
  z-index: 1;

  &:hover {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
  }

  &:active {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
  }

  @media (max-width: 2560px) {
    width: ${SCROLL_BUTTON_WIDTH * MID_SCALE}px;
    height: ${SCROLL_BUTTON_HEIGHT * MID_SCALE}px;
    margin-right: ${SCROLL_BUTTON_MARGIN * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybuilder/hd/left-arrow.png);
    width: ${SCROLL_BUTTON_WIDTH * HD_SCALE}px;
    height: ${SCROLL_BUTTON_HEIGHT * HD_SCALE}px;
    margin-right: ${SCROLL_BUTTON_MARGIN * HD_SCALE}px;
  }
`;

const ItemContainer = styled.div`
  position: relative;
  width: ${ITEM_DIMENSIONS_UHD}px;
  height: ${ITEM_DIMENSIONS_UHD}px;
  min-width: ${ITEM_DIMENSIONS_UHD}px;
  min-height: ${ITEM_DIMENSIONS_UHD}px;
  margin: 0 ${ITEM_MARGIN_UHD}px;
  cursor: pointer;
  transition: transform 0.05s, opacity 0.5s, filter 0.5s, box-shadow 0.5s;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &:hover:after {
    box-shadow: inset 0 0 10px 2px rgba(255, 255, 255, 0.3);
  }

  &.selected {
    &.single-select {
      transform: scale(1.2);
    }
    z-index: 10;

    &:after {
      border: 1px solid #EAD5F2;
      box-shadow: inset 0 0 10px 2px #704E9E, 0 0 10px 2px #6A46B3;
    }

    &.Melee:after {
      filter: hue-rotate(110deg);
    }

    &.Archery:after {
      filter: hue-rotate(-75deg);
    }

    &.Shout:after {
      filter: hue-rotate(135deg);
    }

    &.Throwing:after {
      filter: hue-rotate(-135deg);
    }
  }

  &.disabled {
    cursor: not-allowed;
    filter: brightness(50%);
    opacity: 0.5;
  }

  &.disabled:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: inset 0 0 10px 10px rgba(0, 0, 0, 0.9);
  }

  @media (max-width: 2560px) {
    width: ${ITEM_DIMENSIONS_UHD * MID_SCALE}px;
    height: ${ITEM_DIMENSIONS_UHD * MID_SCALE}px;
    min-width: ${ITEM_DIMENSIONS_UHD * MID_SCALE}px;
    min-height: ${ITEM_DIMENSIONS_UHD * MID_SCALE}px;
    margin: 0 ${ITEM_MARGIN_UHD * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ITEM_DIMENSIONS_UHD * HD_SCALE}px;
    height: ${ITEM_DIMENSIONS_UHD * HD_SCALE}px;
    min-width: ${ITEM_DIMENSIONS_UHD * HD_SCALE}px;
    min-height: ${ITEM_DIMENSIONS_UHD * HD_SCALE}px;
    margin: 0 ${ITEM_MARGIN_UHD * HD_SCALE}px;
  }
`;

const ComponentIcon = css`
  width: 100%;
  height: 98%;
`;

// #region DescriptionContainer Constants
const DESCRIPTION_CONTAINER_PADDING_TOP = 80;
const DESCRIPTION_CONTAINER_PADDING_BOT = 100;
const DESCRIPTION_CONTAINER_MARGIN = -20;
// #endregion
const DescriptionContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
  height: fit-content;
  padding: ${DESCRIPTION_CONTAINER_PADDING_TOP}px 15% ${DESCRIPTION_CONTAINER_PADDING_BOT}px 15%;
  margin-top: ${DESCRIPTION_CONTAINER_MARGIN}px;
  z-index: 1;
  color: #F3F3F3;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url(../images/abilitybuilder/uhd/component-description-bg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: -1;
  }

  &.Melee:before {
    filter: hue-rotate(110deg);
  }

  &.Archery:before {
    filter: hue-rotate(-75deg);
  }

  &.Shout:before {
    filter: hue-rotate(135deg);
  }

  &.Throwing:before {
    filter: hue-rotate(-135deg);
  }

  @media (max-width: 2560px) {
    padding: ${DESCRIPTION_CONTAINER_PADDING_TOP * MID_SCALE}px 15% ${DESCRIPTION_CONTAINER_PADDING_BOT * MID_SCALE}px 15%;
    margin-top: ${DESCRIPTION_CONTAINER_MARGIN * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${DESCRIPTION_CONTAINER_PADDING_TOP * HD_SCALE}px 15% ${DESCRIPTION_CONTAINER_PADDING_BOT * HD_SCALE}px 15%;
    margin-top: ${DESCRIPTION_CONTAINER_MARGIN * HD_SCALE}px;

    &:before {
      background-image: url(../images/abilitybuilder/hd/component-description-bg.png);
    }
  }
`;

// #region DescriptionTitle Constants
const DESCRIPTION_TITLE_FONT_SIZE = 36;
const DESCRIPTION_TITLE_LETTER_SPACING = 8;
// #endregion
const DescriptionTitle = styled.div`
  text-transform: uppercase;
  font-size: ${DESCRIPTION_TITLE_FONT_SIZE}px;
  letter-spacing: ${DESCRIPTION_TITLE_LETTER_SPACING}px;
  font-family: Caudex;
  color: #F3F3F3;

  @media (max-width: 2560px) {
    font-size: ${DESCRIPTION_TITLE_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${DESCRIPTION_TITLE_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${DESCRIPTION_TITLE_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${DESCRIPTION_TITLE_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region DescriptionText Constants
const DESCRIPTION_TEXT_FONT_SIZE = 30;
// #endregion
const DescriptionText = styled.div`
  font-size: ${DESCRIPTION_TEXT_FONT_SIZE}px;
  font-family: TitilliumWeb;
  color: #E7C8FF;

  &.Melee {
    filter: hue-rotate(110deg);
  }

  &.Archery {
    filter: hue-rotate(-75deg);
  }

  &.Shout {
    filter: hue-rotate(135deg);
  }

  &.Throwing {
    filter: hue-rotate(-135deg);
  }

  @media (max-width: 2560px) {
    font-size: ${DESCRIPTION_TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${DESCRIPTION_TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

const MultiDescriptonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export interface ComponentItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  stats: { name: string, value: number }[];
}

export interface State {
  // Only applies to optional ability component types.
  closed: boolean;
}

export interface Props {
  title: string;
  listItems: ListItem<AbilityBuilderQuery.AbilityComponents>[];
  categoryID: string;
  selectedItem: string | string[];
  onSelectedItemChange: (categoryID: string, componentID: string) => void;
  selectedType: AbilityType;
  selectedComponentsList: AbilityBuilderQuery.AbilityComponents[];

  optional?: boolean;
}

export class ComponentSelector extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      closed: props.optional,
    };
  }

  public render() {
    const { selectedType, optional, title, listItems, selectedComponentsList } = this.props;
    if (this.state.closed) {
      return (
        <ClosedContainer>
          <TitleContainer>
            <div />
            <Title>{title} (Optional)</Title>
            {this.props.listItems.length === 0 ?
              <Tooltip content='There are no components for this category at the moment.'>
                <OptionalButton className='add disabled'>Add</OptionalButton>
              </Tooltip> :
              <OptionalButton className='add' onClick={this.onOptionalOpen}>Add</OptionalButton>
            }
          </TitleContainer>
        </ClosedContainer>
      );
    }

    return (
      <UIContext.Consumer>
        {(uiContext: UIContext) => {
          const itemDimension = getScaledValue(uiContext, ITEM_DIMENSIONS_UHD);
          const itemMargin = getScaledValue(uiContext, ITEM_MARGIN_UHD);
          return (
            <Container>
              <ContainerBG />
              <TitleContainer>
                {optional && <div />}
                <Title>{title}{optional ? ' (Optional)' : ''}</Title>
                {optional &&
                  <OptionalButton className='remove' onClick={this.onOptionalClose}>Remove</OptionalButton>
                }
              </TitleContainer>
              <ComponentBG>
                <ListSelector
                  itemDimensions={{ width: itemDimension, height: itemDimension, margin: itemMargin * 2 }}
                  listItems={listItems}
                  renderListItem={(item: ListItem<AbilityBuilderQuery.AbilityComponents>) => {
                    const networkRequirementResults = checkNetworkRequirements(item.data, selectedComponentsList);
                    const isDisabled = !networkRequirementResults.meetsExcludeComponentReq ||
                      !networkRequirementResults.meetsExcludeTagReq ||
                      !networkRequirementResults.meetsRequireComponentReq ||
                      !networkRequirementResults.meetsRequireTagReq ||
                      networkRequirementResults.isAnExcludeTag.result ||
                      networkRequirementResults.isAnExcludeComponent.result;
                    return (
                      <Tooltip content={
                        <TooltipContent
                          componentItem={item.data}
                          selectedComponentsList={this.props.selectedComponentsList}
                        />
                      }>
                        <ItemContainer
                          className={`${this.isSelectedItem(item.data) ? 'selected' : ''} ${isArray(this.props.selectedItem)
                            ? '' : 'single-select'} ${selectedType.name} ${isDisabled ? 'disabled' : ''}`}
                          onClick={isDisabled ? () => {} :
                            () => this.props.onSelectedItemChange(this.props.categoryID, item.id)}>
                          <FallbackIcon id={item.id} icon={item.data.display.iconURL} extraStyles={ComponentIcon} />
                        </ItemContainer>
                      </Tooltip>
                    );
                  }}
                  renderNextButton={() => <NextButton />}
                  renderPrevButton={() => <PrevButton />}
                  listContainerStyles={ListContainerStyles}
                />
              </ComponentBG>
              {this.renderDescription()}
            </Container>
          );
        }}
      </UIContext.Consumer>
    );
  }

  public componentDidMount() {
    if (this.props.optional) {
      let hasSelectedComponent = false;
      this.props.selectedComponentsList.forEach((selectedComponent) => {
        if (this.props.listItems.find(item => item.id === selectedComponent.id)) {
          hasSelectedComponent = true;
        }
      });

      if (hasSelectedComponent) {
        this.setState({ closed: false });
      }
    }
  }

  private renderDescription = () => {
    if (!this.props.selectedItem) {
      return null;
    }

    const { selectedItem, selectedType } = this.props;
    if (isArray(selectedItem)) {
      return (
        <DescriptionContainer className={selectedType.name}>
          Choose one more more
          <MultiDescriptonContainer>
            {selectedItem.map((id, i) => {
              const component = this.getComponent(id);
              return (
                <DescriptionTitle>{component.data.display.name}{i === selectedItem.length - 1 ? '' : `, `}</DescriptionTitle>
              );
            })}
          </MultiDescriptonContainer>
        </DescriptionContainer>
      );
    }

    const component = this.getComponent(selectedItem);
    return (
      <DescriptionContainer className={selectedType.name}>
        <DescriptionTitle>{component.data.display.name}</DescriptionTitle>
        <DescriptionText className={selectedType.name}>
          {component.data.display.description || component.data.display.name}
        </DescriptionText>
      </DescriptionContainer>
    );
  }

  private getComponent = (id: string) => {
    return this.props.listItems.find(item => item.id === id);
  }

  private isSelectedItem = (item: AbilityBuilderQuery.AbilityComponents) => {
    if (!this.props.selectedItem) return false;

    if (isArray(this.props.selectedItem)) {
      return typeof this.props.selectedItem.find(i => i === item.id) !== 'undefined';
    }

    return this.props.selectedItem === item.id;
  }

  private onOptionalOpen = () => {
    this.setState({ closed: false });
  }

  private onOptionalClose = () => {
    this.setState({ closed: true });
    this.props.onSelectedItemChange(this.props.categoryID, null);
  }
}
