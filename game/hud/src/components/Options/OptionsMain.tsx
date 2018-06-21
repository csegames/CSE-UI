/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { client, utils, events, TabPanel, TabItem, ContentItem } from '@csegames/camelot-unchained';

import ActionButtons from './components/ActionButtons';
import KeyBindings from './components/KeyBindOptions/KeyBindings';
import InputOptions from './components/InputOptions';
import AudioOptions from './components/AudioOptions';
import RenderingOptions from './components/RenderingOptions';

export const OptionDimensions = {
  width: 650,
  height: 400,
};

interface OptionsTabPanelStyles {
  tabPanelContainer: string;
  tabs: string;
  tab: string;
  activeTab: string;
  tabPanelContentContainer: string;
}

const customTabPanelStyles: OptionsTabPanelStyles = {
  tabPanelContainer: css`
    height: calc(100% - 75px);
    flex-direction: row;
  `,

  tabs: css`
    display: flex;
    flex-direction: column;
    width: 220px;
    padding: 10px 10px 0 10px;
    border-right: 1px solid #454545;
  `,

  tab: css`
    font-size: 18px;
    padding: 2px 5px;
    color: white;
    background-color: #454545;
    text-align: center;
    border-bottom: 1px solid black;
    &:hover {
      background-color: ${utils.lightenColor('#454545', 10)};
    }
    &:active {
      box-shadow: inset 0 0 5px rgba(0,0,0,0.9);
      background-color: ${utils.lightenColor('#454545', 10)};
    },
  `,

  activeTab: css`
    box-shadow: inset 0 0 5px rgba(0,0,0,0.7);
    background-color: ${utils.lightenColor('#454545', 30)};
    &:hover {
      background-color: ${utils.lightenColor('#454545', 30)};
    }
    &:active {
      box-shadow: inset 0 0 5px rgba(0,0,0,0.7);
      background-color: ${utils.lightenColor('#454545', 30)};
    },
  `,

  tabPanelContentContainer: css`
    height: auto;
    overflow: visible;
  `,
};


const Container = styled('div')`
  pointer-events: all;
  width: ${OptionDimensions.width}px;
  height: ${OptionDimensions.height}px;
  background-color: rgba(10, 10, 10, 0.8);
  color: white;
  border: 1px solid ${utils.lightenColor('#202020', 30)};
`;

const Header = styled('div')`
  position: relative;
  width: 100%;
  padding: 5px 0;
  text-align: center;
  background-color: #202020;
  border-bottom: 1px solid ${utils.lightenColor('#202020', 30)};
  color: white;
`;

const ContentOverflowContainer = styled('div')`
  height: 100%;
  overflow: auto;
`;

const Close = styled('div')`
  position: absolute;
  top: 2px;
  right: 5px;
  color: #CDCDCD;
  font-size: 20px;
  margin-right: 5px;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #BBB;
  }
`;

const LoadSaveText = styled('span')`
  position: absolute;
  left: 10px;
  bottom: 45px;
  color: white;
`;

const TabText = styled('div')`
  cursor: pointer;
`;

export interface OptionsProps {
}

export const ConfigIndex = {
  KEYBIND: 2,
  RENDERING: 3,
  INPUT: 6,
  AUDIO: 8,
};

export interface ConfigInfo {
  name: string;
  value: string;
}

export interface OptionsState {
  keyBindConfigs: ConfigInfo[];
  inputConfigs: ConfigInfo[];
  audioConfigs: ConfigInfo[];
  renderConfigs: ConfigInfo[];
  activeConfigIndex: number;
  visible: boolean;
  loadSaveText: string;
}

export class Options extends React.Component<OptionsProps, OptionsState> {
  constructor(props: OptionsProps) {
    super(props);
    this.state = {
      activeConfigIndex: ConfigIndex.KEYBIND,
      keyBindConfigs: [],
      inputConfigs: [],
      audioConfigs: [],
      renderConfigs: [],
      visible: false,
      loadSaveText: '',
    };
  }

