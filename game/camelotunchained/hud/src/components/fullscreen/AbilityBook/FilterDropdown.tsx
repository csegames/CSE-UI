/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { isArray, isEmpty } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { Checkbox } from 'shared/Checkbox';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { AbilityComponent } from 'gql/interfaces';

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

// #region ContentWrapper constants
const CONTENT_WRAPPER_MARGIN_TOP = -14;
const CONTENT_WRAPPER_MARGIN_LEFT = 8;
const CONTENT_WRAPPER_WIDTH = 450;
const CONTENT_WRAPPER_MAX_HEIGHT = 600;
const CONTENT_WRAPPER_SCROLL_BAR_WIDTH = 20;
const CONTENT_WRAPPER_PADDING_RIGHT = 10;
// #endregion
const ContentWrapper = styled.div`
  display: ${(props: { shouldShow: boolean } &
    React.HTMLProps<HTMLDivElement>) => props.shouldShow ? 'block' : 'none'};
  width: ${CONTENT_WRAPPER_WIDTH - CONTENT_WRAPPER_PADDING_RIGHT}px;
  max-height: ${CONTENT_WRAPPER_MAX_HEIGHT}px;
  margin-top: ${CONTENT_WRAPPER_MARGIN_TOP}px;
  margin-left: ${CONTENT_WRAPPER_MARGIN_LEFT}px;
  padding-right: ${CONTENT_WRAPPER_PADDING_RIGHT}px;
  background-color: #6B3C30;
  position: absolute;
  z-index: 999;

  @media (max-width: 2560px) {
    width: ${(CONTENT_WRAPPER_WIDTH * MID_SCALE) - (CONTENT_WRAPPER_PADDING_RIGHT * MID_SCALE)}px;
    max-height: ${CONTENT_WRAPPER_MAX_HEIGHT * MID_SCALE}px;
    margin-top: ${CONTENT_WRAPPER_MARGIN_TOP * MID_SCALE}px;
    margin-left: ${CONTENT_WRAPPER_MARGIN_LEFT * MID_SCALE}px;
    padding-right: ${CONTENT_WRAPPER_PADDING_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${(CONTENT_WRAPPER_WIDTH * HD_SCALE) - (CONTENT_WRAPPER_PADDING_RIGHT * HD_SCALE)}px;
    max-height: ${CONTENT_WRAPPER_MAX_HEIGHT * HD_SCALE}px;
    margin-top: ${CONTENT_WRAPPER_MARGIN_TOP * HD_SCALE}px;
    margin-left: ${CONTENT_WRAPPER_MARGIN_LEFT * HD_SCALE}px;
    padding-right: ${CONTENT_WRAPPER_PADDING_RIGHT * HD_SCALE}px;
  }
`;

