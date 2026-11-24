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
import { findClassProgressionTrack, isArchetypeTrack } from '../../helpers/abilityBookHelpers';
import { StringIDGeneralLevelShort } from '../../helpers/stringTableHelpers';
import { ProgressionLevelBar } from './ProgressionLevelBar';

// String IDs
const StringIDHUDEditorWidgetNameClassProgressionBar = 'HUDEditorWidgetNameClassProgressionBar';
const StringIDClassProgressionBarTooltip = 'ClassProgressionBarTooltip';

const INFO_POSITION_DEFAULT = ProgressionInfoPosition.Top;

interface Props {
  classDef: ClassDef;
  progressionTracks: Record<string, ProgressionTrackDef>;
  isInfoAlwaysShown: boolean;
  infoPosition: ProgressionInfoPosition;
}

class AClassProgressionBar extends React.Component<Props> {
  render(): React.ReactNode {
    if (!this.props.classDef) {
      return null;
    }

    const track = findClassProgressionTrack(this.props.classDef, this.props.progressionTracks, isArchetypeTrack);
    if (!track) {
      return null;
    }

    return (
      <ProgressionLevelBar
        trackDef={track}
        levelStringID={StringIDGeneralLevelShort}
        nameKey={this.props.classDef.name}
        infoTooltipStringID={StringIDClassProgressionBarTooltip}
        isGreyscale={true}
        isInfoAlwaysShown={this.props.isInfoAlwaysShown}
        infoPosition={this.props.infoPosition}
      />
    );
  }
}

function mapStateToProps(state: RootState): Props {
  const widgetState = state.hud.widgets[WIDGET_ID_CLASS_PROGRESSION_BAR]?.state;
  return {
    classDef: state.gameDefs.classesByNumericID[state.entities.self?.classID],
    progressionTracks: state.gameDefs.progressionTracks,
    isInfoAlwaysShown: widgetState?.progressionInfoAlwaysShown ?? false,
    infoPosition: widgetState?.progressionInfoPosition ?? INFO_POSITION_DEFAULT
  };
}

const ClassProgressionBar = connect(mapStateToProps)(AClassProgressionBar);

export const WIDGET_ID_CLASS_PROGRESSION_BAR = 'Class Progression Bar';
export const classProgressionBarRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_CLASS_PROGRESSION_BAR,
  nameStringID: StringIDHUDEditorWidgetNameClassProgressionBar,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Bottom,
    // Just above the Realm Renown Progression Bar's default spot.
    yOffset: 2.42,
    // Needs to appear over the decorations of the AbilityBars.
    layerOffset: 1,
    progressionInfoPosition: INFO_POSITION_DEFAULT
  },
  layer: HUDLayer.HUD,
  requiresGameDefsLoaded: true,
  render: () => {
    return <ClassProgressionBar />;
  }
};
