/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ZoneInfo } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { InitTopic } from '../redux/initializationSlice';

// Styles.
const Root = 'HUD-ZoneName-Root';
const TextContainer = 'HUD-ZoneName-TextContainer';
const Text = 'HUD-ZoneName-Text';
const EndCap = 'HUD-ZoneName-EndCap';

interface ReactProps {}

interface InjectedProps {
  zoneID: string;
  zones: Dictionary<ZoneInfo>;
}

type Props = ReactProps & InjectedProps;

class AZoneName extends React.Component<Props> {
  render(): JSX.Element {
    const zoneNumberID: number = Number('0x' + this.props.zoneID);

    return (
      <div className={Root}>
        <div className={TextContainer}>
          <div className={Text}>ZONE: {this.props.zones[zoneNumberID]?.Name ?? 'Unknown'}</div>
        </div>
        <div className={EndCap} />
      </div>
    );
  }

  // TODO: The old version of this widget refreshed Zone data every time state.player.zoneID changed.
  // TODO: Is that still needed?  Does the zone list never change?  If we change to a GQL subscription,
  //       does that take care of everything?
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { zoneID } = state.player;
  const { zones } = state.zones;
  return {
    ...ownProps,
    zoneID,
    zones
  };
}

const ZoneName = connect(mapStateToProps)(AZoneName);

const WIDGET_NAME = 'Zone Name';
export const zoneNameRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME,
  defaults: {
    yOffset: 5
  },
  initTopics: [InitTopic.Zones],
  layer: HUDLayer.HUD,
  render: () => {
    return <ZoneName />;
  }
};