// #region AllSelect constants
const ALL_SELECT_FONT_SIZE = 20;
const ALL_SELECT_PADDING_HORIZONTAL = 10;
const ALL_SELECT_HEIGHT = 30;
// #endregion
const AllSelect = styled.div`
  cursor: pointer;
  height: ${ALL_SELECT_HEIGHT}px;
  font-size: ${ALL_SELECT_FONT_SIZE}px;
  padding: 0px ${ALL_SELECT_PADDING_HORIZONTAL}px;
  text-transform: lowercase;
  color: #f2ddcb;
  text-align: right;
  opacity: 1;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.5;
  }

  @media (max-width: 2560px) {
    height: ${ALL_SELECT_HEIGHT * MID_SCALE}px;
    font-size: ${ALL_SELECT_FONT_SIZE * MID_SCALE}px;
    padding: 0px ${ALL_SELECT_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${ALL_SELECT_HEIGHT * HD_SCALE}px;
    font-size: ${ALL_SELECT_FONT_SIZE * HD_SCALE}px;
    padding: 0px ${ALL_SELECT_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region Content constants
const CONTENT_FONT_SIZE = 28;
const CONTENT_LETTER_SPACING = 1;
// #endregion
const Content = styled.div`
  font-size: ${CONTENT_FONT_SIZE}px;
  letter-spacing: ${CONTENT_LETTER_SPACING}px;
  width: ${CONTENT_WRAPPER_WIDTH - CONTENT_WRAPPER_PADDING_RIGHT}px;
  max-height: ${CONTENT_WRAPPER_MAX_HEIGHT - ALL_SELECT_HEIGHT}px;
  font-family: TitilliumWeb;
  color: #f2ddcb;
  text-transform: initial;
  overflow: auto;

  &::-webkit-scrollbar {
    width: ${CONTENT_WRAPPER_SCROLL_BAR_WIDTH}px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1F120E;
  }

  @media (max-width: 2560px) {
    font-size: ${CONTENT_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${CONTENT_LETTER_SPACING * MID_SCALE}px;
    width: ${(CONTENT_WRAPPER_WIDTH * MID_SCALE) - (CONTENT_WRAPPER_PADDING_RIGHT * MID_SCALE)}px;
    max-height: ${(CONTENT_WRAPPER_MAX_HEIGHT - ALL_SELECT_HEIGHT) * MID_SCALE}px;
    &::-webkit-scrollbar {
      width: ${CONTENT_WRAPPER_SCROLL_BAR_WIDTH * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    font-size: ${CONTENT_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${CONTENT_LETTER_SPACING * HD_SCALE}px;
    width: ${(CONTENT_WRAPPER_WIDTH * HD_SCALE) - (CONTENT_WRAPPER_PADDING_RIGHT * HD_SCALE)}px;
    max-height: ${(CONTENT_WRAPPER_MAX_HEIGHT - ALL_SELECT_HEIGHT) * HD_SCALE}px;
    &::-webkit-scrollbar {
      width: ${CONTENT_WRAPPER_SCROLL_BAR_WIDTH * HD_SCALE}px;
    }
  }
`;

// #region Selected constants
const SELECTED_FONT_SIZE = 28;
const SELECTED_LETTER_SPACING = 1;
const SELECTED_PADDING = 20;
// #endregion
const Selected = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${SELECTED_FONT_SIZE}px;
  letter-spacing: ${SELECTED_LETTER_SPACING}px;
  padding: ${SELECTED_PADDING}px;
  width: ${CONTENT_WRAPPER_WIDTH - SELECTED_PADDING - CONTENT_WRAPPER_PADDING_RIGHT}px;
  cursor: pointer;
  font-family: TitilliumWeb;
  color: #f2ddcb;
  text-transform: initial;
  background-image: url(../images/abilitybook/uhd/dropdown-bg.png);
  background-size: 100% 100%;
  text-decoration: none;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &.open {
    filter: brightness(120%);
  }

  &:hover {
    filter: brightness(120%);
  }

  &:active {
    filter: brightness(80%);
  }

  @media (max-width: 2560px) {
    font-size: ${SELECTED_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${SELECTED_LETTER_SPACING * MID_SCALE}px;
    padding: ${SELECTED_PADDING * MID_SCALE}px;
    width: ${(CONTENT_WRAPPER_WIDTH - SELECTED_PADDING - CONTENT_WRAPPER_PADDING_RIGHT) * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${SELECTED_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${SELECTED_LETTER_SPACING * HD_SCALE}px;
    padding: ${SELECTED_PADDING * HD_SCALE}px;
    width: ${(CONTENT_WRAPPER_WIDTH - SELECTED_PADDING - CONTENT_WRAPPER_PADDING_RIGHT) * HD_SCALE}px;
    background-image: url(../images/abilitybook/hd/dropdown-bg.png);
  }
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// #region Item constants
const SECTION_TITLE_FONT_SIZE = 20;
const SECTION_TITLE_HORIZONTAL_PADDING = 10;
// #endregion
const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${SECTION_TITLE_HORIZONTAL_PADDING}px;
  font-size: ${SECTION_TITLE_FONT_SIZE}px;
  cursor: pointer;
  font-family: TitilliumWeb;
  background-color: #44261e;
  color: #f2ddcb;

  &:hover {
    filter: brightness(120%);
  }

  &:active {
    filter: brightness(80%);
  }

  @media (max-width: 2560px) {
    padding: ${SECTION_TITLE_HORIZONTAL_PADDING * MID_SCALE}px;
    font-size: ${SECTION_TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${SECTION_TITLE_HORIZONTAL_PADDING * HD_SCALE}px;
    font-size: ${SECTION_TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region ItemIcon constants
const ITEM_ICON_DIMENSIONS = 40;
const ITEM_ICON_MARGIN_RIGHT = 5;
// #endregion
const ItemIcon = styled.img`
  width: ${ITEM_ICON_DIMENSIONS}px;
  height: ${ITEM_ICON_DIMENSIONS}px;
  margin-right: ${ITEM_ICON_MARGIN_RIGHT}px;
  border-radius: 50%;

  @media (max-width: 2560px) {
    width: ${ITEM_ICON_DIMENSIONS * MID_SCALE}px;
    height: ${ITEM_ICON_DIMENSIONS * MID_SCALE}px;
    margin-right: ${ITEM_ICON_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ITEM_ICON_DIMENSIONS * HD_SCALE}px;
    height: ${ITEM_ICON_DIMENSIONS * HD_SCALE}px;
    margin-right: ${ITEM_ICON_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

// #region Item constants
const ITEM_FONT_SIZE = 24;
const ITEM_LETTER_SPACING = 1;
const ITEM_PADDING = 10;
// #endregion
const Item = styled.div`
  display: flex;
  align-items: center;
  font-size: ${ITEM_FONT_SIZE}px;
  letter-spacing: ${ITEM_LETTER_SPACING}px;
  padding: ${ITEM_PADDING}px;
  width: calc(100% - ${ITEM_PADDING * 2}px);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: TitilliumWeb;
  cursor: pointer;
  text-decoration: none;
  color: #f2ddcb;

  &:hover {
    filter: brightness(120%);
  }

  &:active {
    filter: brightness(80%);
  }

  @media (max-width: 2560px) {
    font-size: ${ITEM_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${ITEM_LETTER_SPACING * MID_SCALE}px;
    padding: ${ITEM_PADDING * MID_SCALE}px;
    width: calc(100% - ${(ITEM_PADDING * 2) * MID_SCALE}px);
  }

  @media (max-width: 1920px) {
    font-size: ${ITEM_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${ITEM_LETTER_SPACING * HD_SCALE}px;
    padding: ${ITEM_PADDING * HD_SCALE}px;
    width: calc(100% - ${(ITEM_PADDING * 2) * HD_SCALE}px);
  }
`;

const ItemInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

// #region ItemDivider constants
const ITEM_DIVIDER_HEIGHT = 6;
// #endregion
const ItemDivider = styled.div`
  width: 100%;
  height: ${ITEM_DIVIDER_HEIGHT}px;
  background-image: url(../images/abilitybook/uhd/dropdown-line.png);
  background-size: 100% 100%;

  @media (max-width: 2560px) {
    height: ${ITEM_DIVIDER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybook/hd/dropdown-line.png);
    height: ${ITEM_DIVIDER_HEIGHT * HD_SCALE}px;
  }
`;

// const Checkbox = styled.input`
//   -webkit-appearance: checkbox !important;
// `;

export interface Section {
  title: string;
  selected: boolean;
  items: AbilityComponent.Fragment[];
}

export interface Props {
  placeholder: string;
  selected: (string | number)[];
  sections: Section[];
  onSelectItem: (item: (string | number) | (string | number)[]) => void;
  onDeselectAll: () => void;

  formatItemText?: (item: string | number) => JSX.Element | string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  containerClass?: string;
  itemClass?: string;
}

export interface State {
  shouldShow: boolean;
}

export class FilterDropdown extends React.Component<Props, State> {
  private mouseOver: boolean = false;
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldShow: false,
    };
  }

  public render() {
    const { placeholder, selected, sections } = this.props;
    const deselectAllShown = selected.length > 0;
    return (
      <Container className={this.props.containerClass} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
        <Selected className={this.state.shouldShow ? 'open' : ''} onClick={this.onToggleDropdown}>
          <div>
          {isArray(selected) ?
            isEmpty(selected) ? placeholder : selected.toString().replace(',', ', ') :
            selected || placeholder}
          </div>
          <div className={this.state.shouldShow ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}></div>
        </Selected>
        <ContentWrapper shouldShow={this.state.shouldShow}>
          <AllSelect onClick={deselectAllShown ? this.props.onDeselectAll : this.onSelectAllClick}>
            {deselectAllShown ? 'Deselect All' : 'Select All'}
          </AllSelect>
          <Content>
            {sections.map(this.renderSection)}
          </Content>
        </ContentWrapper>
      </Container>
    );
  }

  private renderSection = (section: Section) => {
    const isSectionSelected = this.isSectionSelected(section);
    return (
      <div>
        <SectionTitle onClick={() => this.onSectionClick(section)}>
          {section.title}
          <Checkbox checked={isSectionSelected} />
        </SectionTitle>
        <div>
          {section.items.map(this.renderItem)}
        </div>
      </div>
    );
  }

  private renderItem = (item: AbilityComponent.Fragment, i: number) => {
    const { selected, itemClass, onSelectItem, formatItemText } = this.props;
    const name = item.display.name;
    const isSelected = isArray(selected) ? selected.includes(name) : selected === name;
    if (formatItemText) {
      return (
        <ItemContainer key={i}>
          <Item
            className={`${itemClass ? itemClass : ''} ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectItem(name)}>
            <ItemInfoContainer>
              <ItemIcon src={item.display.iconURL} />
              {formatItemText(name)}
            </ItemInfoContainer>
            {isArray(selected) ? <Checkbox checked={isSelected} /> : null}
          </Item>
          <ItemDivider />
        </ItemContainer>
      );
    }

    return (
      <ItemContainer key={i}>
        <Item
          className={`${itemClass ? itemClass : ''} ${isSelected ? ' selected' : ''}`}
          onClick={() => onSelectItem(name)}>
          <ItemInfoContainer>
            <ItemIcon src={item.display.iconURL} />
            {name}
          </ItemInfoContainer>
          {isArray(selected) ? <Checkbox checked={isSelected} /> : null}
        </Item>
        <ItemDivider />
      </ItemContainer>
    );
  }

  private onSelectAllClick = () => {
    let allSections: AbilityComponent.Fragment[] = [];
    this.props.sections.forEach((section) => {
      allSections = allSections.concat(section.items);
    });

    this.props.onSelectItem(allSections.map(i => i.display.name));
  }

  private onSectionClick = (section: Section) => {
    this.props.onSelectItem(section.items.map(i => i.display.name));
  }

  private isSectionSelected = (section: Section) => {
    let includesAllItems = true;
    const selected = this.props.selected;
    section.items.forEach((sectionItem) => {
      if (!selected.includes(sectionItem.display.name)) {
        includesAllItems = false;
      }
    });

    return includesAllItems;
  }

  private onMouseOver = () => {
    this.mouseOver = true;
  }

  private onMouseLeave = () => {
    this.mouseOver = false;
  }

  private onToggleDropdown = () => {
    if (!this.state.shouldShow) {
      // turn on
      this.showDropdown();
      return;
    }

    this.hideDropdown();
  }

  private showDropdown = () => {
    window.addEventListener('mousedown', this.onMouseDownHide);
    this.setState({ shouldShow: true });
  }

  private hideDropdown = () => {
    this.setState({ shouldShow: false });
  }

  private onMouseDownHide = () => {
    if (!this.mouseOver) {
      window.removeEventListener('mousedown', this.onMouseDownHide);
      this.hideDropdown();
    }
  }
}
