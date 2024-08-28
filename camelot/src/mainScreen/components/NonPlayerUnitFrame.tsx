/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import {
  AnyEntityStateModel,
  EntityPositionMapModel
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { getEntityResource } from '@csegames/library/dist/camelotunchained/clientFunctions/EntityFunctions';
import { Theme } from '../themes/themeConstants';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import StatusEffects from './StatusEffects';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { distanceVec3 } from '@csegames/library/dist/_baseGame/utils/distance';
import { FactionDef } from '../dataSources/manifest/factionManifest';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import DefaultNameplateBackgroundURL from '../../images/unit-frames/nameplate-bg.png';
import DefaultArchetypeFrameURL from '../../images/unit-frames/default-frame.png';
import DefaultArchetypeBackgroundURL from '../../images/unit-frames/profile-bg.png';
import DefaultMiniFrameURL from '../../images/unit-frames/mini-frame.png';
import MiniFrameBackgroundURL from '../../images/unit-frames/mini-bg.png';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';

// Styles.
const Root = 'HUD-NonPlayerUnitFrame-Root';
const FrameRoot = 'HUD-NonPlayerUnitFrame-FrameRoot';
const FrameImage = 'HUD-NonPlayerUnitFrame-FrameImage';
const HealthText = 'HUD-NonPlayerUnitFrame-HealthText';
const BarsContainer = 'HUD-NonPlayerUnitFrame-BarsContainer';
const HealthBar = 'HUD-NonPlayerUnitFrame-HealthBar';
const NameplateBackground = 'HUD-NonPlayerUnitFrame-NameplateBackground';
const NameplateText = 'HUD-NonPlayerUnitFrame-NameplateText';
const ArchetypeContainer = 'HUD-NonPlayerUnitFrame-ArchetypeContainer';
const ArchetypeBackground = 'HUD-NonPlayerUnitFrame-ArchetypeBackground';
const ArchetypeProfilePicture = 'HUD-NonPlayerUnitFrame-ArchetypeProfilePicture';
const ArchetypeFrame = 'HUD-NonPlayerUnitFrame-ArchetypeFrame';
const Distance = 'HUD-NonPlayerUnitFrame-Distance';

interface ReactProps {
  entity: AnyEntityStateModel;
}

interface InjectedProps {
  currentTheme: Theme;
  factions: Dictionary<FactionDef>;
  localEntityID: string;
  positions: EntityPositionMapModel;
}

type Props = ReactProps & InjectedProps;

class NonPlayerUnitFrame extends React.Component<Props> {
  render(): JSX.Element {
    // If it doesn't have resources, then it doesn't get a target frame.
    if (!('resources' in this.props.entity)) {
      return null;
    }

    if (Object.keys(this.props.factions).length < 1) {
      // Most likely, the gameDef data hasn't been fetched yet.  This happens commonly for renders
      // under the LoadingScreen.
      return null;
    }

    const { entity } = this.props;

    const faction = this.props.factions[Faction[entity.faction]];

    const colors = this.props.currentTheme.unitFrames.color;

    const health = getEntityResource(this.props.entity, EntityResourceIDs.Health);
    const healthRatio = health ? health.current / health.max : 0;

    return (
      <div className={Root}>
        <div className={FrameRoot}>
          <img
            className={NameplateBackground}
            src={faction?.nameplateBackgroundImage ?? DefaultNameplateBackgroundURL}
          />
          <div className={NameplateText}>{this.props.entity.name}</div>
          <img className={FrameImage} src={MiniFrameBackgroundURL} />
          <div className={BarsContainer}>
            {health && (
              <div className={HealthBar} style={{ backgroundColor: colors.health, width: `${healthRatio * 90}%` }} />
            )}
          </div>
          <img className={FrameImage} src={faction?.nameplateMiniFrameImage ?? DefaultMiniFrameURL} />

          {health && (
            <div className={`${HealthText} ShowOnHover`}>
              {`${printWithSeparator(health.current, ' ')} / ${printWithSeparator(health.max, ' ')}`}{' '}
            </div>
          )}

          <div className={ArchetypeContainer}>
            <img className={ArchetypeBackground} src={DefaultArchetypeBackgroundURL} />
            {faction?.nameplateProfileImage && (
              <img
                className={ArchetypeProfilePicture}
                src={faction.nameplateProfileImage}
                style={{ WebkitMaskImage: `url(${DefaultArchetypeBackgroundURL})` }}
              />
            )}
            <img className={ArchetypeFrame} src={faction?.nameplateIconFrameImage ?? DefaultArchetypeFrameURL} />
          </div>
          <div className={Distance}>
            {this.props.positions[this.props.localEntityID] && this.props.positions[this.props.entity.entityID]
              ? distanceVec3(
                  this.props.positions[this.props.localEntityID],
                  this.props.positions[this.props.entity.entityID]
                ).toFixed(2)
              : 0.0}
          </div>
        </div>
        <StatusEffects statuses={this.props.entity.statuses} />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentTheme } = state.themes;
  const { factions } = state.gameDefs;
  return {
    ...ownProps,
    currentTheme,
    factions,
    localEntityID: state.player.entityID,
    positions: state.entities.positions
  };
}

export default connect(mapStateToProps)(NonPlayerUnitFrame);
