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
  EntityResource,
  ItemEntityStateModel
  // ItemEntityStateModel
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { EntityResourceDef } from '../../dataSources/manifest/entityResourceManifest';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StatusDef } from '../../dataSources/manifest/statusManifest';
import { StatusState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/StatusState';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { getFactionData } from '../../gameData/factionData';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import ProspectingIconURL from '../../../images/resource-node/prospecting-icon.png';
import FragilityIconURL from '../../../images/resource-node/fragility-icon.png';
import YieldIconURL from '../../../images/resource-node/yield-icon.png';
import FragilityBarURL from '../../../images/resource-node/fragility-bar.png';
import YieldBarURL from '../../../images/resource-node/yield-bar.png';
import ExcavationBarURL from '../../../images/resource-node/excavation-bar.png';
import TargetMarkerURL from '../../../images/resource-node/target-marker.png';

// CSS classes
const Root = 'HUD-ProspectingUnitFrame-Root';
const EntityName = 'HUD-ProspectingUnitFrame-EntityName';
const CloseButton = 'HUD-ProspectingUnitFrame-CloseButton';
const ProspectingIcon = 'HUD-ProspectingUnitFrame-ProspectingIcon';
const YieldBox = 'HUD-ProspectingUnitFrame-YieldBox';
const YieldIcon = 'HUD-ProspectingUnitFrame-YieldIcon';
const FragilityBox = 'HUD-ProspectingUnitFrame-FragilityBox';
const FragilityIcon = 'HUD-ProspectingUnitFrame-FragilityIcon';
const FragilityBar = 'HUD-ProspectingUnitFrame-FragilityBar';
const YieldBar = 'HUD-ProspectingUnitFrame-YieldBar';
const ExcavationBar = 'HUD-ProspectingUnitFrame-ExcavationBar';
const FragilityBarResource = 'HUD-ProspectingUnitFrame-FragilityBarResource';
const YieldBarResource = 'HUD-ProspectingUnitFrame-YieldBarResource';
const ExcavationBarResource = 'HUD-ProspectingUnitFrame-ExcavationBarResource';
const FragilityBarMarker = 'HUD-ProspectingUnitFrame-FragilityBarMarker';
const YieldBarMarker = 'HUD-ProspectingUnitFrame-YieldBarMarker';
const ExcavationBarMarker = 'HUD-ProspectingUnitFrame-ExcavationBarMarker';
const TargetMarker = 'HUD-ProspectingUnitFrame-TargetMarker';

interface ReactProps {
  entity: AnyEntityStateModel;
  isFriendly: boolean;
}

interface InjectedProps {
  localEntityID: string;
  entityResourcesByStringID: Record<string, EntityResourceDef>;
  localPlayerResources: ArrayMap<EntityResource>;
  statusDefsByNumeric: Record<string, StatusDef>;
  localPlayerStatuses: ArrayMap<StatusState>;
  uiFactionID: string;
}

type Props = ReactProps & InjectedProps;

class AProspectingUnitFrame extends React.Component<Props> {
  render(): JSX.Element {
    const entity = this.props.entity as ItemEntityStateModel;
    const factionData = getFactionData(this.props.uiFactionID);

    let fragilityPercent = 1;
    const fragility = this.getResource(EntityResourceIDs.ProspectingFragility);
    if (fragility) {
      fragilityPercent = fragility.current / fragility.max;
    }

    let excavationPercent = 1;
    const excavation = this.getResource(EntityResourceIDs.ProspectingExcavation);
    if (excavation) {
      excavationPercent = excavation.current / excavation.max;
    }

    let targetPercent = 1;
    const target = this.getResource(EntityResourceIDs.ProspectingTargetNumber);
    if (target) {
      targetPercent = target.current / target.max;
    }

    let yieldPercent = 1;
    const yieldResource = Object.values(entity.resources).find((r) => r.id === EntityResourceIDs.Yield);
    if (yieldResource) {
      yieldPercent = yieldResource.current / yieldResource.max;
    }

    console.log(
      `Fragility: ${fragilityPercent.toFixed(1)} Excavation: ${excavationPercent.toFixed(
        1
      )} Target: ${targetPercent.toFixed(1)} Yield: ${yieldPercent.toFixed(1)}`
    );

    return (
      <div
        style={{
          borderImageSource: `url(${factionData.borderCloseWindowImage})`,
          backgroundImage: `url(${factionData.prospectingBackgroundImage})`
        }}
        className={Root}
      >
        <div className={EntityName}>{entity.name}</div>
        <img src={factionData.windowCloseImage} className={CloseButton} onClick={this.closeSelf.bind(this)} />
        <img src={ProspectingIconURL} className={ProspectingIcon} />
        <div className={YieldBox}>
          <img src={YieldIconURL} className={YieldIcon} />
        </div>
        <div className={FragilityBox}>
          <img src={FragilityIconURL} className={FragilityIcon} />
        </div>
        <div className={YieldBar}>
          <img style={{ width: `${yieldPercent * 100}%` }} className={YieldBarResource} src={YieldBarURL} />
          <div style={{ left: `${yieldPercent * 100}%` }} className={YieldBarMarker} />
        </div>
        <div className={ExcavationBar}>
          <img
            style={{ width: `${excavationPercent * 100}%` }}
            className={ExcavationBarResource}
            src={ExcavationBarURL}
          />
          <div style={{ left: `${excavationPercent * 100}%` }} className={ExcavationBarMarker} />
          {targetPercent && (
            <img className={TargetMarker} src={TargetMarkerURL} style={{ left: `${targetPercent * 100}%` }} />
          )}
        </div>
        {fragilityPercent && (
          <div className={FragilityBar}>
            <img
              style={{ width: `${fragilityPercent * 100}%` }}
              className={FragilityBarResource}
              src={FragilityBarURL}
            />
            <div style={{ left: `${fragilityPercent * 100}%` }} className={FragilityBarMarker} />
          </div>
        )}
      </div>
    );
  }

  private closeSelf(): void {
    // Deselect the appropriate target.
    if (this.props.isFriendly) {
      clientAPI.requestFriendlyTarget('');
    } else {
      clientAPI.requestEnemyTarget('');
    }
  }

  private getResource(resourceID: EntityResourceIDs): EntityResource {
    return Object.values(this.props.localPlayerResources).find((r) => r.id === resourceID);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { entityID, resources, statuses } = state.entities.self;
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    localEntityID: entityID,
    entityResourcesByStringID: state.gameDefs.entityResourcesByStringID,
    localPlayerResources: resources,
    statusDefsByNumeric: state.gameDefs.statusesByNumericID,
    localPlayerStatuses: statuses
  };
}

export const ProspectingUnitFrame = connect(mapStateToProps)(AProspectingUnitFrame);
