/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { FactionBorder, BorderType, BorderBackground } from '../FactionBorder';
import { GuildRank, GuildSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/GuildSnapshot';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { hideModal, ModalModel, ModalParams, showModal } from '../../redux/modalsSlice';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralAttention,
  StringIDGeneralCancel,
  StringIDGeneralComingSoon,
  StringIDGeneralDiscard,
  StringIDGeneralError,
  StringIDGeneralSave
} from '../../helpers/stringTableHelpers';
import { GroupPermission } from '@csegames/library/dist/_baseGame/types/GroupPermission';
import { getDoesAccountHaveGuildPermission } from '../../helpers/characterHelpers';
import { TextInput, TextInputType } from '../input/TextInput';
import { FactionButton } from '../FactionButton';
import {
  callCreateGuildRank,
  callDeleteGuildRank,
  callDisableGuildPermission,
  callEnableGuildPermission,
  callRenameGuildRank,
  callSetGuildMOTD,
  callSetGuildName
} from '../../helpers/rest/guildsRestCalls';
import Escapable from '../Escapable';
import { FactionPlusButton } from '../FactionPlusButton';
import { FactionMinusButton } from '../FactionMinusButton';
import { FactionScrollArea } from '../FactionScrollArea';
import { getFactionData } from '../../gameData/factionData';
import { FactionCheckbox } from '../FactionCheckbox';

// CSS classes
const Root = 'HUD-GuildManagementModal-Root';
const NameTitle = 'HUD-GuildManagementModal-NameTitle';
const MOTDTitle = 'HUD-GuildManagementModal-MOTDTitle';
const RanksTitle = 'HUD-GuildManagementModal-RanksTitle';
const CrestTitle = 'HUD-GuildManagementModal-CrestTitle';
const NameInputContainer = 'HUD-GuildManagementModal-NameInputContainer';
const NameInput = 'HUD-GuildManagementModal-NameInput';
const NameInputText = 'HUD-GuildManagementModal-NameInputText';
const MOTDInputContainer = 'HUD-GuildManagementModal-MOTDInputContainer';
const MOTDInput = 'HUD-GuildManagementModal-MOTDInput';
const MOTDInputText = 'HUD-GuildManagementModal-MOTDInputText';
const SaveButton = 'HUD-GuildManagementModal-SaveButton';
const ContentRow = 'HUD-GuildManagementModal-ContentRow';
const RanksSection = 'HUD-GuildManagementModal-RanksSection';
const RanksHeader = 'HUD-GuildManagementModal-RanksHeader';
const AddRankButton = 'HUD-GuildManagementModal-AddRankButton';
const RemoveRankButton = 'HUD-GuildManagementModal-RemoveRankButton';
const RanksListArea = 'HUD-GuildManagementModal-RanksListArea';
const RanksListBorder = 'HUD-GuildManagementModal-RanksListBorder';
const RanksListContainer = 'HUD-GuildManagementModal-RanksListContainer';
const RankRow = 'HUD-GuildManagementModal-RankRow';
const RankRowLabel = 'HUD-GuildManagementModal-RankRowLabel';
const RankDetailsContainer = 'HUD-GuildManagementModal-RankDetailsContainer';
const RankNameInput = 'HUD-GuildManagementModal-RankNameInput';
const RankNameInputText = 'HUD-GuildManagementModal-RankNameInputText';
const RankPermissionsContainer = 'HUD-GuildManagementModal-RankPermissionsContainer';
const RankPermissionContainer = 'HUD-GuildManagementModal-RankPermissionContainer';
const RankPermissionCheckbox = 'HUD-GuildManagementModal-RankPermissionCheckbox';
const RankPermissionLabel = 'HUD-GuildManagementModal-RankPermissionLabel';
const CrestSection = 'HUD-GuildManagementModal-CrestSection';
const CrestContainer = 'HUD-GuildManagementModal-CrestContainer';
const ComingSoonLabel = 'HUD-GuildManagementModal-ComingSoonLabel';