  public render() {
    const tabs: TabItem[] = [
      {
        name: 'KEYBIND',
        tab: {
          render: () => <TabText>KEY BINDINGS</TabText>,
        },
        rendersContent: 'KeyBindings',
      },
      {
        name: 'INPUT',
        tab: {
          render: () => <TabText>INPUT</TabText>,
        },
        rendersContent: 'Input',
      },
      {
        name: 'AUDIO',
        tab: {
          render: () => <TabText>AUDIO</TabText>,
        },
        rendersContent: 'Audio',
      },
      {
        name: 'RENDERING',
        tab: {
          render: () => <TabText>GRAPHICS</TabText>,
        },
        rendersContent: 'Graphics',
      },
    ];

    const content: ContentItem[] = [
      {
        name: 'KeyBindings',
        content: { render: this.renderKeyBindings },
      },
      {
        name: 'Input',
        content: { render: this.renderInput },
      },
      {
        name: 'Audio',
        content: { render: this.renderAudio },
      },
      {
        name: 'Graphics',
        content: { render: this.renderGraphics },
      },
    ];

    return this.state.visible ? (
      <Container>
        <Header>
          OPTIONS
          <Close onClick={this.close}><i className='fa fa-times click-effect'></i></Close>
        </Header>
        <TabPanel
          tabs={tabs}
          content={content}
          onActiveTabChanged={this.onActiveTabChanged}
          styles={{
            tabPanel: customTabPanelStyles.tabPanelContainer,
            tabs: customTabPanelStyles.tabs,
            tab: customTabPanelStyles.tab,
            activeTab: customTabPanelStyles.activeTab,
            contentContainer: customTabPanelStyles.tabPanelContentContainer,
          }}
        />
        <LoadSaveText>{this.state.loadSaveText}</LoadSaveText>
        <ActionButtons
          onSaveDiskClick={this.onSaveDiskClick}
          onLoadDiskClick={this.onLoadDiskClick}
          keyBindings={this.state.keyBindConfigs}
          activeConfigIndex={this.state.activeConfigIndex}
        />
      </Container>
    ) : null;
  }

  public componentDidMount() {
    events.on('hudnav--navigate', this.handleVisibility);
    client.OnReceiveConfigVars((configsString) => {
      switch (this.state.activeConfigIndex) {
        case ConfigIndex.AUDIO: {
          this.setState({ audioConfigs: this.initConfigs(configsString) });
          break;
        }
        case ConfigIndex.KEYBIND: {
          this.setState({ keyBindConfigs: this.initConfigs(configsString) });
          break;
        }
        case ConfigIndex.INPUT: {
          this.setState({ inputConfigs: this.initConfigs(configsString) });
          break;
        }
        case ConfigIndex.RENDERING: {
          this.setState({ renderConfigs: this.initConfigs(configsString) });
          break;
        }
      }
    });
  }

  private handleVisibility = (name: string) => {
    if (name === 'gamemenu' && this.state.visible) {
      client.ReleaseInputOwnership();
      this.setState({ visible: false });
    }
    if (name === 'options') {
      if (this.state.visible) {
        client.ReleaseInputOwnership();
      }
      this.setState({ visible: !this.state.visible });
    }
  }

  private close = () => {
    events.fire('hudnav--navigate', 'options');
  }

  private onActiveTabChanged = (tabIndex: number, name: string) => {
    this.setState({ activeConfigIndex: ConfigIndex[name] });
  }

  private renderKeyBindings = () => {
    return (
      <KeyBindings
        keyBindConfigs={this.state.keyBindConfigs}
        onKeyBindingsChange={keyBindConfigs => this.setState({ keyBindConfigs })}
        activeConfigIndex={this.state.activeConfigIndex}
      />
    );
  }

  private renderInput = () => {
    return (
      <InputOptions
        inputConfigs={this.state.inputConfigs}
        onInputConfigsChange={inputConfigs => this.setState({ inputConfigs })}
        activeConfigIndex={this.state.activeConfigIndex}
      />
    );
  }

  private renderAudio = () => {
    return (
      <AudioOptions
        audioConfigs={this.state.audioConfigs}
        onAudioConfigsChange={audioConfigs => this.setState({ audioConfigs })}
        activeConfigIndex={this.state.activeConfigIndex}
      />
    );
  }

  private renderGraphics = () => {
    return (
      <ContentOverflowContainer>
        <RenderingOptions
          renderingConfigs={this.state.renderConfigs}
          onRenderConfigsChange={renderConfigs => this.setState({ renderConfigs })}
          activeConfigIndex={this.state.activeConfigIndex}
        />
      </ContentOverflowContainer>
    );
  }

  private initConfigs = (configsString: string) => {
    const configs = JSON.parse(configsString);
    return Object.keys(configs).map((config) => {
      return { name: config, value: configs[config] };
    });
  }

  private onLoadDiskClick = () => {
    this.setState({ loadSaveText: 'Bindings Loaded From Disk' });
  }

  private onSaveDiskClick = () => {
    this.setState({ loadSaveText: 'Bindings Saved To Disk' });
  }
}

export default Options;

