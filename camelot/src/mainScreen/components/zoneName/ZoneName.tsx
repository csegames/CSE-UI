/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { ZoneInfo } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { getStringTableValue, getTokenizedStringTableValue, StringIDGeneralParenthesis } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { allMapDetails } from '../../helpers/mapHelpers';
import { FactionBorder, BorderType, BorderBackground } from '../FactionBorder';

// CSS classes
const Root = 'HUD-ZoneName-Root';
const NameText = 'HUD-ZoneName-NameText';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  zoneID: string;
  zones: Record<string, ZoneInfo>;
  stringTable: Record<string, StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AZoneName extends React.Component<Props> {
  render(): JSX.Element {
    const zone = this.props.zones[this.props.zoneID];
    const name = zone
      ? getStringTableValue(
          allMapDetails[zone.Name.toLowerCase()]?.nameStringID ?? zone.Name,
          this.props.stringTable
        )
      : getTokenizedStringTableValue(StringIDGeneralParenthesis, this.props.stringTable, {
          CONTENTS: this.props.zoneID
        });

    return (
      <FactionBorder className={Root} type={BorderType.Primary} background={BorderBackground.PatternSmall}>
        <span className={NameText}>{name}</span>
      </FactionBorder>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { stringTable } = state.stringTable;
  return {
    ...ownProps,
    zoneID: state.loading.zoneID,
    zones: state.zones.zones,
    stringTable
  };
};

const ZoneName = connect(mapStateToProps)(AZoneName);

export const WIDGET_ID_ZONENAME = 'Zone Name';
export const zoneNameRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_ZONENAME,
  nameStringID: 'HUDEditorWidgetNameZoneName',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 2.5,
    yOffset: 1,
    visible: true
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <ZoneName isDragCopy={isDragCopy} />;
  }
};
