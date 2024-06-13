/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from './redux/store';

const RootContainer = 'WarningIcons-Root';

const IconsContainer = 'WarningIcons-IconContainer';

const Icon = 'WarningIcons-Icon';

interface State {}

interface ReactProps {}

interface InjectedProps {
  icons: string[];
}

type Props = ReactProps & InjectedProps;

class AWarningIcons extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    if (!this.props.icons?.length) {
      return null;
    }

    return (
      <div id='WarningIcons_HUD' className={RootContainer}>
        {this.renderWarningIcons()}
      </div>
    );
  }

  public renderWarningIcons(): JSX.Element {
    const icons: JSX.Element[] = [];

    const addIcon = (imageCls: string) =>
      icons.push(
        <div className={`${Icon}`} style={{ backgroundImage: `url(../images/warning-icons/${imageCls}.png)` }} />
      );

    this.props.icons.forEach(addIcon);

    return <div className={IconsContainer}>{icons}</div>;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  return {
    ...ownProps,
    icons: state.warningIcons.icons
  };
}

export const WarningIcons = connect(mapStateToProps)(AWarningIcons);
