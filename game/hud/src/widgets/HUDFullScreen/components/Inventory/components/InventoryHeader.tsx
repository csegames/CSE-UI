/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as FilterButtonAPI from './FilterButtonAPI';

import styled from 'react-emotion';

import InventoryFilterButton from './InventoryFilterButton';
import FilterInput from './FilterInput';
import FilterSelectMenu from './FilterSelectMenu';
import { InventoryFilterButton as FilterButtonDefinition } from '../../../lib/constants';

const Container = styled('div')`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  padding: 10px 10px 5px 10px;
  background: url(images/inventory/bag-bg.png);
  background-size: cover;
  z-index: 1;
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
`;

const InputAndFilterMenuContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const FilterButtons = styled('div')`i
  display: flex;
  flex-wrap: wrap;
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
          <FilterInput filterText={this.props.filterText} onFilterChanged={this.props.onFilterChanged} />
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
