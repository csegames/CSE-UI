/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { TabbedDialog, DialogButton } from '../TabbedDialog';
import { GeneralSettings } from './tabs/General';
import { InterfaceSettings } from './tabs/Interface';
import { AddonSettings } from './tabs/Addon';

const SETTINGS_DIALOG_WIDTH = 1040;
const SETTINGS_DIALOG_HEIGHT = 710;

const HUDNAV_NAVIGATE = 'navigate';
const ME = 'settings';

interface Size {
  width: number;
  height: number;
}

export const SettingsDimensions: Size = {
  width: SETTINGS_DIALOG_WIDTH,
  height: SETTINGS_DIALOG_HEIGHT,
};

const TAB_GENERAL: DialogButton = { label: 'General' };
const TAB_INTERFACE: DialogButton = { label: 'Interface' };
const TAB_ADDONS: DialogButton = { label: 'Addons' };

const tabs: DialogButton[] = [
  TAB_GENERAL,
  TAB_INTERFACE,
  TAB_ADDONS,
];


const SettingsWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 80%;
  height: 80%;
  max-width: 1200px;
  max-height: 720px;
  z-index: 9999;
`;

interface SettingsState {
  visible: boolean;
}

interface SettingsProps {
}

export class Settings extends React.Component<SettingsProps, SettingsState> {
  private evh: EventHandle;
  constructor(props: SettingsProps) {
    super(props);
    this.state = { visible: false };
  }
  public componentDidMount() {
    this.evh = game.on(HUDNAV_NAVIGATE, this.onNavigate);
  }
  public componentWillUnmount() {
    game.off(this.evh);
    this.evh = null;
  }
  public render() {
    return this.state.visible ? (
      <SettingsWrapper data-input-group='block'>
        <TabbedDialog data-input-group='block' name='settings' title='Settings' tabs={tabs} onClose={this.onClose}>
          {this.renderTab}
        </TabbedDialog>
      </SettingsWrapper>
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

  private renderTab = (tab: DialogButton) => {
    switch (tab) {
      case TAB_GENERAL:
        return <GeneralSettings onCancel={this.onClose}/>;
      case TAB_INTERFACE:
        return <InterfaceSettings onCancel={this.onClose}/>;
      case TAB_ADDONS:
        return <AddonSettings onCancel={this.onClose}/>;
    }
  }

  private onClose = () => {
    game.trigger(HUDNAV_NAVIGATE, ME);
  }
}