// String IDs
const StringIDGuildsGuildName = 'GuildsGuildName';
const StringIDGuildsMOTD = 'GuildsMOTD';
const StringIDGuildsGuildRanks = 'GuildsGuildRanks';
const StringIDGuildsGuildCrest = 'GuildsGuildCrest';
const StringIDGuildsConfirmDiscardChanges = 'GuildsConfirmDiscardChanges';
const StringIDGuildsPermissionInvite = 'GuildsPermissionInvite';
const StringIDGuildsPermissionRanks = 'GuildsPermissionRanks';
const StringIDGuildsPermissionKick = 'GuildsPermissionKick';
const StringIDGuildsPermissionMOTD = 'GuildsPermissionMOTD';
const StringIDGuildsPermissionPromoteDemote = 'GuildsPermissionPromoteDemote';
const StringIDGuildsErrorAddRankFailedPrefix = 'GuildsErrorAddRankFailed_';
const StringIDGuildsErrorDeleteRankFailedPrefix = 'GuildsErrorDeleteRankFailed_';
const StringIDGuildsErrorGuildRenameFailedPrefix = 'GuildsErrorGuildRenameFailed_';
const StringIDGuildsErrorRankRenameFailedPrefix = 'GuildsErrorRankRenameFailed_';
const StringIDGuildsRankNameGeneric = 'GuildsRankNameGeneric';

interface State {
  guildName: string;
  motdText: string;
  // Note that these are sorted ranks, so opposite of the normal order.
  ranks: GuildRank[];
  selectedRankIndex: number;
  selectedRankName: string;
  selectedRankPermissions: GroupPermission;
}

interface ReactProps {}

