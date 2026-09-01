/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  AnyEntityStateModel,
  ItemEntityStateModel
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { TargetPosition } from './TargetPosition';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { NameplateStyle } from '@csegames/library/dist/camelotunchained/clientFunctions/HUDFunctions';
import { getFactionData } from '../../gameData/factionData';
import HealthArtURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-arthurian.png';
import HealthTDDURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-tdd.png';
import HealthVikingURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-viking.png';
import GateIconURL from '../../../images/resource-unit-frames/Resource-unit-frame-icon-gate.png';

// CSS classes
const Root = 'HUD-GateUnitFrame-Root';
const Background = 'HUD-GateUnitFrame-Background';
const Frame = 'HUD-GateUnitFrame-Frame';
const Name = 'HUD-GateUnitFrame-Name';
const HealthBarContainer = 'HUD-GateUnitFrame-HealthBarContainer';
const HealthBarFill = 'HUD-GateUnitFrame-HealthBarFill';
const GateIcon = 'HUD-GateUnitFrame-GateIcon';
const Marker = 'HUD-GateUnitFrame-Marker';
const Position = 'HUD-GateUnitFrame-Position';
const SimpleForegroundRight = 'HUD-GateUnitFrame-SimpleForegroundRight';


interface ReactProps {
  entity: AnyEntityStateModel;
  isFriendly: boolean;
  nameplateStyle: NameplateStyle;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AGateUnitFrame extends React.Component<Props> {
  render(): JSX.Element {
    const entity = this.props.entity as ItemEntityStateModel;
    if (this.props.nameplateStyle === 'simple') {
      return this.renderSimple(entity);
    }
    return this.renderFancy(entity);
  }

  private renderSimple(entity: ItemEntityStateModel): JSX.Element {
    const entityFaction = Faction[entity.faction];
    const healthImage = { TDD: HealthTDDURL, Viking: HealthVikingURL, Arthurian: HealthArtURL }[entityFaction] ?? HealthArtURL;
    const resources = Object.values(entity.resources);
    const health = resources[0];
    const healthPercent = health ? health.current / health.max : 1;
    const factionData = getFactionData(entityFaction);

    return (
      <div className={`${Root} simple`}>
        <img src={factionData.simpleUnitFrameBackgroundImage} className={Background} />
        <div className={HealthBarContainer}>
          <img src={healthImage} className={HealthBarFill} style={{ width: `${healthPercent * 100}%` }} />
          {healthPercent < 1 && (
            <div className={Marker} style={{ right: `calc(100% - ${healthPercent * 100}%)` }} />
          )}
        </div>
        <img src={factionData.simpleUnitFrameForegroundImage} className={Frame} />
        <img src={GateIconURL} className={GateIcon} />
        {factionData.simpleUnitFrameForegroundRightImage && (
          <img className={SimpleForegroundRight} src={factionData.simpleUnitFrameForegroundRightImage} />
        )}
        <div className={Name}>{getStringTableValue(entity.name, this.props.stringTable)}</div>
        <div className={Position}>
          <TargetPosition isFriendly={this.props.isFriendly} faction={entity.faction} />
        </div>
      </div>
    );
  }

  private renderFancy(entity: ItemEntityStateModel): JSX.Element {
    const entityFaction = Faction[entity.faction];
    const factionData = getFactionData(entityFaction);
    const healthImage = { TDD: HealthTDDURL, Viking: HealthVikingURL, Arthurian: HealthArtURL }[entityFaction] ?? HealthArtURL;
    const resources = Object.values(entity.resources);
    const health = resources[0];
    const healthPercent = health ? health.current / health.max : 1;

    return (
      <div className={Root}>
        <img src={factionData.universalUnitFrameBackgroundImage} className={Background} />
        <div className={HealthBarContainer}>
          <img
            src={healthImage}
            className={HealthBarFill}
            style={{ width: `${healthPercent * 100}%` }}
          />
          {healthPercent < 1 && (
            <div
              className={Marker}
              style={{ right: `calc(100% - ${healthPercent * 100}%)` }}
            />
          )}
        </div>
        <img src={factionData.universalUnitFrameForegroundImage} className={Frame} />
        <div className={Name}>{getStringTableValue(entity.name, this.props.stringTable)}</div>
        <img src={GateIconURL} className={GateIcon} />
        <div className={Position}>
          <TargetPosition isFriendly={this.props.isFriendly} faction={entity.faction} />
        </div>
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

export const GateUnitFrame = connect(mapStateToProps)(AGateUnitFrame);
