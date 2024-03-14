/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  HUDHorizontalAnchor,
  HUDLayer,
  HUDVerticalAnchor,
  HUDWidgetRegistration,
  addMenuWidgetExiting,
  toggleMenuWidget
} from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { Button } from './Button';
import { WIDGET_NAME_BUILD } from './Build';

const Root = 'HUD-OpenBuild-Root';

interface ReactProps {}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AOpenBuild extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Root}>
        <Button onClick={this.openBuild.bind(this)}>Open Building Selector</Button>
      </div>
    );
  }

  openBuild(): void {
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_OPEN_BUILD));
    this.props.dispatch(
      toggleMenuWidget({
        widgetId: WIDGET_NAME_BUILD,
        escapableId: WIDGET_NAME_BUILD
      })
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

const OpenBuild = connect(mapStateToProps)(AOpenBuild);

export const WIDGET_NAME_OPEN_BUILD = 'Open Build';
export const openBuildRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_OPEN_BUILD,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Bottom,
    xOffset: 1,
    yOffset: 1
  },
  layer: HUDLayer.Menus,
  render: () => {
    return <OpenBuild />;
  }
};
