/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { AnyEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { TargetPosition } from './TargetPosition';
import StatusEffects from './StatusEffects';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { NameplateStyle } from '@csegames/library/dist/camelotunchained/clientFunctions/HUDFunctions';
import { getFactionData } from '../../gameData/factionData';
import HealthArtURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-arthurian.png';
import HealthTDDURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-tdd.png';
import HealthVikingURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-viking.png';
import HealthFactionlessURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-factionless.png';

// CSS classes
const Root = 'HUD-ItemUnitFrame-Root';
const FrameRoot = 'HUD-ItemUnitFrame-FrameRoot';
const Background = 'HUD-ItemUnitFrame-Background';
const Frame = 'HUD-ItemUnitFrame-Frame';
const Name = 'HUD-ItemUnitFrame-Name';
const HealthBarContainer = 'HUD-ItemUnitFrame-HealthBarContainer';
const HealthBarFill = 'HUD-ItemUnitFrame-HealthBarFill';
const Icon = 'HUD-ItemUnitFrame-Icon';
const Marker = 'HUD-ItemUnitFrame-Marker';
const Position = 'HUD-ItemUnitFrame-Position';
const SimpleForegroundRight = 'HUD-ItemUnitFrame-SimpleForegroundRight';

const FULL_HEALTH_PERCENT = 1;

const healthImageByFaction: Record<string, string> = {
  Factionless: HealthFactionlessURL,
  TDD: HealthTDDURL,
  Viking: HealthVikingURL,
  Arthurian: HealthArtURL
};

interface ReactProps {
  entity: AnyEntityStateModel;
  isFriendly: boolean;
  nameplateStyle: NameplateStyle;
  iconURL: string;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

function getHealthPercent(entity: AnyEntityStateModel): number {
  const health = Object.values(entity.resources ?? {})[0];
  return health ? health.current / health.max : FULL_HEALTH_PERCENT;
}

class AItemUnitFrame extends React.Component<Props> {
  render(): JSX.Element {
    if (this.props.nameplateStyle === 'simple') {
      return this.renderSimple(this.props.entity);
    }
    return this.renderFancy(this.props.entity);
  }

  private renderHealthBar(entity: AnyEntityStateModel): JSX.Element {
    const healthImage = healthImageByFaction[Faction[entity.faction]] ?? HealthArtURL;
    const healthPercent = getHealthPercent(entity);

    return (
      <div className={HealthBarContainer}>
        <img src={healthImage} className={HealthBarFill} style={{ width: `${healthPercent * 100}%` }} />
        {healthPercent < FULL_HEALTH_PERCENT && (
          <div className={Marker} style={{ right: `calc(100% - ${healthPercent * 100}%)` }} />
        )}
      </div>
    );
  }

  private renderSimple(entity: AnyEntityStateModel): JSX.Element {
    const factionData = getFactionData(Faction[entity.faction]);

    return (
      <div className={`${Root} simple`}>
        <div className={`${FrameRoot} simple`}>
          <img src={factionData.simpleUnitFrameBackgroundImage} className={Background} />
          {this.renderHealthBar(entity)}
          <img src={factionData.simpleUnitFrameForegroundImage} className={Frame} />
          <img src={this.props.iconURL} className={Icon} />
          {factionData.simpleUnitFrameForegroundRightImage && (
            <img className={SimpleForegroundRight} src={factionData.simpleUnitFrameForegroundRightImage} />
          )}
          <div className={Name}>{getStringTableValue(entity.name, this.props.stringTable)}</div>
          <div className={Position}>
            <TargetPosition isFriendly={this.props.isFriendly} faction={entity.faction} />
          </div>
        </div>
        <StatusEffects statuses={entity.statuses} entityID={entity.entityID} />
      </div>
    );
  }

  private renderFancy(entity: AnyEntityStateModel): JSX.Element {
    const factionData = getFactionData(Faction[entity.faction]);

    return (
      <div className={Root}>
        <div className={FrameRoot}>
          <img src={factionData.universalUnitFrameBackgroundImage} className={Background} />
          {this.renderHealthBar(entity)}
          <img src={factionData.universalUnitFrameForegroundImage} className={Frame} />
          <div className={Name}>{getStringTableValue(entity.name, this.props.stringTable)}</div>
          <img src={this.props.iconURL} className={Icon} />
          <div className={Position}>
            <TargetPosition isFriendly={this.props.isFriendly} faction={entity.faction} />
          </div>
        </div>
        <StatusEffects statuses={entity.statuses} entityID={entity.entityID} />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable
  };
}

export const ItemUnitFrame = connect(mapStateToProps)(AItemUnitFrame);
