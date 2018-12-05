/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import * as React from 'react';
import styled from 'react-emotion';
import { TabbedDialog, DialogButton } from 'components/UI/TabbedDialog';
import { Blocks } from './Blocks';
import { Blueprints } from './Blueprints';
import { Items } from './Items';
import { Help } from './Help';
import { BlueprintNameDialog } from './BlueprintNameDialog';

const OuterWrapper = styled('div')`
  height: 100%;
  width: 100%;
`;

const Container = styled('div')`
  pointer-events: all;
  height: 100%;
  width: 100%;
`;

const OpenButton = styled('div')`
  pointer-events: all;
  cursor: pointer;
  padding: 10px 5px;
  color: #ececec;
  position: fixed;
  background: #777;
  bottom: 10px;
  right: 10px;
  &:hover {
    background: #aaa;
  }
`;

const blocksTab: DialogButton = { label: 'Blocks' };
const bpTab: DialogButton = { label: 'Blueprints' };
const itemsTab: DialogButton = { label: 'Items' };
const helpTab: DialogButton = { label: 'Help' };

const tabs: DialogButton[] = [
  blocksTab,
  bpTab,
  itemsTab,
  helpTab,
];

export interface BuildProps {
}

export interface BuildState {
  visible: boolean;
  open: boolean;
}

export class Build extends React.PureComponent<BuildProps, BuildState> {
  private openToggleHandle: EventHandle = null;
  private buildingModeHandle: EventHandle = null;
  constructor(props: BuildProps) {
    super(props);
    this.state = {
      visible: game.building.mode !== BuildingMode.NotBuilding,
      open: true,
    };
  }

  public render() {
    return this.state.visible ? (
      <OuterWrapper>
        {this.state.open ? (
        <Container data-input-group='block'>
          <TabbedDialog
            name='build'
            title='Build'
            tabs={tabs}
            onClose={this.onClose}
          >
            {this.renderTab}
          </TabbedDialog>
        </Container>
      ) : (
        <OpenButton data-id='block-selector-btn' data-input-group='block' onClick={this.toggleVisibility}>
          Open Building Selector
        </OpenButton>
      )}
      <BlueprintNameDialog />
      </OuterWrapper>
    ) : null;
  }

  public componentDidMount() {
    this.openToggleHandle = game.onToggleBuildSelector(this.toggleVisibility);
    this.buildingModeHandle = game.onBuildingModeChanged(this.handleBuildingModeChanged);
  }

  public componentWillUnmount() {
    if (this.openToggleHandle) {
      this.openToggleHandle.clear();
      this.openToggleHandle = null;
    }
    if (this.buildingModeHandle) {
      this.buildingModeHandle.clear();
      this.buildingModeHandle = null;
    }
  }

  private renderTab = (tab: DialogButton) => {
    switch (tab) {
      case blocksTab: return <Blocks />;
      case bpTab: return <Blueprints />;
      case itemsTab: return <Items />;
      case helpTab: return <Help />;
    }
  }

  private toggleVisibility = () => {
    this.setState(state => ({ open: !state.open }));
  }

  private onClose = () => {
    game.trigger(game.engineEvents.EE_OnToggleBuildSelector);
  }

  private handleBuildingModeChanged = () => {
    if (game.building.mode === BuildingMode.NotBuilding) {
      this.setState({
        visible: false,
        open: true,
      });
    } else if (!this.state.visible) {
      this.setState({
        visible: true,
      });
    }
  }
}