interface InjectedProps {
  guild: GuildSnapshot;
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
  self: PlayerEntityStateModel;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AGuildManagementModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    let ranks = this.getSortedRanks();
    this.state = {
      guildName: props.guild.name,
      motdText: props.guild.motd,
      ranks,
      selectedRankIndex: 0,
      selectedRankName: ranks[0].name,
      selectedRankPermissions: ranks[0].permissions
    };
  }

  render(): JSX.Element {
    return (
      <FactionBorder
        className={Root}
        type={BorderType.Decorative}
        background={BorderBackground.Leather}
        cornerButtons={[
          <FactionCornerButton type={CornerButtonType.Close} onClick={this.attemptClose.bind(this)} small />
        ]}
      >
        <Escapable escapeID={`GuildManagementModal`} onEscape={this.attemptClose.bind(this)} />
        {this.renderNameSection()}
        {this.renderMOTDSection()}
        <div className={ContentRow}>
          {this.renderRanksSection()}
          {this.renderCrestSection()}
        </div>
      </FactionBorder>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // If the guild ranks have changed, adjust the sorted ranks to match.
    if (this.props.guild.ranks !== prevProps.guild.ranks) {
      this.setState({ ranks: this.getSortedRanks() });
    }
  }

  private renderNameSection(): React.ReactNode {
    // Only render if the user has relevant guild permissions.
    const canEditName = getDoesAccountHaveGuildPermission(
      this.props.self.accountID,
      this.props.guild,
      GroupPermission.ChangeName
    );

    if (canEditName) {
      return (
        <>
          <div className={NameTitle}>{getStringTableValue(StringIDGuildsGuildName, this.props.stringTable)}</div>
          <FactionBorder
            className={NameInputContainer}
            type={BorderType.Primary}
            background={BorderBackground.PatternLarge}
          >
            <TextInput
              className={NameInput}
              inputClassName={NameInputText}
              type={TextInputType.GroupName}
              value={this.state.guildName}
              setValue={(guildName) => this.setState({ guildName })}
              showLength
              showRules
            />
            <FactionButton
              className={SaveButton}
              widthOverrideVmin={10}
              disabled={this.props.guild.name === this.state.guildName}
              onClick={async () => {
                const result = await this.props.dispatch(callSetGuildName(this.state.guildName));
                if (result?.meta?.requestStatus !== 'fulfilled') {
                  this.props.dispatch(
                    showModal({
                      id: `GuildRenameError`,
                      content: {
                        title: getStringTableValue(StringIDGeneralError, this.props.stringTable),
                        message: getStringTableValue(
                          StringIDGuildsErrorGuildRenameFailedPrefix + (result?.payload?.type ?? 'Unknown'),
                          this.props.stringTable
                        )
                      },
                      maxWidth: '45vmin'
                    })
                  );
                }
              }}
            >
              {getStringTableValue(StringIDGeneralSave, this.props.stringTable)}
            </FactionButton>
          </FactionBorder>
        </>
      );
    } else {
      return null;
    }
  }

  private renderMOTDSection(): React.ReactNode {
    // Only render if the user has relevant guild permissions.
    const canEditMOTD = getDoesAccountHaveGuildPermission(
      this.props.self.accountID,
      this.props.guild,
      GroupPermission.ChangeMOTD
    );

    if (canEditMOTD) {
      return (
        <>
          <div className={MOTDTitle}>{getStringTableValue(StringIDGuildsMOTD, this.props.stringTable)}</div>
          <FactionBorder
            className={MOTDInputContainer}
            type={BorderType.Primary}
            background={BorderBackground.PatternLarge}
          >
            <TextInput
              className={MOTDInput}
              inputClassName={MOTDInputText}
              type={TextInputType.General}
              value={this.state.motdText}
              setValue={(newText) => {
                const pattern: RegExp = /^[\x20-\x7E\n]{0,200}/g;
                const results = newText.match(pattern);
                // If the pattern doesn't match, then the user input an invalid character.
                if (!results || results.length !== 1 || results[0].length !== newText.length) {
                  // The pattern didn't match, so retain the previous value.
                  return;
                }
                this.setState({ motdText: newText });
              }}
              maxLength={200}
              showLength
              multiline
            />
            <FactionButton
              className={SaveButton}
              widthOverrideVmin={10}
              disabled={this.props.guild.motd === this.state.motdText}
              onClick={() => {
                this.props.dispatch(callSetGuildMOTD(this.state.motdText));
              }}
            >
              {getStringTableValue(StringIDGeneralSave, this.props.stringTable)}
            </FactionButton>
          </FactionBorder>
        </>
      );
    } else {
      return null;
    }
  }

  private renderRanksSection(): React.ReactNode {
    // Only render if the user has relevant guild permissions.
    const canEditRanks = getDoesAccountHaveGuildPermission(
      this.props.self.accountID,
      this.props.guild,
      GroupPermission.ChangeRanks
    );

    if (canEditRanks) {
      // TODO: We want to get this value from the server, eventually.
      const canAddRank = this.props.guild.ranks.length < 10;
      // Can't delete the GuildMaster.
      const canRemoveRank = this.state.selectedRankIndex !== 0;

      return (
        <div className={RanksSection}>
          <div className={RanksHeader}>
            <div className={RanksTitle}>{getStringTableValue(StringIDGuildsGuildRanks, this.props.stringTable)}</div>
            <div className={'row'}>
              <FactionPlusButton
                className={AddRankButton}
                disabled={!canAddRank}
                onClick={this.onAddRankClicked.bind(this)}
              />
              <FactionMinusButton
                className={RemoveRankButton}
                disabled={!canRemoveRank}
                onClick={this.onDeleteRankClicked.bind(this)}
              />
            </div>
          </div>
          <div className={RanksListContainer}>
            <FactionScrollArea className={RanksListArea} scrollbarWidth={'1.8vmin'}>
              <div className={RanksListContainer}>{this.state.ranks.map(this.renderRankRow.bind(this))}</div>
            </FactionScrollArea>
            <FactionBorder className={RanksListBorder} type={BorderType.Primary} />
          </div>
          <FactionBorder
            className={RankDetailsContainer}
            type={BorderType.Primary}
            background={BorderBackground.PatternLarge}
            includeTop={false}
          >
            <TextInput
              className={RankNameInput}
              inputClassName={RankNameInputText}
              type={TextInputType.GroupName}
              value={this.state.selectedRankName}
              setValue={(newValue) => this.setState({ selectedRankName: newValue })}
            />
            <div className={RankPermissionsContainer}>
              {this.renderPermissionCheckbox(GroupPermission.Invite, StringIDGuildsPermissionInvite)}
              {this.renderPermissionCheckbox(GroupPermission.ChangeRanks, StringIDGuildsPermissionRanks)}
              {this.renderPermissionCheckbox(GroupPermission.Kick, StringIDGuildsPermissionKick)}
              {this.renderPermissionCheckbox(GroupPermission.ChangeMOTD, StringIDGuildsPermissionMOTD)}
              {this.renderPermissionCheckbox(
                GroupPermission.Promote | GroupPermission.Demote,
                StringIDGuildsPermissionPromoteDemote
              )}
            </div>
            <FactionButton
              className={SaveButton}
              widthOverrideVmin={10}
              disabled={
                this.state.selectedRankName === this.state.ranks[this.state.selectedRankIndex].name &&
                this.state.selectedRankPermissions === this.state.ranks[this.state.selectedRankIndex].permissions
              }
              onClick={async () => {
                let renameFailed = false;
                if (this.state.selectedRankName !== this.state.ranks[this.state.selectedRankIndex].name) {
                  const result = await this.props.dispatch(
                    callRenameGuildRank({
                      currentName: this.state.ranks[this.state.selectedRankIndex].name,
                      newName: this.state.selectedRankName
                    })
                  );
                  if (result?.meta?.requestStatus !== 'fulfilled') {
                    renameFailed = true;
                    this.props.dispatch(
                      showModal({
                        id: `RankRenameError`,
                        content: {
                          title: getStringTableValue(StringIDGeneralError, this.props.stringTable),
                          message: getStringTableValue(
                            StringIDGuildsErrorRankRenameFailedPrefix + (result?.payload?.type ?? 'Unknown'),
                            this.props.stringTable
                          )
                        },
                        maxWidth: '45vmin'
                      })
                    );
                  }
                }
                // We have to ensure that any rename succeeds because the API to edit ranks uses the current name of the rank as an input.
                if (
                  !renameFailed &&
                  this.state.selectedRankPermissions !== this.state.ranks[this.state.selectedRankIndex].permissions
                ) {
                  this.sendPermissionUpdateRequests();
                }
              }}
            >
              {getStringTableValue(StringIDGeneralSave, this.props.stringTable)}
            </FactionButton>
          </FactionBorder>
        </div>
      );
    } else {
      return null;
    }
  }

  private async onAddRankClicked(): Promise<void> {
    const result = await this.props.dispatch(callCreateGuildRank(this.getNewRankName()));
    if (result?.meta?.requestStatus !== 'fulfilled') {
      this.props.dispatch(
        showModal({
          id: `AddRankError`,
          content: {
            title: getStringTableValue(StringIDGeneralError, this.props.stringTable),
            message: getStringTableValue(
              StringIDGuildsErrorAddRankFailedPrefix + (result?.payload?.type ?? 'Unknown'),
              this.props.stringTable
            )
          },
          maxWidth: '45vmin'
        })
      );
    }
  }

  private getNewRankName(): string {
    let i = 'A'.charCodeAt(0);
    let proposedName: string;
    do {
      proposedName = getTokenizedStringTableValue(StringIDGuildsRankNameGeneric, this.props.stringTable, {
        ID: String.fromCharCode(i++)
      });
    } while (this.props.guild.ranks.find((r) => r.name === proposedName));

    return proposedName;
  }

  private async onDeleteRankClicked(): Promise<void> {
    const result = await this.props.dispatch(
      callDeleteGuildRank(this.state.ranks[this.state.selectedRankIndex]?.name ?? '')
    );
    if (result?.meta?.requestStatus !== 'fulfilled') {
      this.props.dispatch(
        showModal({
          id: `DeleteRankError`,
          content: {
            title: getStringTableValue(StringIDGeneralError, this.props.stringTable),
            message: getStringTableValue(
              StringIDGuildsErrorDeleteRankFailedPrefix + (result?.payload?.type ?? 'Unknown'),
              this.props.stringTable
            )
          },
          maxWidth: '45vmin'
        })
      );
    } else {
      // When we delete a rank, deselect it by reselecting GuildMaster (since that one can't be deleted).
      this.setState({
        selectedRankIndex: 0,
        selectedRankName: this.state.ranks[0].name,
        selectedRankPermissions: this.state.ranks[0].permissions
      });
    }
  }

  private sendPermissionUpdateRequests(): void {
    // Iterate the permission flags and see which ones have changes.
    for (let perm = 1; perm < GroupPermission.All; perm = perm << 1) {
      const hasPerm = (this.state.selectedRankPermissions & perm) === perm;
      const hadPerm = (this.state.ranks[this.state.selectedRankIndex].permissions & perm) === perm;

      if (hasPerm !== hadPerm) {
        if (hasPerm) {
          // Add the permission.
          this.props.dispatch(
            callEnableGuildPermission({ rank: this.state.selectedRankName, permission: GroupPermission[perm] })
          );
        } else {
          // Remove the permission.
          this.props.dispatch(
            callDisableGuildPermission({ rank: this.state.selectedRankName, permission: GroupPermission[perm] })
          );
        }
      }
    }
  }

  private renderPermissionCheckbox(permissions: GroupPermission, labelKey: string): React.ReactNode {
    // The GuildMaster's permissions can't be altered.
    const isGuildMasterRank = this.state.selectedRankIndex === 0;

    return (
      <div className={RankPermissionContainer}>
        <FactionCheckbox
          className={RankPermissionCheckbox}
          disabled={isGuildMasterRank}
          isChecked={(this.state.selectedRankPermissions & permissions) === permissions}
          onCheckedChanged={(newIsChecked) => {
            if (newIsChecked) {
              this.setState({ selectedRankPermissions: this.state.selectedRankPermissions | permissions });
            } else {
              this.setState({ selectedRankPermissions: this.state.selectedRankPermissions & ~permissions });
            }
          }}
        />
        <div className={RankPermissionLabel}>{getStringTableValue(labelKey, this.props.stringTable)}</div>
      </div>
    );
  }

  private renderRankRow(rank: GuildRank, index: number): React.ReactNode {
    const isSelected = index === this.state.selectedRankIndex;
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div
        className={`${RankRow}${index % 2 ? ' odd' : ''}`}
        key={index}
        onClick={() =>
          this.setState({
            selectedRankIndex: index,
            selectedRankName: this.state.ranks[index].name,
            selectedRankPermissions: this.state.ranks[index].permissions
          })
        }
      >
        <div className={RankRowLabel} style={isSelected ? { color: factionData.mailSenderColor } : {}}>
          {`${index + 1}. ${rank.name}`}
        </div>
      </div>
    );
  }

  private getSortedRanks(): GuildRank[] {
    const sorted: GuildRank[] = [];

    // We invert the order and make copies so we don't muck the originals.
    this.props.guild.ranks.forEach((rank) => {
      sorted.unshift({ ...rank });
    });

    return sorted;
  }

  private renderCrestSection(): React.ReactNode {
    // Only render if the user has relevant guild permissions.
    const canEditCrest = getDoesAccountHaveGuildPermission(
      this.props.self.accountID,
      this.props.guild,
      GroupPermission.ChangeCrest
    );

    if (canEditCrest) {
      return (
        <div className={CrestSection}>
          <div className={CrestTitle}>{getStringTableValue(StringIDGuildsGuildCrest, this.props.stringTable)}</div>
          <FactionBorder
            className={CrestContainer}
            type={BorderType.Primary}
            background={BorderBackground.PatternLarge}
          >
            <div className={ComingSoonLabel}>
              {getStringTableValue(StringIDGeneralComingSoon, this.props.stringTable)}
            </div>
          </FactionBorder>
        </div>
      );
    } else {
      return null;
    }
  }

  private getHasChanges(): boolean {
    if (this.state.guildName !== this.props.guild.name) {
      return true;
    }

    if (this.state.motdText !== this.props.guild.motd) {
      return true;
    }

    if (this.state.selectedRankPermissions !== this.state.ranks[this.state.selectedRankIndex].permissions) {
      return true;
    }

    return false;
  }

  private attemptClose(): void {
    if (this.getHasChanges()) {
      // Show a discard / keep prompt.
      const model: ModalModel = {
        title: getStringTableValue(StringIDGeneralAttention, this.props.stringTable),
        message: getStringTableValue(StringIDGuildsConfirmDiscardChanges, this.props.stringTable),
        buttons: [
          {
            text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
            // Only closes the prompt.  GuildManagement stays open.
            onClick: () => this.props.dispatch(hideModal())
          },
          {
            text: getStringTableValue(StringIDGeneralDiscard, this.props.stringTable),
            onClick: () => {
              // Close the prompt.
              this.props.dispatch(hideModal());
              // Close GuildManagement as well.
              this.props.dispatch(hideModal());
            }
          }
        ]
      };
      const params: ModalParams = { id: `ConfirmDiscardGuildChanges`, content: model };
      this.props.dispatch(showModal(params));
    } else {
      // No pending changes, close normally.
      this.props.dispatch(hideModal());
    }
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

export const GuildManagementModal = connect(mapStateToProps)(AGuildManagementModal);
