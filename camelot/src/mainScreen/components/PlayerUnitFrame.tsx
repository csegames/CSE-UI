/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import {
  EntityPositionMapModel,
  EntityResource,
  StatusState
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import TooltipSource from './TooltipSource';
import { Theme } from '../themes/themeConstants';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { GroupsAPI, GroupTypes } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import StatusEffects from './StatusEffects';
import { ArrayMap, Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { FactionData } from '../redux/gameDefsSlice';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { distanceVec3 } from '@csegames/library/dist/_baseGame/utils/distance';
import ContextMenuSource from './ContextMenuSource';
import { Dispatch } from '@reduxjs/toolkit';
import { ContextMenuItem, ContextMenuParams, hideContextMenu } from '../redux/contextMenuSlice';
import {
  ClassDefGQL,
  GroupMemberState,
  EntityResourceDefinitionGQL,
  UnitFrameDisplay
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import { UserClassesData } from '@csegames/library/dist/_baseGame/clientFunctions/AssetFunctions';
import { webConf } from '../redux/networkConfiguration';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import BackgroundURL from '../../images/unit-frames/unitframe-bg.png';
import DefaultArchetypeFrameURL from '../../images/unit-frames/default-frame.png';
import DefaultArchetypeBackgroundURL from '../../images/unit-frames/profile-bg.png';

// Styles.
const Root = 'HUD-PlayerUnitFrame-Root';
const StatText = 'HUD-PlayerUnitFrame-Tooltip-StatText';
const StatRow = 'HUD-PlayerUnitFrame-Tooltip-StatRow';
const FrameRoot = 'HUD-PlayerUnitFrame-FrameRoot';
const Background = 'HUD-PlayerUnitFrame-Background';
const BarsContainer = 'HUD-PlayerUnitFrame-BarsContainer';
const BloodBar = 'HUD-PlayerUnitFrame-BloodBar';
const HealthBar = 'HUD-PlayerUnitFrame-HealthBar';
const WoundsBar = 'HUD-PlayerUnitFrame-WoundsBar';
const StaminaBar = 'HUD-PlayerUnitFrame-StaminaBar';
const FortitudeBar = 'HUD-PlayerUnitFrame-FortitudeBar';
const PanicBar = 'HUD-PlayerUnitFrame-PanicBar';
const NameplateText = 'HUD-PlayerUnitFrame-NameplateText';
const LeaderIcon = 'HUD-PlayerUnitFrame-LeaderIcon';
const ArchetypeContainer = 'HUD-PlayerUnitFrame-ArchetypeContainer';
const ArchetypeBackground = 'HUD-PlayerUnitFrame-ArchetypeBackground';
const ArchetypeProfilePicture = 'HUD-PlayerUnitFrame-ArchetypeProfilePicture';
const ArchetypeFrame = 'HUD-PlayerUnitFrame-ArchetypeFrame';
const Distance = 'HUD-PlayerUnitFrame-Distance';

interface ReactProps {
  entityID: string;
  isAlive: boolean;
  name: string;
  resources: ArrayMap<EntityResource>;
  statuses: ArrayMap<StatusState>;
  wounds: number;
  class: ClassDefGQL;
  faction: Faction;
  isLeader?: boolean;
  showDistance?: boolean;
  allowTargetting?: boolean;
}

interface InjectedProps {
  localPlayerEntityID: string;
  currentTheme: Theme;
  classDynamicAssets: Dictionary<UserClassesData>;
  factions: Dictionary<FactionData>;
  friendlyTargetType: string | null;
  warbandID: string;
  warbandMembers: (GroupMemberState | null)[];
  entityResourceDefs: Dictionary<EntityResourceDefinitionGQL>;
  requestFriendlyTarget: (entityID: string) => void;
  positions: EntityPositionMapModel;
}

type Props = ReactProps & InjectedProps;

class PlayerUnitFrame extends React.Component<Props> {
  render(): JSX.Element {
    const faction = this.props.factions[Faction[this.props.faction]];
    if (!faction) {
      // Most likely, the gameDef data hasn't been fetched yet.  This happens commonly for renders
      // under the LoadingScreen.
      return null;
    }

    const myClass = this.props.classDynamicAssets[this.props.class?.id]; // could be null
    const colors = this.props.currentTheme.unitFrames.color;

    const health = this.getResource(EntityResourceIDs.Health);
    const fortitude = this.getResource(EntityResourceIDs.Fortitude);
    const panic = this.getResource(EntityResourceIDs.Panic);
    const blood = this.getResource(EntityResourceIDs.Blood);
    const stamina = this.getResource(EntityResourceIDs.Stamina);

    const bloodRatio = blood ? blood.current / blood.max : 0;
    const healthRatio = health ? health.current / health.max : 0;
    const woundsRatio = this.props.wounds / 3;
    const staminaRatio = stamina ? stamina.current / stamina.max : 0;
    const fortitudeRatio = fortitude ? fortitude.current / fortitude.max : 0;
    const panicRatio = panic ? panic.current / panic.max : 0;

    const frameBackground = myClass?.NameplateIconBackgroundImage ?? DefaultArchetypeBackgroundURL;
    const frame = myClass?.NameplateIconFrameImage ?? DefaultArchetypeFrameURL;

    return (
      <div className={Root}>
        <TooltipSource
          onClick={this.props.allowTargetting ? this.targetPlayer.bind(this) : undefined}
          className={FrameRoot}
          tooltipParams={{ id: `PlayerUnitFrame_Stats_${this.props.entityID}`, content: this.renderTooltip.bind(this) }}
        >
          <ContextMenuSource
            className={FrameRoot}
            menuParams={this.getContextMenuParams()}
            style={{ backgroundImage: `url(${faction.nameplateBackgroundURL})` }}
          >
            <img className={Background} src={BackgroundURL} />
            <div className={NameplateText}>
              {this.props.name}
              {!this.props.isAlive && this.props.entityID?.length > 0 ? ' (Corpse)' : ''}
              {this.props.isLeader && <div className={`${LeaderIcon} icon-rank-10`} />}
            </div>
            <div className={BarsContainer}>
              <div className={BloodBar} style={{ backgroundColor: colors.blood, height: `${bloodRatio * 92}%` }} />
              <div className={HealthBar} style={{ backgroundColor: colors.health, width: `${healthRatio * 87}%` }} />
              <div className={WoundsBar} style={{ backgroundColor: colors.wound, width: `${woundsRatio * 87}%` }} />
              <div className={StaminaBar} style={{ backgroundColor: colors.stamina, width: `${staminaRatio * 70}%` }} />
              <div
                className={FortitudeBar}
                style={{ backgroundColor: colors.fortitude, width: `${fortitudeRatio * 70}%` }}
              />
              <div className={PanicBar} style={{ backgroundColor: colors.panic, width: `${panicRatio * 69}%` }} />
            </div>
            <img className={Background} src={faction.nameplateMainFrameURL} />

            <div className={ArchetypeContainer}>
              <img className={ArchetypeBackground} src={frameBackground} />
              <img
                className={ArchetypeProfilePicture}
                src={faction.nameplateProfilePictureURL}
                style={{ WebkitMaskImage: `url(${frameBackground})` }}
              />
              <img className={ArchetypeFrame} src={frame} />
            </div>

            {this.props.showDistance && (
              <div className={Distance}>
                {this.props.positions[this.props.localPlayerEntityID] && this.props.positions[this.props.entityID]
                  ? distanceVec3(
                      this.props.positions[this.props.localPlayerEntityID],
                      this.props.positions[this.props.entityID]
                    ).toFixed(2)
                  : 0.0}
              </div>
            )}
          </ContextMenuSource>
        </TooltipSource>
        <StatusEffects statuses={this.props.statuses} />
      </div>
    );
  }

  private getContextMenuParams(): ContextMenuParams | null {
    const content: ContextMenuItem[] = [];

    const localWarbandMember =
      this.props.warbandMembers.find((member) => member && member.entityID === this.props.localPlayerEntityID) ?? null;
    const warbandMember = this.props.warbandMembers.find((member) => member && member.entityID === this.props.entityID);

    if (
      (!localWarbandMember || localWarbandMember.canInvite) &&
      this.props.friendlyTargetType === 'Player' &&
      this.props.entityID !== this.props.localPlayerEntityID &&
      !warbandMember
    ) {
      content.push({
        title: 'Invite to Warband',
        onClick: async (dispatch: Dispatch) => {
          const result = await GroupsAPI.InviteV1(
            webConf,
            this.props.warbandID ?? '',
            '',
            this.props.name,
            GroupTypes.Warband
          );
          dispatch(hideContextMenu());
          if (result.ok) {
            // TODO: Print system message: 'Warband invite sent successfully!'
          } else {
            // TODO: Print system message: 'Failed to send Warband invite.'
            console.error(`Failed to send Warband invite.\n${JSON.stringify(result.data)}`);
          }
        }
      });
    }
    if (localWarbandMember) {
      if (this.props.entityID === this.props.localPlayerEntityID) {
        content.push({
          title: 'Quit Warband',
          onClick: async () => {
            const result = await GroupsAPI.QuitV1(webConf, this.props.warbandID);
            if (result.ok) {
              // TODO: Print system message: 'Warband quit!'
            } else {
              // TODO: Print system message: 'Failed to quit Warband.'
              console.error('Failed to quit Warband.\n' + JSON.stringify(result.data));
            }
          }
        });
      } else if (localWarbandMember.canKick && warbandMember) {
        content.push({
          title: 'Kick from Warband',
          onClick: async () => {
            const result = await GroupsAPI.KickV1(webConf, this.props.warbandID ?? '', '', '', this.props.name);
            if (result.ok) {
              // TODO: Print system message: 'Kicked!'
            } else {
              // TODO: Print system message: 'Failed to kick.'
              console.error('Failed to kick.\n' + JSON.stringify(result.data));
            }
          }
        });
      }
    }

    if (content.length > 0) {
      const params: ContextMenuParams = {
        id: `UnitFrame_${this.props.entityID}`,
        content
      };
      return params;
    } else {
      // If no content, then no context menu will appear.
      return null;
    }
  }

  private renderTooltip(): React.ReactNode {
    var resources: EntityResource[] = [];
    for (const index in this.props.resources) {
      const resource: EntityResource = this.props.resources[index];
      const def = this.props.entityResourceDefs[resource.id];
      if (!def) {
        continue;
      }

      if (
        def.unitFrameDisplay == UnitFrameDisplay.Visible ||
        (def.unitFrameDisplay == UnitFrameDisplay.HiddenWhenCurrentValue0 && resource.current > 0)
      ) {
        resources.push(resource);
      }
    }

    resources.sort((r1, r2) => {
      const sortOrder1 = this.props.entityResourceDefs[r1.id].unitFrameSortOrder;
      const sortOrder2 = this.props.entityResourceDefs[r2.id].unitFrameSortOrder;
      if (sortOrder1 != sortOrder2) {
        return sortOrder1 - sortOrder2;
      }

      return r1.id.localeCompare(r2.id);
    });

    return (
      <>
        {resources.map((resource, index) => {
          const resourceDef = this.props.entityResourceDefs[resource.id];
          return (
            <div className={StatText} style={{ color: resourceDef.tooltipTextColor }}>
              <div className={StatRow}>{resourceDef.name}:</div>
              {`${printWithSeparator(resource.current, ' ')}  /`}
              {`  ${printWithSeparator(resource.max, ' ')}`}
            </div>
          );
        })}
      </>
    );
  }

  private targetPlayer(): void {
    this.props.requestFriendlyTarget(this.props.entityID);
  }

  private getResource(resourceID: EntityResourceIDs): EntityResource {
    return Object.values(this.props.resources).find((r) => r.id === resourceID);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentTheme } = state.themes;
  const { factions, classDynamicAssets, entityResourcesByStringID } = state.gameDefs;

  return {
    ...ownProps,
    currentTheme,
    classDynamicAssets,
    factions,
    localPlayerEntityID: state.player.entityID,
    friendlyTargetType: state.entities.friendlyTarget?.type ?? null,
    warbandID: state.warband.id,
    warbandMembers: state.warband.members,
    requestFriendlyTarget: state.player.requestFriendlyTarget,
    entityResourceDefs: entityResourcesByStringID,
    positions: state.entities.positions
  };
}

export default connect(mapStateToProps)(PlayerUnitFrame);
