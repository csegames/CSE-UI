/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as FilterButtonAPI from './FilterButtonAPI';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

import InventoryFilterButton from './InventoryFilterButton';
import FilterInput from './FilterInput';
import FilterSelectMenu from './FilterSelectMenu';
import { InventoryFilterButton as FilterButtonDefinition } from 'fullscreen/lib/itemInterfaces';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_PADDING = 20;
const CONTAINER_PADDING_BOTTOM = 10;
// #endregion
const Container = styled.div`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  padding: ${CONTAINER_PADDING}px;
  padding-bottom: ${CONTAINER_PADDING_BOTTOM}px;
  background: url(../images/inventory/bag-bg.png);
  background-size: cover;
  z-index: 2;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  @media (max-width: 2560px) {
    padding: ${CONTAINER_PADDING * MID_SCALE}px;
    padding-bottom: ${CONTAINER_PADDING_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${CONTAINER_PADDING * HD_SCALE}px;
    padding-bottom: ${CONTAINER_PADDING_BOTTOM * HD_SCALE}px;
  }
`;

const InputAndFilterMenuContainer = styled.div`
  display: flex;
  align-items: center;
`;

// #region FilterButtons constants
const FILTER_BUTTON_FONT_SIZE = 32;
// #endregion
const FilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: ${FILTER_BUTTON_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${FILTER_BUTTON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${FILTER_BUTTON_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region InputClass constants
const INPUT_CLASS_MARGIN_RIGHT = 20;
// #endregion
const InputClass = css`
  margin-right: ${INPUT_CLASS_MARGIN_RIGHT}px;

  @media (max-width: 2560px) {
    margin-right: ${INPUT_CLASS_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${INPUT_CLASS_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

export interface InventoryHeaderProps {
  // Text that is currently shown in the filter / search input box
  filterText: string;

  // Called when the user enters any text into the filter input box
  onFilterChanged: (text: string) => void;

  // Called when the user clicks on a filter button to activate it
  onFilterButtonActivated: (filter: FilterButtonDefinition) => void;

  // Called when the user clicks on a filter button to deactivate it
  onFilterButtonDeactivated: (filter: FilterButtonDefinition) => void;
}

export interface InventoryHeaderState extends FilterButtonAPI.FilterButtonState {
}

export class InventoryHeader extends React.Component<InventoryHeaderProps, InventoryHeaderState> {
  constructor(props: InventoryHeaderProps) {
    super(props);
    this.state = {
      ...FilterButtonAPI.getInitialFilterButtonState(),
    };
  }
  public render() {
    return (
      <Container>
        <InputAndFilterMenuContainer>
          <FilterInput
            className={InputClass}
            filterText={this.props.filterText}
            onFilterChanged={this.props.onFilterChanged}
          />
          <FilterSelectMenu
            selectedFilterButtons={this.state.filterButtons}
            onFilterButtonAdded={this.onFilterButtonAdded}
            onFilterButtonRemoved={this.onFilterButtonRemoved}
          />
        </InputAndFilterMenuContainer>
        <FilterButtons>
          {this.state.filterButtons.map((filter: FilterButtonDefinition, index: number) => (
            <InventoryFilterButton
              key={index}
              filterButton={filter}
              onActivated={this.props.onFilterButtonActivated}
              onDeactivated={this.props.onFilterButtonDeactivated}
            />
          ))}
        </FilterButtons>
      </Container>
    );
  }

  public componentDidMount() {
    this.setState(FilterButtonAPI.initializeFilterButtons);
  }

  private onFilterButtonAdded = (filterButton: FilterButtonDefinition) => {
    this.setState(state => FilterButtonAPI.addFilterButton(filterButton, state));
  }

  private onFilterButtonRemoved = (filterButton: FilterButtonDefinition) => {
    this.setState(state => FilterButtonAPI.removeFilterButton(filterButton, state));
  }
}

export default InventoryHeader;
