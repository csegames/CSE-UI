/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import {
  HUDHorizontalAnchor,
  HUDVerticalAnchor,
  ProgressionInfoPosition
} from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { ProgressionTrackDef } from '../../dataSources/manifest/progressionTrackManifest';
import { findRealmProgressionTrack } from '../../helpers/abilityBookHelpers';
import { ProgressionLevelBar } from './ProgressionLevelBar';

// String IDs
const StringIDHUDEditorWidgetNameRealmRenownProgressionBar = 'HUDEditorWidgetNameRealmRenownProgressionBar';
const StringIDRealmRenownRankLevel = 'RealmRenownRankLevel';
const StringIDRealmRenownProgressionBarTooltip = 'RealmRenownProgressionBarTooltip';

const INFO_POSITION_DEFAULT = ProgressionInfoPosition.Bottom;

interface Props {
  classDef: ClassDef;
  progressionTracks: Record<string, ProgressionTrackDef>;
  isInfoAlwaysShown: boolean;
  infoPosition: ProgressionInfoPosition;
}

class ARealmRenownProgressionBar extends React.Component<Props> {
  render(): React.ReactNode {
    if (!this.props.classDef) {
      return null;
    }

    const track = findRealmProgressionTrack(this.props.classDef, this.props.progressionTracks);
    if (!track) {
      return null;
    }

    return (
      <ProgressionLevelBar
        trackDef={track}
        levelStringID={StringIDRealmRenownRankLevel}
        infoTooltipStringID={StringIDRealmRenownProgressionBarTooltip}
        isGreyscale={false}
        isInfoAlwaysShown={this.props.isInfoAlwaysShown}
        infoPosition={this.props.infoPosition}
      />
    );
  }
}

function mapStateToProps(state: RootState): Props {
  const widgetState = state.hud.widgets[WIDGET_ID_REALM_RENOWN_PROGRESSION_BAR]?.state;
  return {
    classDef: state.gameDefs.classesByNumericID[state.entities.self?.classID],
    progressionTracks: state.gameDefs.progressionTracks,
    isInfoAlwaysShown: widgetState?.progressionInfoAlwaysShown ?? false,
    infoPosition: widgetState?.progressionInfoPosition ?? INFO_POSITION_DEFAULT
  };
}

const RealmRenownProgressionBar = connect(mapStateToProps)(ARealmRenownProgressionBar);

export const WIDGET_ID_REALM_RENOWN_PROGRESSION_BAR = 'Realm Renown Progression Bar';
export const realmRenownProgressionBarRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_REALM_RENOWN_PROGRESSION_BAR,
  nameStringID: StringIDHUDEditorWidgetNameRealmRenownProgressionBar,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Bottom,
    yOffset: 0.06,
    // Needs to appear over the decorations of the AbilityBars.
    layerOffset: 1,
    progressionInfoPosition: INFO_POSITION_DEFAULT
  },
  layer: HUDLayer.HUD,
  requiresGameDefsLoaded: true,
  render: () => {
    return <RealmRenownProgressionBar />;
  }
};
