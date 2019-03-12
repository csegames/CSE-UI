/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Tooltip } from 'shared/Tooltip';

import { AbilityType } from '..';
import { TooltipContent } from './TooltipContent';
import { TextEdit } from './TextEdit';
import { IconPicker } from './IconPicker';
import { AbilityBuilderQuery } from 'gql/interfaces';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_MARGIN = -100;
const CONTAINER_PADDING_TOP = 100;
const CONTAINER_PADDING_BOT = 200;
// #endregion
const Container = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  display: flex;
  height: fit-content;
  margin: ${CONTAINER_MARGIN}px 0;
  padding: ${CONTAINER_PADDING_TOP}px 0 ${CONTAINER_PADDING_BOT}px 0;
  pointer-events: none;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: -10px;
    bottom: 0;
    left: -10px;
    background-image: url(../images/abilitybuilder/uhd/ability-final-preview-bg.png);
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
    margin: ${CONTAINER_MARGIN * MID_SCALE}px 0;
    padding: ${CONTAINER_PADDING_TOP * MID_SCALE}px 0 ${CONTAINER_PADDING_BOT * MID_SCALE}px 0;
  }

  @media (max-width: 1920px) {
    margin: ${CONTAINER_MARGIN * HD_SCALE}px 0;
    padding: ${CONTAINER_PADDING_TOP * HD_SCALE}px 0 ${CONTAINER_PADDING_BOT * HD_SCALE}px 0;

    &:before {
      background-image: url(../images/abilitybuilder/hd/ability-final-preview-bg.png);
    }
  }
