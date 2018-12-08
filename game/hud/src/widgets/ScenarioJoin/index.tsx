/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { TabbedDialog, DialogTab } from 'UI/TabbedDialog';
import { ScenarioMatch, startPollingScenarioQueue, stopPollingScenarioQueue } from 'services/session/scenarioQueue';
import { Scenario } from './components/Scenario';
import * as CSS from 'lib/css-helper';

export const SCENARIO_FONT = `font-family: 'Caudex', serif;`;

const SCENARIO_JOIN_DIALOG_WIDTH = 850;
const SCENARIO_JOIN_DIALOG_HEIGHT = 410;

const HUDNAV_NAVIGATE = 'navigate';
const ME = 'scenario-join';

interface Size {
  width: number;
  height: number;
}

export const ScenarioJoinDimensions: Size = {
  width: SCENARIO_JOIN_DIALOG_WIDTH,
  height: SCENARIO_JOIN_DIALOG_HEIGHT,
};

const ScenarioJoinWrapper = styled('div')`
  width: 100%;
  height: 100%;
`;

const LoadingScenarios = styled('div')`
  ${CSS.IS_COLUMN}
  ${CSS.DONT_GROW}
  width: 100%;
  min-height: 140px;
  font-size: 30px;
  text-align: center;
  padding-top: 70px;
`;

const ScenariosContainer = styled('div')`
  ${CSS.IS_COLUMN}
  ${CSS.DONT_GROW}
  width: 100%;
  height: auto;
  max-height: 370px;
  padding-bottom: 10px;
  padding-top: 5px;
  box-sizing: border-box !important;
`;

const Scenarios = styled('div')`
  ${CSS.IS_COLUMN}
  ${CSS.DONT_GROW}
  padding: 0 10px 0 10px;
  box-sizing: border-box!important;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  pointer-events: all;
`;

interface ScenarioJoinState {
  visible: boolean;
  updated: number;
}

interface ScenarioJoinProps {
}

export class ScenarioJoin extends React.Component<ScenarioJoinProps, ScenarioJoinState> {
  private evh: EventHandle;
  private scenarioUpdate: EventHandle;
  private scenarios: ScenarioMatch[];

  constructor(props: ScenarioJoinProps) {
    super(props);
    this.state = { visible: false, updated: 0 };
  }

  public componentDidMount() {
    this.evh = game.on(HUDNAV_NAVIGATE, this.onNavigate);
    this.scenarioUpdate = game.on('scenario-queue--update', this.onScenarioUpdate);
    this.scenarios = startPollingScenarioQueue();
  }

  public componentWillUnmount() {
    stopPollingScenarioQueue();
    game.off(this.evh);
    game.off(this.scenarioUpdate);
    this.evh = null;
    this.scenarioUpdate = null;
  }

  public render() {
    const { visible } = this.state;
    return visible ? (
      <ScenarioJoinWrapper data-input-group='block'>
        <TabbedDialog data-input-group='block'
            name='scenarioJoin' title={'Scenarios'} titleIcon='icon-scenario' autoHeight={true}
            onClose={this.onClose}>
          {() => (
            <DialogTab>
              { this.scenarios ? this.renderScenarios() : this.loading() }
            </DialogTab>
          )}
        </TabbedDialog>
      </ScenarioJoinWrapper>
    ) : null;
  }

  private onNavigate = (name: string) => {
    if (name === 'gamemenu' && this.state.visible) {
      this.setState({ visible: false });
    }
    if (name === ME) {
      this.setState({ visible: !this.state.visible });
    }
  }

  private renderScenarios = () => {
    const scenarios = this.scenarios;
    return (
      <ScenariosContainer>
        <Scenarios className='cse-ui-scroller-thumbonly'>
          { scenarios.map((scenario: ScenarioMatch) => <Scenario scenario={scenario}></Scenario>) }
        </Scenarios>
      </ScenariosContainer>
    );
  }

  private loading = () => {
    return <LoadingScenarios>Loading ...</LoadingScenarios>;
  }

  private onClose = () => {
    game.trigger(HUDNAV_NAVIGATE, ME);
  }

  private onScenarioUpdate = (scenarios: ScenarioMatch[]) => {
    this.scenarios = scenarios;
    this.setState(() => ({ updated: Date.now() }));
  }
}

export default ScenarioJoin;
