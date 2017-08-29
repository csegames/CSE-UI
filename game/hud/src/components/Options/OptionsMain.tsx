/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-21 17:07:43
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-25 10:29:34
 */

import * as React from 'react';
import { client, utils, events, TabPanel, TabItem, ContentItem } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import ActionButtons from './components/ActionButtons';
import KeyBindings from './components/KeyBindOptions/KeyBindings';
import InputOptions from './components/InputOptions';
import AudioOptions from './components/AudioOptions';
import RenderingOptions from './components/RenderingOptions';

export interface OptionsStyle extends StyleDeclaration {
  Options: React.CSSProperties;
  optionsHeader: React.CSSProperties;
  tabPanelContainer: React.CSSProperties;
  tabs: React.CSSProperties;
  tab: React.CSSProperties;
  activeTab: React.CSSProperties;
  tabPanelContentContainer: React.CSSProperties;
  tabPanelContent: React.CSSProperties;
  tabText: React.CSSProperties;
  contentPadding: React.CSSProperties;
  contentOverflowContainer: React.CSSProperties;
  close: React.CSSProperties;
  loadSaveText:  React.CSSProperties;
}

export const OptionDimensions = {
  width: 650,
  height: 400,
};

export const defaultOptionsStyle: OptionsStyle = {
  Options: {
    pointerEvents: 'all',
    width: `${OptionDimensions.width}px`,
    height: `${OptionDimensions.height}px`,
    backgroundColor: 'rgba(10,10,10,0.8)',
    color: 'white',
    border: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  optionsHeader: {
    position: 'relative',
    width: '100%',
    padding: '5px 0',
    textAlign: 'center',
    backgroundColor: '#202020',
    borderBottom: `1px solid ${utils.lightenColor('#202020', 30)}`,
    color: 'white',
  },

  tabPanelContainer: {
    height: 'calc(100% - 75px)',
    flexDirection: 'row',
  },

  tabs: {
    display: 'flex',
    flexDirection: 'column',
    width: '220px',
    padding: '10px 10px 0 10px',
    borderRight: '1px solid #454545',
  },

  tab: {
    fontSize: '18px',
    padding: '2px 5px',
    color: 'white',
    backgroundColor: '#454545',
    textAlign: 'center',
    borderBottom: '1px solid black',
    ':hover': {
      backgroundColor: utils.lightenColor('#454545', 10),
    },
    ':active': {
      boxShadow: 'inset 0 0 5px rgba(0,0,0,0.9)',
      backgroundColor: utils.lightenColor('#454545', 10),
    },
  },

  activeTab: {
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.7)',
    backgroundColor: utils.lightenColor('#454545', 30),
    ':hover': {
      backgroundColor: utils.lightenColor('#454545', 30),
    },
    ':active': {
      boxShadow: 'inset 0 0 5px rgba(0,0,0,0.7)',
      backgroundColor: utils.lightenColor('#454545', 30),
    },
  },

  tabPanelContentContainer: {
    height: 'auto',
    overflow: 'visible',
  },

  tabPanelContent: {
    
  },
  
  tabText: {
    cursor: 'pointer',
  },

  contentOverflowContainer: {
    height: '100%',
    overflow: 'auto',
  },

  contentPadding: {
    padding: '10px',
    height: '100%',
  },

  close: {
    position: 'absolute',
    top: 2,
    right: 5,
    color: '#cdcdcd',
    fontSize: '20px',
    marginRight: '5px',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      color: '#bbb',
    },
  },

  loadSaveText: {
    position: 'absolute',
    left: 10,
    bottom: 45,
    color: 'white',
  },
};

export interface OptionsProps {
  styles?: Partial<OptionsStyle>;
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
  private ss: OptionsStyle;
  private custom: Partial<OptionsStyle>;

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
    const ss = this.ss = StyleSheet.create(defaultOptionsStyle);
    const custom = this.custom = StyleSheet.create(this.props.styles || {});
    
    const tabs: TabItem[] = [
      {
        name: 'KEYBIND',
        tab: {
          render: () => <span className={css(ss.tabText, custom.tabText)}>KEY BINDINGS</span>,
        },
        rendersContent: 'KeyBindings',
      },
      {
        name: 'INPUT',
        tab: {
          render: () => <span className={css(ss.tabText, custom.tabText)}>INPUT</span>,
        },
        rendersContent: 'Input',
      },
      {
        name: 'AUDIO',
        tab: {
          render: () => <span className={css(ss.tabText, custom.tabText)}>AUDIO</span>,
        },
        rendersContent: 'Audio',
      },
      {
        name: 'RENDERING',
        tab: {
          render: () => <span className={css(ss.tabText, custom.tabText)}>GRAPHICS</span>,
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
      <div className={css(ss.Options, custom.Options)}>
        <div className={css(ss.optionsHeader, custom.optionsHeader)}>
          OPTIONS
          <div className={css(ss.close, custom.close)} onClick={this.close}>
            <i className='fa fa-times click-effect'></i>
          </div>
        </div>
        <TabPanel
          tabs={tabs}
          content={content}
          onActiveTabChanged={this.onActiveTabChanged}
          styles={{
            tabPanel: defaultOptionsStyle.tabPanelContainer,
            tabs: defaultOptionsStyle.tabs,
            tab: defaultOptionsStyle.tab,
            activeTab: defaultOptionsStyle.activeTab,
            contentContainer: defaultOptionsStyle.tabPanelContentContainer,
            content: defaultOptionsStyle.tabPanelContent,
          }}
        />
        <span className={css(ss.loadSaveText, custom.loadSaveText)}>{this.state.loadSaveText}</span>
        <ActionButtons
          onSaveDiskClick={this.onSaveDiskClick}
          onLoadDiskClick={this.onLoadDiskClick}
          keyBindings={this.state.keyBindConfigs}
          activeConfigIndex={this.state.activeConfigIndex}
        />
      </div>
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
        onKeyBindingsChange={(keyBindConfigs) => this.setState({ keyBindConfigs })}
        activeConfigIndex={this.state.activeConfigIndex}
      />
    );
  }

  private renderInput = () => {
    return (
      <InputOptions
        inputConfigs={this.state.inputConfigs}
        onInputConfigsChange={(inputConfigs) => this.setState({ inputConfigs })}
        activeConfigIndex={this.state.activeConfigIndex}
      />
    );
  }

  private renderAudio = () => {
    return (
      <AudioOptions
        audioConfigs={this.state.audioConfigs}
        onAudioConfigsChange={(audioConfigs) => this.setState({ audioConfigs })}
        activeConfigIndex={this.state.activeConfigIndex}
      />
    );
  }

  private renderGraphics = () => {
    return (
      <div className={css(this.ss.contentOverflowContainer, this.custom.contentOverflowContainer)}>
        <RenderingOptions
          renderingConfigs={this.state.renderConfigs}
          onRenderConfigsChange={(renderConfigs) => this.setState({ renderConfigs })}
          activeConfigIndex={this.state.activeConfigIndex}
        />
      </div>
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

