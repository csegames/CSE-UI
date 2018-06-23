/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, events } from '@csegames/camelot-unchained';

import { TabbedDialog, DialogButton } from './components/TabbedDialog/index';
import { GeneralSettings } from './tabs/General';
import { InterfaceSettings } from './tabs/Interface';
import { AddonSettings } from './tabs/Addon';

const SETTINGS_DIALOG_WIDTH = 1040;
const SETTINGS_DIALOG_HEIGHT = 710;

const HUDNAV_NAVIGATE = 'hudnav--navigate';
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

interface SettingsState {
  visible: boolean;
}

interface SettingsProps {
}

export class Settings extends React.Component<SettingsProps, SettingsState> {
  private evh: any;
  constructor(props: SettingsProps) {
    super(props);
    this.state = { visible: false };
  }
  public componentDidMount() {
    this.evh = events.on(HUDNAV_NAVIGATE, this.onnavigate);
  }
  public componentWillUnmount() {
    events.off(this.evh);
    this.evh = null;
  }
  public render() {
    return this.state.visible ? (
      <TabbedDialog title='Settings' tabs={tabs} onClose={this.onClose}>
        {this.renderTab}
      </TabbedDialog>
    ) : null;
  }

  private onnavigate = (name: string) => {
    if (name === 'gamemenu' && this.state.visible) {
      client.ReleaseInputOwnership();
      this.setState({ visible: false });
    } else if (name === ME) {
      if (this.state.visible) client.ReleaseInputOwnership();
      this.setState({ visible: !this.state.visible });
    }
  }

  private renderTab(tab: DialogButton) {
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
    events.fire(HUDNAV_NAVIGATE, ME);
  }
}

export default Settings;
