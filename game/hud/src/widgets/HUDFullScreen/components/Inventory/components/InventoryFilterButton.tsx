/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Tooltip } from '@csegames/camelot-unchained';

import { InventoryFilterButton as FilterButtonDefinition } from '../../../lib/constants';
import { prettifyText } from '../../../lib/utils';

const Container = styled('div')`
  margin-right: 5px;
  margin-bottom: 5px;
`;

const FilterIcon = styled('div')`
  cursor: pointer;
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: ${(props: any) => props.active ? '#998675' : '#43382E'};
  &:hover {
    -webkit-filter: brightness(120%);
  }
`;

export interface InventoryFilterButtonProps {
  // The filter button defintiion object
  filterButton: FilterButtonDefinition;

  // Should this button be rendered as activated by default?
  defaultActivated?: boolean;

  // Called when this button is clicked while not activated
  onActivated?: (filter: FilterButtonDefinition) => void;

  // Called when this button is clicked while activated
  onDeactivated?: (filter: FilterButtonDefinition) => void;
}

export interface InventoryFilterButtonState {
  activated: boolean;
}

export class InventoryFilterButton extends React.Component<InventoryFilterButtonProps, InventoryFilterButtonState> {

  private didMount: boolean;

  public get isActivated() {
    return this.state.activated;
  }

  public set isActivated(value: boolean) {
    if (!this.didMount) return;

    if (value && this.props.onActivated) {
      this.props.onActivated(this.props.filterButton);
    }

    if (value === false && this.props.onDeactivated) {
      this.props.onDeactivated(this.props.filterButton);
    }

    this.setState({ activated: value });
  }

  constructor(props: InventoryFilterButtonProps) {
    super(props);
    this.state = {
      activated: props.defaultActivated || false,
    };
  }

  public render() {
    return (
      <Tooltip content={() => <div>{prettifyText(this.props.filterButton.name)}</div>}>
        <Container>
          <div style={this.props.filterButton.style || {}}>
            <FilterIcon
              active={this.state.activated}
              onClick={this.onClicked}
              className={this.props.filterButton.icon}
            />
          </div>
        </Container>
      </Tooltip>
    );
  }

  public componentDidMount() {
    this.didMount = true;
  }

  public shouldComponentUpdate(nextProps: InventoryFilterButtonProps, nextState: InventoryFilterButtonState) {
    return nextProps.filterButton !== this.props.filterButton ||
    nextState.activated !== this.state.activated;
  }

  public componentWillUnmount() {
    this.didMount = false;
  }

  private onClicked = () => {
    if (this.state.activated && this.props.onDeactivated) {
      this.props.onDeactivated(this.props.filterButton);
    }

    if (this.state.activated === false && this.props.onActivated) {
      this.props.onActivated(this.props.filterButton);
    }

    this.setState({ activated: !this.state.activated });
  }
}

export default InventoryFilterButton;
