
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CSS from 'lib/css-helper';

const SettingsPanelContainer = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.EXPAND_TO_FIT}
  padding: 10px;
`;

interface SettingsPanelProps {
  style?: any;
}

interface SettingsPanelState {
}

export class SettingsPanel extends React.PureComponent<SettingsPanelProps, SettingsPanelState> {
  constructor(props: SettingsPanelProps) {
    super(props);
    this.state = {};
  }
  public render() {
    return (
      <SettingsPanelContainer
        data-id='settings-panel-container'
        style={this.props.style}>
        {this.props.children}
      </SettingsPanelContainer>
    );
  }
}

export default SettingsPanel;
