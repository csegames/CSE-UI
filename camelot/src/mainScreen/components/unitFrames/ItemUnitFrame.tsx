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
import { NameplateDecorFlags } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import HealthArtURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-arthurian.png';
import HealthTDDURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-tdd.png';
import HealthVikingURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-viking.png';
import HealthFactionlessURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-factionless.png';
import { UnitFrameChrome } from './UnitFrameChrome';
import { UnitFrameChromeFront } from './UnitFrameChromeFront';
import { UnitFrameBar } from './UnitFrameBar';

// CSS classes
const Root = 'HUD-ItemUnitFrame-Root';
const FrameRoot = 'HUD-ItemUnitFrame-FrameRoot';
const Name = 'HUD-ItemUnitFrame-Name';
const HealthBarContainer = 'HUD-ItemUnitFrame-HealthBarContainer';
const HealthBarFill = 'HUD-ItemUnitFrame-HealthBarFill';
const Marker = 'HUD-ItemUnitFrame-Marker';
const Position = 'HUD-ItemUnitFrame-Position';

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
  nameplateDecor?: NameplateDecorFlags;
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
    const { entity } = this.props;
    const factionID = Faction[entity.faction];

    return (
      <div className={Root}>
        <div className={FrameRoot}>
          <UnitFrameChrome
            factionID={factionID}
            hasBottomDiamond={true}
            layout='two-bars'
            decor={this.props.nameplateDecor}
          />
          <UnitFrameBar slot='name' layout='two-bars' factionID={factionID}>
            <div className={Name}>{getStringTableValue(entity.name, this.props.stringTable)}</div>
          </UnitFrameBar>
          <UnitFrameBar slot='health' layout='two-bars' factionID={factionID}>
            {this.renderHealthBar(entity)}
          </UnitFrameBar>
          <div className={Position}>
            <TargetPosition isFriendly={this.props.isFriendly} faction={entity.faction} />
          </div>
          <UnitFrameChromeFront
            factionID={factionID}
            iconURL={this.props.iconURL}
            layout='two-bars'
            decor={this.props.nameplateDecor}
          />
        </div>
        <StatusEffects entityID={entity.entityID} />
      </div>
    );
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
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable
  };
}

export const ItemUnitFrame = connect(mapStateToProps)(AItemUnitFrame);