`;

// #region Title constants
const TITLE_TOP = 220;
const TITLE_FONT_SIZE = 36;
const TITLE_LETTER_SPACING = 4;
// #endregion
const Title = styled.div`
  position: absolute;
  top: ${TITLE_TOP}px;
  font-size: ${TITLE_FONT_SIZE}px;
  letter-spacing: ${TITLE_LETTER_SPACING}px;
  right: 0;
  left: 0;
  margin: auto;
  text-transform: uppercase;
  text-align: center;
  font-family: TradeWinds;
  color: #cebd9d;

  @media (max-width: 2560px) {
    top: ${TITLE_TOP * MID_SCALE}px;
    font-size: ${TITLE_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${TITLE_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${TITLE_TOP * HD_SCALE}px;
    font-size: ${TITLE_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${TITLE_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region ContentContainer constants
const CONTENT_CONTAINER_MARGIN_TOP = 230;
const CONTENT_CONTAINER_MARGIN_RIGHT = 20;
const CONTENT_CONTAINER_MARGIN_LEFT = 120;
// #endregion
const ContentContainer = styled.div`
  flex: 2;
  display: flex;
  margin: ${CONTENT_CONTAINER_MARGIN_TOP}px ${CONTENT_CONTAINER_MARGIN_RIGHT}px 0 ${CONTENT_CONTAINER_MARGIN_LEFT}px;
  height: 60%;

  @media (max-width: 2560px) {
    margin: ${CONTENT_CONTAINER_MARGIN_TOP * MID_SCALE}px ${CONTENT_CONTAINER_MARGIN_RIGHT * MID_SCALE}px
     0 ${CONTENT_CONTAINER_MARGIN_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin: ${CONTENT_CONTAINER_MARGIN_TOP * HD_SCALE}px ${CONTENT_CONTAINER_MARGIN_RIGHT * HD_SCALE}px
     0 ${CONTENT_CONTAINER_MARGIN_LEFT * HD_SCALE}px;
  }
`;

// #region IconWrapper constants
const ICON_WRAPPER_DIMENSIONS = 160;
const ICON_WRAPPER_MARGIN = 30;
// #endregion
const IconWrapper = styled.div`
  position: relative;
  width: ${ICON_WRAPPER_DIMENSIONS}px;
  height: ${ICON_WRAPPER_DIMENSIONS}px;
  min-width: ${ICON_WRAPPER_DIMENSIONS}px;
  min-height: ${ICON_WRAPPER_DIMENSIONS}px;
  margin-right: ${ICON_WRAPPER_MARGIN}px;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;

  &:hover .icon-edit {
    filter: brightness(150%);
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 1px solid #EAD5F2;
    box-shadow: inset 0 0 10px 2px #704E9E, 0 0 10px 2px #6A46B3;
    border-radius: 50%;
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

  @media (max-width: 2560px) {
    width: ${ICON_WRAPPER_DIMENSIONS * MID_SCALE}px;
    height: ${ICON_WRAPPER_DIMENSIONS * MID_SCALE}px;
    min-width: ${ICON_WRAPPER_DIMENSIONS * MID_SCALE}px;
    min-height: ${ICON_WRAPPER_DIMENSIONS * MID_SCALE}px;
    margin-right: ${ICON_WRAPPER_MARGIN * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ICON_WRAPPER_DIMENSIONS * HD_SCALE}px;
    height: ${ICON_WRAPPER_DIMENSIONS * HD_SCALE}px;
    min-width: ${ICON_WRAPPER_DIMENSIONS * HD_SCALE}px;
    min-height: ${ICON_WRAPPER_DIMENSIONS * HD_SCALE}px;
    margin-right: ${ICON_WRAPPER_MARGIN * HD_SCALE}px;
  }
`;

const Icon = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

// #region EditMiniIcon constants
const EDIT_MINI_ICON_DIMENSIONS = 50;
const EDIT_MINI_ICON_FONT_SIZE = 32;
// #endregion
const EditMiniIcon = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${EDIT_MINI_ICON_DIMENSIONS}px;
  height: ${EDIT_MINI_ICON_DIMENSIONS}px;
  font-size: ${EDIT_MINI_ICON_FONT_SIZE}px;
  border-radius: 50%;
  color: #cebd9d;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  z-index: 1;

  &:hover {
    filter: brightness(150%);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: ${EDIT_MINI_ICON_DIMENSIONS}px;
    height: ${EDIT_MINI_ICON_DIMENSIONS}px;
    z-index: 2;
    border: 1px solid #EAD5F2;
    box-shadow: inset 0 0 10px 2px #704E9E, 0 0 10px 2px #6A46B3;
    border-radius: 50%;
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

  @media (max-width: 2560px) {
    width: ${EDIT_MINI_ICON_DIMENSIONS * MID_SCALE}px;
    height: ${EDIT_MINI_ICON_DIMENSIONS * MID_SCALE}px;
    font-size: ${EDIT_MINI_ICON_FONT_SIZE * MID_SCALE}px;

    &:after {
      width: ${EDIT_MINI_ICON_DIMENSIONS * MID_SCALE}px;
      height: ${EDIT_MINI_ICON_DIMENSIONS * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    width: ${EDIT_MINI_ICON_DIMENSIONS * HD_SCALE}px;
    height: ${EDIT_MINI_ICON_DIMENSIONS * HD_SCALE}px;
    font-size: ${EDIT_MINI_ICON_FONT_SIZE * HD_SCALE}px;

    &:after {
      width: ${EDIT_MINI_ICON_DIMENSIONS * HD_SCALE}px;
      height: ${EDIT_MINI_ICON_DIMENSIONS * HD_SCALE}px;
    }
  }
`;

const InfoContainer = styled.div`
  width: 100%;
`;

const Name = css`
  letter-spacing: 0px !important;
`;

// #region Description constants
const DESCRIPTION_FONT_SIZE = 30;
const DESCRIPTION_LINE_HEIGHT = 36;
const DESCRIPTION_MARGIN = 40;
const DESCRIPTION_LETTER_SPACING = 2;
// #endregion
const Description = styled.div`
  color: #8862AC;
  text-transform: none;
  font-family: TitilliumWeb;
  font-size: ${DESCRIPTION_FONT_SIZE}px;
  line-height: ${DESCRIPTION_LINE_HEIGHT}px;
  margin-bottom: ${DESCRIPTION_MARGIN}px;
  letter-spacing: ${DESCRIPTION_LETTER_SPACING}px;

  &::placeholder {
    color: #8862AC;
    opacity: 0.7;
  }

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
    font-size: ${DESCRIPTION_FONT_SIZE * MID_SCALE}px;
    line-height: ${DESCRIPTION_LINE_HEIGHT * MID_SCALE}px;
    margin-bottom: ${DESCRIPTION_MARGIN * MID_SCALE}px;
    letter-spacing: ${DESCRIPTION_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${DESCRIPTION_FONT_SIZE * HD_SCALE}px;
    line-height: ${DESCRIPTION_LINE_HEIGHT * HD_SCALE}px;
    margin-bottom: ${DESCRIPTION_MARGIN * HD_SCALE}px;
    letter-spacing: ${DESCRIPTION_LETTER_SPACING * HD_SCALE}px;
  }
`;

const ComponentContainer = styled.div`
  display: flex;
`;

// #region ComponentImageWrapper constants
const COMPONENT_IMAGE_WRAPPER_DIMENSIONS = 100;
const COMPONENT_IMAGE_WRAPPER_MARGIN = 10;
// #endregion
const ComponentImageWrapper = styled.div`
  position: relative;
  width: ${COMPONENT_IMAGE_WRAPPER_DIMENSIONS}px;
  height: ${COMPONENT_IMAGE_WRAPPER_DIMENSIONS}px;
  margin 0 ${COMPONENT_IMAGE_WRAPPER_MARGIN}px;
  pointer-events: all;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
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

  @media (max-width: 2560px) {
    width: ${COMPONENT_IMAGE_WRAPPER_DIMENSIONS * MID_SCALE}px;
    height: ${COMPONENT_IMAGE_WRAPPER_DIMENSIONS * MID_SCALE}px;
    margin 0 ${COMPONENT_IMAGE_WRAPPER_MARGIN * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${COMPONENT_IMAGE_WRAPPER_DIMENSIONS * HD_SCALE}px;
    height: ${COMPONENT_IMAGE_WRAPPER_DIMENSIONS * HD_SCALE}px;
    margin 0 ${COMPONENT_IMAGE_WRAPPER_MARGIN * HD_SCALE}px;
  }
`;

const ComponentImage = styled.img`
  width: 100%;
  height: 100%;
`;

// const StatsContainer = styled.div`
//   flex: 1;
//   margin: 230px 0 0 20px;
//   padding-right: 20px;
//   height: 60%;
//   overflow: auto;
//   pointer-events: all;

//   @media (max-width: 1920px) {
//     margin: 115px 0 0 10px;
//     padding-right: 10px;
//   }
// `;

// const StatItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   color: #D5A5FF;
//   font-size: 32px;
//   padding-right: 20%;
//   &.Melee {
//     filter: hue-rotate(110deg);
//   }

//   &.Archery {
//     filter: hue-rotate(-75deg);
//   }

//   &.Shout {
//     filter: hue-rotate(135deg);
//   }

//   &.Throwing {
//     filter: hue-rotate(-135deg);
//   }

//   @media (max-width: 1920px) {
//     font-size: 16px;
//   }
// `;

export interface InjectedProps {
  isUHD: boolean;
}

export interface ComponentProps {
  selectedType: AbilityType;
  selectedIcon: string;
  name: string;
  description: string;
  onSelectedIconChange: (icon: string) => void;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  components: AbilityBuilderQuery.AbilityComponents[];
}

export type Props = InjectedProps & ComponentProps;

export interface State {
  iconPickerTop: number;
  showIconPicker: boolean;
}

class Preview extends React.PureComponent<Props, State> {
  private cachedParentHeight: number;
  private containerRef: HTMLDivElement;
  // private statsContainerRef: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      iconPickerTop: 0,
      showIconPicker: false,
    };
  }

  public render() {
    const { components, selectedType } = this.props;
    // const stats = this.getStats();

    return (
      <>
      {this.state.showIconPicker &&
        <IconPicker
          top={this.state.iconPickerTop}
          selectedAbilityType={this.props.selectedType}
          onIconClick={this.onSelectedIconChange}
          onCloseIconPicker={this.onCloseIconPicker}
        />
      }
      <Container ref={r => this.containerRef = r} className={selectedType.name}>
        <Title>Preview</Title>
        <ContentContainer>

          <IconWrapper onClick={this.onOpenIconPicker} className={selectedType.name}>
            <Icon src={this.props.selectedIcon} />
            <EditMiniIcon className={`icon-edit ${selectedType.name}`} />
          </IconWrapper>

          <InfoContainer>
            <TextEdit
              value={this.props.name}
              textAreaClass={Name}
              onChange={this.props.onNameChange}
              selectedType={this.props.selectedType}
            />
            <Description className={selectedType.name}>
              {components.map(component => component.display.description + '. ')}
            </Description>
            <ComponentContainer>
              {components.map((component) => {
                return (
                  <Tooltip
                    content={
                      <TooltipContent
                        componentItem={component}
                        selectedComponentsList={this.props.components}
                      />
                    }>
                    <ComponentImageWrapper className={selectedType.name}>
                      <ComponentImage src={component.display.iconURL} />
                    </ComponentImageWrapper>
                  </Tooltip>
                );
              })}
            </ComponentContainer>
          </InfoContainer>
        </ContentContainer>

        {/* <StatsContainer
          className='cse-ui-scroller-thumbonly'
          ref={r => this.statsContainerRef = r}
          onWheel={this.handleScroll}>
          {stats.map((stat) => {
            return (
              <StatItem className={abilityType}>
                <div>{stat.name}</div>
                <div>{stat.value}</div>
              </StatItem>
            );
          })}
        </StatsContainer> */}
      </Container>
      </>
    );
  }

  public componentDidMount() {
    window.addEventListener('optimizedResize', this.listenForHeightChanges);
    this.containerRef.parentElement.addEventListener('scroll', this.updateIconPickerPosition);
  }

  public componentWillUpdate(prevProps: Props) {
    if (prevProps.isUHD !== this.props.isUHD) {
      this.updateIconPickerPosition();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('optimizedResize', this.listenForHeightChanges);
    this.containerRef.parentElement.removeEventListener('scroll', this.updateIconPickerPosition);
  }

  private listenForHeightChanges = () => {
    const parentContainerHeight = this.containerRef.parentElement.scrollHeight;
    if (!this.cachedParentHeight || this.cachedParentHeight !== parentContainerHeight) {
      this.cachedParentHeight = parentContainerHeight;
      this.updateIconPickerPosition();
    }
  }

  private updateIconPickerPosition = () => {
    if (this.state.showIconPicker) {
      this.setState(this.getIconPickerPosition());
    }
  }

  private getIconPickerPosition = () => {
    const topPadding = this.props.isUHD ? 230 : 115;
    const heightOfPicker = this.props.isUHD ? 600 : 300;
    const marginOfPicker = this.props.isUHD ? 20 : 10;
    const parentElement = this.containerRef.parentElement;
    const parentContainerHeight = parentElement.clientHeight;
    const top = this.containerRef.offsetTop + topPadding - parentElement.scrollTop;

    if (top + heightOfPicker > parentContainerHeight) {
      // Overflows, just stay flush with bottom now.
      return {
        iconPickerTop: parentContainerHeight - heightOfPicker - marginOfPicker,
      };
    } else {
      return {
        iconPickerTop: top,
      };
    }
  }

  private onSelectedIconChange = (icon: string) => {
    this.onCloseIconPicker();
    this.props.onSelectedIconChange(icon);
  }

  private onOpenIconPicker = () => {
    this.setState({ showIconPicker: true, ...this.getIconPickerPosition() });
  }

  private onCloseIconPicker = () => {
    this.setState({ showIconPicker: false });
  }

  // private handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   this.statsContainerRef.scrollTop += e.deltaY;
  // }

  // private getStats = () => {
  //   const statMap: { [name: string]: { name: string, value: number } } = {};
  //   this.props.components.forEach((component) => {
  //     component.stats.forEach((stat) => {
  //       if (!statMap[stat.name]) {
  //         statMap[stat.name] = stat;
  //       } else {
  //         statMap[stat.name] = { ...statMap[stat.name], value: statMap[stat.name].value + stat.value };
  //       }
  //     });
  //   });

  //   return values(statMap);
  // }
}

class PreviewWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <UIContext.Consumer>
        {(uiContext: UIContext) => (
          <Preview {...this.props} isUHD={uiContext.isUHD()} />
        )}
      </UIContext.Consumer>
    );
  }
}

export { PreviewWithInjectedContext as Preview };
