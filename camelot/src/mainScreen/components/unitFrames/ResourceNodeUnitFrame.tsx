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
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { StatusDef } from '../../dataSources/manifest/statusManifest';
import { StatusState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/StatusState';
import { TargetPosition } from './TargetPosition';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { tagsMatch, getTagFromString } from '../../helpers/tagHelpers';
import { ProspectingUnitFrame } from './ProspectingUnitFrame';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { NameplateDecorFlags } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import HealthFactionlessURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-factionless.png';
import { UnitFrameChrome } from './UnitFrameChrome';
import { UnitFrameChromeFront } from './UnitFrameChromeFront';
import { UnitFrameBar } from './UnitFrameBar';
import { getResourceNodeIconURL } from '../../helpers/resourceNodeHelpers';

// Tags
const ProspectingTag = 'Asset.Gatherable.Prospecting';

// CSS classes
const Root = 'HUD-ResourceNodeUnitFrame-Root';
const Name = 'HUD-ResourceNodeUnitFrame-Name';
const BarFill = 'HUD-ResourceNodeUnitFrame-BarFill';
const Marker = 'HUD-ResourceNodeUnitFrame-Marker';
const Position = 'HUD-ResourceNodeUnitFrame-Position';

interface ReactProps {
  entity: AnyEntityStateModel;
  isFriendly: boolean;
  nameplateDecor?: NameplateDecorFlags;
}

interface InjectedProps {
  entityResources: Record<string, EntityResource>;
  statusDefsByNumericID: Record<number, StatusDef>;
  localPlayerStatuses: Record<number, StatusState>;
  tagAffixIDByStringID: Record<string, number>;
  stringTable: Record<string, StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AResourceNodeUnitFrame extends React.Component<Props> {
  render(): JSX.Element | null {
    if (!this.props.entityResources || Object.values(this.props.entity.resources).length < 1) {
      return null;
    }

    const entity = this.props.entity as ItemEntityStateModel;

    if (
      this.isPlayerProspecting() &&
      tagsMatch(entity.tags, [getTagFromString(ProspectingTag, this.props.tagAffixIDByStringID)])
    ) {
      return <ProspectingUnitFrame entity={this.props.entity} isFriendly={this.props.isFriendly} />;
    }

    return this.renderNodeFrame(entity);
  }

  private renderNodeFrame(entity: ItemEntityStateModel): JSX.Element {
    const factionID = Faction[entity.faction];
    const resource = Object.values(this.props.entityResources)[0];
    const pct = resource ? resource.current / resource.max : 0;

    return (
      <div className={Root}>
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
          {resource && (
            <>
              <img src={HealthFactionlessURL} className={BarFill} style={{ width: `${pct * 100}%` }} />
              {pct < 1 && <div className={Marker} style={{ right: `calc(100% - ${pct * 100}%)` }} />}
            </>
          )}
        </UnitFrameBar>
        <div className={Position}>
          <TargetPosition isFriendly={this.props.isFriendly} faction={entity.faction} />
        </div>
        <UnitFrameChromeFront
          factionID={factionID}
          iconURL={getResourceNodeIconURL(entity.tags, this.props.tagAffixIDByStringID)}
          layout='two-bars'
          decor={this.props.nameplateDecor}
        />
      </div>
    );
  }

  private isPlayerProspecting(): boolean {
    return Object.values(this.props.localPlayerStatuses).some((s) => {
      const statusDef = this.props.statusDefsByNumericID[s.id];
      if (statusDef) {
        return statusDef.name.toLowerCase().includes('prospecting');
      }
      return false;
    });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps,
    entityResources: state.entities.entityResources[ownProps.entity.entityID] ?? {},
    statusDefsByNumericID: state.gameDefs.statusesByNumericID,
    localPlayerStatuses: state.entities.entityStatuses[state.entities.self.entityID] ?? {},
    tagAffixIDByStringID: state.gameDefs.tagAffixIDByStringID,
    stringTable: state.stringTable.stringTable
  };
}

export const ResourceNodeUnitFrame = connect(mapStateToProps)(AResourceNodeUnitFrame);
