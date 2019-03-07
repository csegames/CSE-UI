/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { TabbedDialog, DialogButton } from 'shared/TabbedDialog';
import { Blocks } from './Blocks';
import { Blueprints } from './Blueprints';
import { Items } from './Items';
import { Help } from './Help';
import { BlueprintNameDialog } from './BlueprintNameDialog';
import { ReplaceDialog } from './ReplaceDialog';
import { SearchInput } from './SearchInput';

const OuterWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const Container = styled.div`
  pointer-events: all;
  height: 100%;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  background-image: url(../images/settings/bag-bg-grey.png);
  background-repeat: no-repeat;
  background-position: top center;
  margin-top: -10px;
`;

const OpenButton = styled.div`
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
  searchValue: string;
  visible: boolean;
  open: boolean;
}

export class Build extends React.PureComponent<BuildProps, BuildState> {
  private openToggleHandle: EventHandle = null;
  private buildingModeHandle: EventHandle = null;
  constructor(props: BuildProps) {
    super(props);
    this.state = {
      searchValue: '',
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
            {tab => (
              <Content className={'cse-ui-scroller-thumbonly'}>
                {tab !== helpTab && <SearchInput value={this.state.searchValue} onChange={this.onSearchChange} />}
                {this.renderTab(tab)}
              </Content>
            )}
          </TabbedDialog>
        </Container>
      ) : (
        <OpenButton data-id='block-selector-btn' data-input-group='block' onClick={this.toggleVisibility}>
          Open Building Selector
        </OpenButton>
      )}
      <BlueprintNameDialog />
      <ReplaceDialog />
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
      case blocksTab: return <Blocks searchValue={this.state.searchValue} />;
      case bpTab: return <Blueprints searchValue={this.state.searchValue} />;
      case itemsTab: return <Items searchValue={this.state.searchValue} />;
      case helpTab: return <Help />;
    }
  }

  private toggleVisibility = () => {
    this.setState(state => ({ open: !state.open }));
  }

  private onClose = () => {
    game.trigger(game.engineEvents.EE_OnToggleBuildSelector);
  }

  private onSearchChange = (val: string) => {
    this.setState({ searchValue: val });
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
