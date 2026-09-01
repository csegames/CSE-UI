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
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StatusDef } from '../../dataSources/manifest/statusManifest';
import { StatusState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/StatusState';
import { TargetPosition } from './TargetPosition';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { tagsMatch, getTagFromString } from '../../helpers/tagHelpers';
import { ProspectingUnitFrame } from './ProspectingUnitFrame';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { NameplateStyle } from '@csegames/library/dist/camelotunchained/clientFunctions/HUDFunctions';
import { getFactionData } from '../../gameData/factionData';
import HealthFactionlessURL from '../../../images/resource-unit-frames/Resource-unit-frame-health-factionless.png';
import IconFishingURL from '../../../images/resource-unit-frames/Resource-unit-frame-icon-fishing.png';
import IconHerbalismURL from '../../../images/resource-unit-frames/Resource-unit-frame-icon-herbalism.png';
import IconLoggingURL from '../../../images/resource-unit-frames/Resource-unit-frame-icon-logging.png';
import IconMiningURL from '../../../images/resource-unit-frames/Resource-unit-frame-icon-mining.png';
import IconProspectingURL from '../../../images/resource-unit-frames/Resource-unit-frame-icon-prospecting.png';

// Tags
const FishingTag = 'Asset.Gatherable.Fishing';
const HerbalismTag = 'Asset.Gatherable.Herbalism';
const LoggingTag = 'Asset.Gatherable.Logging';
const MiningTag = 'Asset.Gatherable.Mining';
const ProspectingTag = 'Asset.Gatherable.Prospecting';

// CSS classes
const Root = 'HUD-ResourceNodeUnitFrame-Root';
const Background = 'HUD-ResourceNodeUnitFrame-Background';
const Frame = 'HUD-ResourceNodeUnitFrame-Frame';
const Name = 'HUD-ResourceNodeUnitFrame-Name';
const NodeIcon = 'HUD-ResourceNodeUnitFrame-NodeIcon';
const BarContainer = 'HUD-ResourceNodeUnitFrame-BarContainer';
const BarFill = 'HUD-ResourceNodeUnitFrame-BarFill';
const Marker = 'HUD-ResourceNodeUnitFrame-Marker';
const Position = 'HUD-ResourceNodeUnitFrame-Position';
const SimpleForegroundRight = 'HUD-ResourceNodeUnitFrame-SimpleForegroundRight';

interface ReactProps {
  entity: AnyEntityStateModel;
  isFriendly: boolean;
  nameplateStyle: NameplateStyle;
}

interface InjectedProps {
  statusDefsByNumericID: Record<number, StatusDef>;
  localPlayerStatuses: ArrayMap<StatusState>;
  tagAffixIDByStringID: Record<string, number>;
  stringTable: Record<string, StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AResourceNodeUnitFrame extends React.Component<Props> {
  render(): JSX.Element | null {
    if (!('resources' in this.props.entity) || Object.values(this.props.entity.resources).length < 1) {
      return null;
    }

    const entity = this.props.entity as ItemEntityStateModel;

    if (
      this.isPlayerProspecting() &&
      tagsMatch(entity.tags, [getTagFromString(ProspectingTag, this.props.tagAffixIDByStringID)])
    ) {
      return <ProspectingUnitFrame entity={this.props.entity} isFriendly={this.props.isFriendly} />;
    }

    if (this.props.nameplateStyle === 'simple') {
      return this.renderSimple(entity);
    }
    return this.renderFancy(entity);
  }

  private renderSimple(entity: ItemEntityStateModel): JSX.Element {
    const entityFaction = Faction[entity.faction];
    const factionData = getFactionData(entityFaction);
    const nodeIconURL = this.getNodeIconURL(entity);
    const resources = Object.values(entity.resources).slice(0, 1);

    return (
      <div className={`${Root} simple`}>
        <img src={factionData.simpleUnitFrameBackgroundImage} className={Background} />
        {resources.map((r) => {
          const pct = r.current / r.max;
          return (
            <div key={r.id} className={BarContainer}>
              <img src={HealthFactionlessURL} className={BarFill} style={{ width: `${pct * 100}%` }} />
              {pct < 1 && (
                <div className={Marker} style={{ right: `calc(100% - ${pct * 100}%)` }} />
              )}
            </div>
          );
        })}
        <img src={factionData.simpleUnitFrameForegroundImage} className={Frame} />
        {nodeIconURL && <img src={nodeIconURL} className={NodeIcon} />}
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
    const nodeIconURL = this.getNodeIconURL(entity);
    const resources = Object.values(entity.resources).slice(0, 1);
    const barTops = resources.length === 1 ? ['6.39vmin'] : ['5.31vmin', '6.39vmin'];

    return (
      <div className={Root}>
        <img src={factionData.universalUnitFrameBackgroundImage} className={Background} />
        {resources.map((r, i) => {
          const pct = r.current / r.max;
          return (
            <div key={r.id} className={BarContainer} style={{ top: barTops[i] }}>
              <img src={HealthFactionlessURL} className={BarFill} style={{ width: `${pct * 100}%` }} />
              {pct < 1 && (
                <div
                  className={Marker}
                  style={{ right: `calc(100% - ${pct * 100}%)` }}
                />
              )}
            </div>
          );
        })}
        <img src={factionData.universalUnitFrameForegroundImage} className={Frame} />
        <div className={Name}>{getStringTableValue(entity.name, this.props.stringTable)}</div>
        {nodeIconURL && <img src={nodeIconURL} className={NodeIcon} />}
        <div className={Position}>
          <TargetPosition isFriendly={this.props.isFriendly} faction={entity.faction} />
        </div>
      </div>
    );
  }

  private getNodeIconURL(entity: ItemEntityStateModel): string | null {
    const { tagAffixIDByStringID } = this.props;
    return (
      tagsMatch(entity.tags, [getTagFromString(FishingTag, tagAffixIDByStringID)]) ? IconFishingURL :
      tagsMatch(entity.tags, [getTagFromString(HerbalismTag, tagAffixIDByStringID)]) ? IconHerbalismURL :
      tagsMatch(entity.tags, [getTagFromString(LoggingTag, tagAffixIDByStringID)]) ? IconLoggingURL :
      tagsMatch(entity.tags, [getTagFromString(MiningTag, tagAffixIDByStringID)]) ? IconMiningURL :
      tagsMatch(entity.tags, [getTagFromString(ProspectingTag, tagAffixIDByStringID)]) ? IconProspectingURL :
      null
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
  const { statuses } = state.entities.self;
  return {
    ...ownProps,
    statusDefsByNumericID: state.gameDefs.statusesByNumericID,
    localPlayerStatuses: statuses,
    tagAffixIDByStringID: state.gameDefs.tagAffixIDByStringID,
    stringTable: state.stringTable.stringTable
  };
}

export const ResourceNodeUnitFrame = connect(mapStateToProps)(AResourceNodeUnitFrame);
