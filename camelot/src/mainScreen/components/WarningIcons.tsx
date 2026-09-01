/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { PerformanceWarningEntryDef } from '../dataSources/manifest/performanceWarningManifest';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

const Root = 'HUD-WarningIcons-Root';
const Warning = 'HUD-WarningIcons-Warning';
const WarningName = 'HUD-WarningIcons-WarningName';
const WarningIcon = 'HUD-WarningIcons-WarningIcon';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  performanceWarnings: Dictionary<PerformanceWarningEntryDef>;
  activePerformanceWarningIDs: string[];
  stringTable: Record<string, StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AWarningIcons extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Root}>
        {this.props.activePerformanceWarningIDs.map((performanceWarningID) => {
          const performanceWarning = this.props.performanceWarnings[performanceWarningID];
          return (
            <div className={Warning} key={performanceWarning.id}>
              <div className={WarningName} key={performanceWarning.id}>
                {performanceWarning.name}
              </div>
              <div className={WarningIcon} style={{ backgroundImage: `url(${performanceWarning.iconImage})` }} />
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    performanceWarnings: state.performanceWarnings.performanceWarnings,
    activePerformanceWarningIDs: state.performanceWarnings.activePerformanceWarningIDs,
    stringTable: state.stringTable.stringTable
  };
};

const WarningIcons = connect(mapStateToProps)(AWarningIcons);

export const WIDGET_ID_WARNING_ICONS = 'Warning Icons';
export const warningIconsRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_WARNING_ICONS,
  nameStringID: 'HUDEditorWidgetNameWarningIcons',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Bottom,
    xOffset: 2,
    yOffset: 5
  },
  layer: HUDLayer.HUD,
  requiresGameDefsLoaded: true,
  render: (isDragCopy: boolean) => {
    return <WarningIcons isDragCopy={isDragCopy} />;
  }
};
