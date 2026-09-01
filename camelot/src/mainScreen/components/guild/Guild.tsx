/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, AppDispatch, RootState } from '../../redux/store';
import { addConditionalWidgetExiting, HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import Escapable from '../Escapable';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralAttention,
  StringIDGeneralCancel,
  StringIDGeneralConfirm,
  StringIDGeneralOffline,
  StringIDGeneralOnline,
  StringIDGeneralUnnamed
} from '../../helpers/stringTableHelpers';
import { FactionBorder, BorderType, BorderBackground } from '../FactionBorder';
import {
  GuildSnapshot,
  GuildMember
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/GuildSnapshot';
import { FactionDivider } from '../FactionDivider';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { getFactionData } from '../../gameData/factionData';
import { FactionTitle } from '../FactionTitle';
import { FactionScrollArea } from '../FactionScrollArea';
import ContextMenuSource from '../ContextMenuSource';
import { ContextMenuItem } from '../../redux/contextMenuSlice';
import { getDoesAccountHaveGuildPermission, getIsAccountGuildMaster } from '../../helpers/characterHelpers';
import { GroupPermission } from '@csegames/library/dist/_baseGame/types/GroupPermission';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { callGuildKick, callSetGuildRank } from '../../helpers/rest/guildsRestCalls';
import { hideModal, ModalModel, ModalParams, showModal } from '../../redux/modalsSlice';
import { FactionSquareButton } from '../FactionSquareButton';
import { GuildManagementModal } from './GuildManagementModal';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';

// CSS classes
const Root = 'HUD-Guild-Root';
const NoGuildContainer = 'HUD-Guild-NoGuild-Container';
const NoGuildMessage = 'HUD-Guild-NoGuild-Message';
const NoGuildInstructions = 'HUD-Guild-NoGuild-Instructions';
const NoGuildCaveats = 'HUD-Guild-NoGuild-Caveats';
const RosterHeader = 'HUD-Guild-Roster-Header';
const RosterHeaderContent = 'HUD-Guild-Roster-HeaderContent';
const RosterBanner = 'HUD-Guild-Roster-Banner';
const RosterMOTDArea = 'HUD-Guild-Roster-MOTDArea';
const RosterMOTDText = 'HUD-Guild-Roster-MOTDText';
const MemberListSection = 'HUD-Guild-Roster-MemberListSection';
const MemberListHeader = 'HUD-Guild-Roster-MemberList-Header';
const SortButton = 'HUD-Guild-Roster-MemberList-SortButton';
const MemberNameCell = 'HUD-Guild-Roster-MemberList-MemberNameCell';
const MemberLevelCell = 'HUD-Guild-Roster-MemberList-MemberLevelCell';
const MemberClassCell = 'HUD-Guild-Roster-MemberList-MemberClassCell';
const MemberRankCell = 'HUD-Guild-Roster-MemberList-MemberRankCell';
const LegendText = 'HUD-Guild-Roster-MemberList-LegendText';
const SortDirectionIndicator = 'HUD-Guild-Roster-MemberList-SortDirectionIndicator';
const MemberListScrollRegion = 'HUD-Guild-Roster-MemberList-ScrollRegion';
const MemberListScrollArea = 'HUD-Guild-Roster-MemberList-ScrollArea';
const MemberListScrollBorder = 'HUD-Guild-Roster-MemberList-ScrollBorder';
const MemberListContent = 'HUD-Guild-Roster-MemberList-Content';
const MemberListRow = 'HUD-Guild-Roster-MemberList-Row';
const MemberListDataText = 'HUD-Guild-Roster-MemberList-DataText';
const EditGuildButton = 'HUD-Guild-EditGuildButton';
const Handle = 'HUD-FancyBorder-HeaderHandle';

// String IDs
const StringIDGuildsRoster = 'GuildsRoster';
const StringIDGuildsNoGuildMessage = 'GuildsNoGuildMessage';
const StringIDGuildsNoGuildInstructions = 'GuildsNoGuildInstructions';
const StringIDGuildsCaveats = 'GuildsCaveats';
const StringIDGuildsLegendMemberName = 'GuildsLegendMemberName';
const StringIDGuildsLegendMemberLevel = 'GuildsLegendMemberLevel';
const StringIDGuildsLegendMemberClass = 'GuildsLegendMemberClass';
const StringIDGuildsLegendMemberRank = 'GuildsLegendMemberRank';
const StringIDUnitFrameContextKickGuild = 'UnitFrameContextKickGuild';
const StringIDGuildsConfirmKick = 'GuildsConfirmKick';
const StringIDGuildsPromoteRank = 'GuildsPromoteRank';
const StringIDGuildsDemoteRank = 'GuildsDemoteRank';

enum SortCategory {
  Name = 'Name',
  Level = 'Level',
  Class = 'Class',
  Rank = 'Rank'
}

enum SortOrder {
  None = 0,
  Ascending,
  Descending,
  COUNT
}

interface State {
  sort: [SortCategory, SortOrder][];
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  guild: GuildSnapshot;
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
  self: PlayerEntityStateModel;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AGuild extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sort: []
    };
  }

  render(): JSX.Element {
    return (
      <FactionBorder
        className={Root}
        type={BorderType.FancyHeader}
        background={BorderBackground.Leather}
        titleText={getStringTableValue(StringIDGuildsRoster, this.props.stringTable)}
        cornerButtons={[<FactionCornerButton type={CornerButtonType.Close} onClick={this.closeSelf.bind(this)} />]}
      >
        {!this.props.isDragCopy && <Escapable escapeID={WIDGET_ID_GUILD} onEscape={this.closeSelf.bind(this)} />}
        {this.props.guild.groupID?.length > 0 ? this.renderGuildRoster() : this.renderNoGuild()}
        <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_GUILD} />
      </FactionBorder>
    );
  }

  private renderGuildRoster(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <>
        <div className={RosterHeader}>
          <img className={RosterBanner} src={factionData.flagBlankImage} />
          <div className={RosterHeaderContent}>
            <FactionTitle heightOverrideVmin={15}>
              {this.props.guild.name?.length > 0
                ? this.props.guild.name
                : getStringTableValue(StringIDGeneralUnnamed, this.props.stringTable)}
            </FactionTitle>
            <FactionScrollArea className={RosterMOTDArea} useSmallThumb={true}>
              <div className={RosterMOTDText}>{this.props.guild.motd}</div>
            </FactionScrollArea>
          </div>
          <img className={RosterBanner} src={factionData.flagBlankImage} />
        </div>
        <div className={MemberListSection}>
          <div className={MemberListHeader}>
            <div
              className={`${SortButton} ${MemberNameCell}`}
              onClick={this.shiftSortOrder.bind(this, SortCategory.Name)}
            >
              <div className={LegendText}>
                {getStringTableValue(StringIDGuildsLegendMemberName, this.props.stringTable)}
              </div>
              <img className={this.getSortClassName(SortCategory.Name)} src={factionData.arrowPointerImage} />
            </div>
            <div
              className={`${SortButton} ${MemberLevelCell}`}
              onClick={this.shiftSortOrder.bind(this, SortCategory.Level)}
            >
              <div className={LegendText}>
                {getStringTableValue(StringIDGuildsLegendMemberLevel, this.props.stringTable)}
              </div>
              <img className={this.getSortClassName(SortCategory.Level)} src={factionData.arrowPointerImage} />
            </div>
            <div
              className={`${SortButton} ${MemberClassCell}`}
              onClick={this.shiftSortOrder.bind(this, SortCategory.Class)}
            >
              <div className={LegendText}>
                {getStringTableValue(StringIDGuildsLegendMemberClass, this.props.stringTable)}
              </div>
              <img className={this.getSortClassName(SortCategory.Class)} src={factionData.arrowPointerImage} />
            </div>
            <div
              className={`${SortButton} ${MemberRankCell}`}
              onClick={this.shiftSortOrder.bind(this, SortCategory.Rank)}
            >
              <div className={LegendText}>
                {getStringTableValue(StringIDGuildsLegendMemberRank, this.props.stringTable)}
              </div>
              <img className={this.getSortClassName(SortCategory.Rank)} src={factionData.arrowPointerImage} />
            </div>
          </div>
          <div className={MemberListScrollRegion}>
            <FactionScrollArea className={MemberListScrollArea}>
              <div className={MemberListContent}>{this.getSortedMembers().map(this.renderMemberRow.bind(this))}</div>
            </FactionScrollArea>
            <FactionBorder className={MemberListScrollBorder} type={BorderType.Primary} />
          </div>
        </div>
        {this.renderEditGuildButton()}
      </>
    );
  }

  private renderEditGuildButton(): React.ReactNode {
    // Only render if the user has relevant guild permissions.
    const canEditName = getDoesAccountHaveGuildPermission(
      this.props.self.accountID,
      this.props.guild,
      GroupPermission.ChangeName
    );
    const canEditMOTD = getDoesAccountHaveGuildPermission(
      this.props.self.accountID,
      this.props.guild,
      GroupPermission.ChangeMOTD
    );
    const canEditCrest = getDoesAccountHaveGuildPermission(
      this.props.self.accountID,
      this.props.guild,
      GroupPermission.ChangeCrest
    );
    const canEditRanks = getDoesAccountHaveGuildPermission(
      this.props.self.accountID,
      this.props.guild,
      GroupPermission.ChangeRanks
    );

    if (canEditName || canEditMOTD || canEditCrest || canEditRanks) {
      return (
        <FactionSquareButton
          type={'edit'}
          className={EditGuildButton}
          onClick={() => {
            const params: ModalParams = {
              id: `EditGuild`,
              content: (params: ModalParams) => {
                return <GuildManagementModal />;
              }
            };
            this.props.dispatch(showModal(params));
          }}
        />
      );
    }

    return null;
  }

  private renderMemberRow(member: GuildMember, index: number): React.ReactNode {
    // TODO: We don't currently have access to character data.  We want to be able to show characters eventually.

    const rankData = this.props.guild.ranks[member.rank];

    const idString = `Member${member.accountID}`;

    return (
      <ContextMenuSource
        className={`${MemberListRow}${index % 2 ? ' odd' : ''}`}
        key={idString}
        menuParams={{ id: idString, content: this.buildMemberContextMenu(member) }}
        style={{ cursor: getIsAccountGuildMaster(member.accountID, this.props.guild) ? 'unset' : 'pointer' }}
      >
        <div className={MemberNameCell}>
          <div className={MemberListDataText}>{member.name}</div>
        </div>
        <div className={MemberLevelCell}>
          <div className={MemberListDataText}>
            {getStringTableValue(
              member.isOnline ? StringIDGeneralOnline : StringIDGeneralOffline,
              this.props.stringTable
            )}
          </div>
        </div>
        <div className={MemberClassCell}>
          <div className={MemberListDataText}>{}</div>
        </div>
        <div className={MemberRankCell}>
          <div className={MemberListDataText}>{rankData?.name}</div>
        </div>
      </ContextMenuSource>
    );
  }

  private buildMemberContextMenu(member: GuildMember): ContextMenuItem[] {
    const items: ContextMenuItem[] = [];

    const promotionIsToGuildMaster = member.rank === this.props.guild.ranks.length - 2;
    const canPromote =
      getDoesAccountHaveGuildPermission(this.props.self.accountID, this.props.guild, GroupPermission.Promote) &&
      member.rank < this.props.guild.ranks.length - 1 && // Can't promote past Guild Master.
      (!promotionIsToGuildMaster || getIsAccountGuildMaster(this.props.self.accountID, this.props.guild)); // Only Guild Master can promote new Guild Master.

    const canDemote =
      getDoesAccountHaveGuildPermission(this.props.self.accountID, this.props.guild, GroupPermission.Demote) &&
      member.rank > 0 && // No lower rank than the last one!
      !getIsAccountGuildMaster(member.accountID, this.props.guild); // Can't demote the Guild Master.  Can only promote a new one.

    const canKick =
      getDoesAccountHaveGuildPermission(this.props.self.accountID, this.props.guild, GroupPermission.Kick) &&
      !getIsAccountGuildMaster(member.accountID, this.props.guild);

    if (canPromote) {
      const item: ContextMenuItem = {
        title: getTokenizedStringTableValue(StringIDGuildsPromoteRank, this.props.stringTable, {
          RANK: this.props.guild.ranks[member.rank + 1]?.name ?? ''
        }),
        onClick: (dispatch: AppDispatch) =>
          dispatch(
            callSetGuildRank({ targetID: member.accountID, targetRank: this.props.guild.ranks[member.rank + 1].name })
          )
      };
      items.push(item);
    }

    if (canDemote) {
      const item: ContextMenuItem = {
        title: getTokenizedStringTableValue(StringIDGuildsDemoteRank, this.props.stringTable, {
          RANK: this.props.guild.ranks[member.rank - 1]?.name ?? ''
        }),
        onClick: (dispatch: AppDispatch) =>
          dispatch(
            callSetGuildRank({
              targetID: member.accountID,
              targetRank: this.props.guild.ranks[member.rank - 1]?.name ?? ''
            })
          )
      };
      items.push(item);
    }

    if (canKick) {
      const item: ContextMenuItem = {
        title: getStringTableValue(StringIDUnitFrameContextKickGuild, this.props.stringTable),
        onClick: (dispatch: AppDispatch) => {
          const model: ModalModel = {
            title: getStringTableValue(StringIDGeneralAttention, this.props.stringTable),
            message: getTokenizedStringTableValue(StringIDGuildsConfirmKick, this.props.stringTable, {
              NAME: member.name
            }),
            buttons: [
              {
                text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
                onClick: () => {
                  dispatch(hideModal());
                }
              },
              {
                text: getStringTableValue(StringIDGeneralConfirm, this.props.stringTable),
                onClick: () => {
                  dispatch(hideModal());
                  dispatch(callGuildKick(member.accountID));
                }
              }
            ]
          };

          const params: ModalParams = {
            id: `ConfirmGuildKick`,
            content: model,
            escapable: true,
            maxWidth: '40vmin'
          };
          dispatch(showModal(params));
        }
      };
      items.push(item);
    }

    return items;
  }

  private getSortedMembers(): GuildMember[] {
    let sorted: GuildMember[] = [...this.props.guild.members];
    sorted.sort((a, b) => {
      for (let i = 0; i < this.state.sort.length; ++i) {
        const [category, order] = this.state.sort[i];
        const inverter = order === SortOrder.Descending ? -1 : 1;

        switch (category) {
          case SortCategory.Name: {
            if (a.name !== b.name) {
              return inverter * a.name.localeCompare(b.name);
            }
            break;
          }
          case SortCategory.Class: {
            // TODO: We don't have class data yet!
            break;
          }
          case SortCategory.Level: {
            // TODO: We don't have class data yet!
            break;
          }
          case SortCategory.Rank: {
            if (a.rank !== b.rank) {
              return inverter * (b.rank - a.rank);
            }
            break;
          }
        }
      }

      // Any non-ordered categories are treated as equal.
      return 0;
    });
    return sorted;
  }

  private shiftSortOrder(category: SortCategory): void {
    const [_, order] = this.state.sort.find((e) => e[0] === category) ?? [category, SortOrder.None];
    const nextOrder = (order + 1) % SortOrder.COUNT;

    // Remove the old order from the list.
    let newSort = this.state.sort.filter((e) => e[0] !== category);
    // If the order is not None, add it at the front of the list.  That way we prioritize sorts in the order you click.
    if (nextOrder !== SortOrder.None) {
      newSort.unshift([category, nextOrder]);
    }

    this.setState({ sort: newSort });
  }

  private getSortClassName(category: SortCategory): string {
    const [_, order] = this.state.sort.find((e) => e[0] === category) ?? [category, SortOrder.None];

    return `${SortDirectionIndicator}${order === SortOrder.Ascending ? ' up' : ''}${
      order === SortOrder.Descending ? ' down' : ''
    }`;
  }

  private renderNoGuild(): React.ReactNode {
    return (
      <div className={NoGuildContainer}>
        <FactionDivider />
        <div className={NoGuildMessage}>
          {getStringTableValue(StringIDGuildsNoGuildMessage, this.props.stringTable)}
        </div>
        <div className={NoGuildInstructions}>
          {getStringTableValue(StringIDGuildsNoGuildInstructions, this.props.stringTable)}
        </div>
        <div className={NoGuildCaveats}>{getStringTableValue(StringIDGuildsCaveats, this.props.stringTable)}</div>
        <FactionDivider />
      </div>
    );
  }

  private closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_GUILD));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    guild: state.guild,
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID,
    self: state.entities.self
  };
};

const Guild = connect(mapStateToProps)(AGuild);

export const WIDGET_ID_GUILD = 'Guild';
export const guildRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_GUILD,
  nameStringID: 'HUDEditorWidgetNameGuild',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 11.2,
    yOffset: 11.7
  },
  layer: HUDLayer.Menus,
  requiresGameDefsLoaded: true,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <Guild isDragCopy={isDragCopy} />;
  }
};
