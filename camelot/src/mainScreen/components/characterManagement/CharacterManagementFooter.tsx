/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ServerMessages } from '../serverMessages/ServerMessages';

// CSS classes
const Root = 'HUD-CharacterManagementFooter-Root';
const Buttons = 'HUD-CharacterManagementFooter-Buttons';
const Center = 'HUD-CharacterManagementFooter-Center';
const ServerMessagesIcon = 'HUD-CharacterManagement-ServerMessages';

interface ReactProps {
  leftButtons?: React.ReactNode[];
  rightButtons?: React.ReactNode[];
  centerContent?: React.ReactNode;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

interface State {}

export class CharacterManagementFooter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    return (
      <div className={Root}>
        <div className={Buttons}>{this.props.leftButtons ?? null}</div>
        {this.props.centerContent ? <div className={Center}>{this.props.centerContent}</div> : null}
        <div className={Buttons}>
          {this.props.rightButtons ?? null}
          <ServerMessages className={ServerMessagesIcon} isDragCopy={false} openTop />
        </div>
      </div>
    );
  }
}
