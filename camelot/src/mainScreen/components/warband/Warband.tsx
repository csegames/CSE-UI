// Images are imported so that WebPack can find them (and give us errors if they are missing).
import WarbandEditIconURL from '../../../images/warband/warband-edit.png';

import * as React from 'react';
import { RootState, AddDispatch } from '../../redux/store';
import { connect } from 'react-redux';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  WarbandMember,
  WarbandSnapshot,
  WarbandSubgroup
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { getFactionData } from '../../gameData/factionData';
import { camelotMocks } from '@csegames/library/dist/camelotunchained/camelotMockData';
import { getStringTableValue, getTokenizedStringTableValue } from '../../helpers/stringTableHelpers';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { getIsCharacterDeputy, getIsCharacterLeader } from '../../helpers/characterHelpers';
import { PartyState } from '../../redux/partySlice';
import Draggable from '../Draggable';
import DraggableHandle, { DropHandlerDraggableData } from '../DraggableHandle';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import DropTarget from '../DropTarget';
import { callSetWarbandGroup, callSwapWarbandMembers } from '../../helpers/rest/warbandsRestCalls';
import { setIsEditMode } from '../../redux/warbandSlice';
import { ModalModel, ModalParams, showModal } from '../../redux/modalsSlice';
import { PartyInviteDialog } from '../party/PartyInviteDialog';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { PartyMemberFrame } from '../party/PartyMemberFrame';

// CSS classes
const Root = 'HUD-Warband-Root';
const DraggableMemberRoot = 'HUD-Warband-DraggableMemberRoot';
const PlayerAddLabel = 'HUD-Warband-PlayerAddLabel';
const MemberDraggableHandle = 'HUD-Warband-MemberDraggableHandle';
const MemberDropTarget = 'HUD-Warband-MemberDropTarget';
const WarbandNormalContainer = 'HUD-Warband-NormalContainer';
const WarbandNormalTabIcon = 'HUD-Warband-NormalTabIcon';
const WarbandNormalRow = 'HUD-Warband-NormalRow';
const WarbandNormalLabelsColumn = 'HUD-Warband-NormalLabelsColumn';
const WarbandNormalSubgroup = 'HUD-Warband-NormalSubgroup';
const WarbandNormalSubgroupLabel = 'HUD-Warband-NormalSubgroupLabel';
const WarbandNormalMemberGrid = 'HUD-Warband-NormalMemberGrid';
const WarbandNormalColumn = 'HUD-Warband-NormalColumn';
const WarbandNormalColumnSlot = 'HUD-Warband-NormalColumnSlot';
const WarbandNormalEmptySlot = 'HUD-Warband-NormalEmptySlot';
const WarbandNormalTab = 'HUD-Warband-NormalTab';
const WarbandNormalTabRow = 'HUD-Warband-NormalTabRow';
const WarbandNormalTabTitle = 'HUD-Warband-NormalTabTitle';
const WarbandNormalTabTitleText = 'HUD-Warband-NormalTabTitleText';

// String IDs
const StringIDWarbandPartyNumber = 'WarbandPartyNumber';
const StringIDUnitFrameContextInviteWarband = 'UnitFrameContextInviteWarband';
const StringIDWarbandTitle = 'HUDEditorWidgetNameWarband';

const WARBAND_MAX_SUBGROUPS = 5;

const DropTypeMember = 'WarbandMember';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  warband: WarbandSnapshot;
  party: PartyState;
  selfCharacterID: string;
  selectedWidgetID: string | null;
  selectedGroupMemberIDs: string[];
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  currentDraggableID: string;
  isEditMode: boolean;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AWarband extends React.Component<Props> {
  render(): React.ReactNode {
    if (Object.keys(this.props.stringTable).length === 0) {
      return null;
    }

    // Treat being edited via the active group (e.g. Social) the same as being selected directly, so
    // selecting either Party or Warband shows both.
    const isSelected =
      this.props.selectedWidgetID === WIDGET_ID_WARBAND ||
      this.props.selectedGroupMemberIDs.includes(WIDGET_ID_WARBAND);
    const hasWarband = this.props.warband.groupID?.length > 0;
    if (!hasWarband && !isSelected) {
      return null;
    }

    const warband = hasWarband ? this.props.warband : mockData;

    return (
      <div className={Root}>
        {this.renderNormalTab()}
        {this.renderSubgroups(warband)}
      </div>
    );
  }

  private renderSubgroups(warband: WarbandSnapshot): React.ReactNode {
    const selfSubgroupIndex = this.getSelfSubgroupIndex(warband);
    let subgroupsToShow: { subgroup: WarbandSubgroup; index: number }[] = [];
    for (let index = 0; index < WARBAND_MAX_SUBGROUPS; ++index) {
      let subgroup = warband.subgroups[index] ?? { members: [] };
      if (
        this.props.isEditMode || // In edit mode, we show all subgroups and cells.
        (index !== selfSubgroupIndex && // Otherwise, your own group is rendered in the Party widget (and thus not here),
          subgroup.members.length > 0) // and empty groups are hidden to save space.
      ) {
        subgroupsToShow.push({ subgroup, index });
      }
    }

    if (subgroupsToShow.length === 0) {
      return null;
    }

    return (
      <div className={WarbandNormalRow}>
        <FactionBorder
          className={WarbandNormalLabelsColumn}
          type={BorderType.Primary}
          background={BorderBackground.Leather}
          cornerSize='1.5vmin'
        >
          {subgroupsToShow.map(({ index }) => (
            <div className={WarbandNormalSubgroupLabel} key={index}>
              {getTokenizedStringTableValue(StringIDWarbandPartyNumber, this.props.stringTable, {
                NUMBER: `${index + 1}`
              })}
            </div>
          ))}
        </FactionBorder>
        <div className={WarbandNormalContainer}>
          {subgroupsToShow.map(({ subgroup, index }) => this.renderNormalSubgroup(subgroup, index))}
        </div>
      </div>
    );
  }

  private renderNormalTab(): React.ReactNode {
    const canArrangeGroups =
      getIsCharacterLeader(this.props.selfCharacterID, this.props.party, this.props.warband) ||
      getIsCharacterDeputy(this.props.selfCharacterID, this.props.party, this.props.warband);

    return (
      <div className={WarbandNormalTabRow}>
        {canArrangeGroups && (
          <FactionBorder
            className={WarbandNormalTab}
            type={BorderType.Secondary}
            background={BorderBackground.PatternLarge}
            cornerSize='1vmin'
            onClick={() => this.props.dispatch(setIsEditMode(!this.props.isEditMode))}
          >
            <img className={WarbandNormalTabIcon} src={WarbandEditIconURL} />
          </FactionBorder>
        )}
        <FactionBorder
          className={WarbandNormalTabTitle}
          type={BorderType.Secondary}
          background={BorderBackground.PatternLarge}
          cornerSize='1vmin'
        >
          <div className={WarbandNormalTabTitleText}>
            {getStringTableValue(StringIDWarbandTitle, this.props.stringTable) || 'Warband'}
          </div>
        </FactionBorder>
      </div>
    );
  }

  private renderNormalSubgroup(subgroup: WarbandSubgroup, index: number): React.ReactNode {
    const MAX_COLUMNS = 4;
    const ROWS_PER_COLUMN = 2;
    const columnPairs: { top: WarbandMember | null; bottom: WarbandMember | null; colIndex: number }[] = [];
    for (let col = 0; col < MAX_COLUMNS; col++) {
      const top = subgroup.members[col * ROWS_PER_COLUMN] ?? null;
      const bottom = subgroup.members[col * ROWS_PER_COLUMN + 1] ?? null;
      if (top || bottom || this.props.isEditMode) {
        columnPairs.push({ top, bottom, colIndex: col });
      }
    }

    return (
      <div className={WarbandNormalSubgroup} key={index}>
        <div className={WarbandNormalMemberGrid}>
          {columnPairs.map(({ top, bottom, colIndex }) => (
            <div className={WarbandNormalColumn} key={colIndex}>
              <div className={WarbandNormalColumnSlot}>
                {this.renderMemberSlot(top, index, colIndex * ROWS_PER_COLUMN)}
              </div>
              <div className={WarbandNormalColumnSlot}>
                {this.renderMemberSlot(bottom, index, colIndex * ROWS_PER_COLUMN + 1)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  private renderMemberSlot(member: WarbandMember | null, subgroupIndex: number, slotIndex: number): React.ReactNode {
    if (member) {
      return this.renderMember(member, subgroupIndex, slotIndex);
    } else {
      return this.renderEmptySlot(member, subgroupIndex, slotIndex);
    }
  }

  private renderMember(member: WarbandMember, subgroupIndex: number, slotIndex: number): React.ReactNode {
    if (!this.props.isEditMode) {
      return this.renderNormalMember(member);
    } else {
      const draggableID = `Member${member?.characterID}`;
      return (
        <Draggable
          key={`${subgroupIndex}-${slotIndex}`}
          draggableID={draggableID}
          className={DraggableMemberRoot}
          draggingRender={this.renderDraggingMember.bind(this, member)}
        >
          <DropTarget
            className={MemberDropTarget}
            dropType={DropTypeMember}
            dropData={{ groupIndex: subgroupIndex, slotIndex, characterID: member?.characterID }}
          />
          {this.renderNormalMember(member)}
          {!this.props.currentDraggableID && (
            <DraggableHandle
              className={MemberDraggableHandle}
              draggableID={draggableID}
              dropType={DropTypeMember}
              dropHandler={this.onMemberDropped.bind(this, subgroupIndex, slotIndex, member.characterID)}
              dragStartHandler={this.onMemberDragStarted.bind(this)}
            ></DraggableHandle>
          )}
        </Draggable>
      );
    }
  }

  private renderEmptySlot(member: WarbandMember | null, subgroupIndex: number, slotIndex: number): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const canSendInvitations =
      this.props.isEditMode &&
      (getIsCharacterLeader(this.props.selfCharacterID, this.props.party, this.props.warband) ||
        getIsCharacterDeputy(this.props.selfCharacterID, this.props.party, this.props.warband));

    return (
      <FactionBorder
        key={`${subgroupIndex}-${slotIndex}`}
        className={WarbandNormalEmptySlot}
        type={BorderType.Secondary}
        background={BorderBackground.PatternLarge}
      >
        {canSendInvitations && (
          <div
            className={PlayerAddLabel}
            style={{ color: factionData.borderColor }}
            onClick={this.onStartInvitesClicked.bind(this)}
          >
            {'+'}
          </div>
        )}
        {this.props.isEditMode && (
          <DropTarget
            className={MemberDropTarget}
            dropType={DropTypeMember}
            dropData={{ groupIndex: subgroupIndex, slotIndex, characterID: member?.characterID }}
            onClick={!member ? this.onStartInvitesClicked.bind(this) : undefined}
          />
        )}
      </FactionBorder>
    );
  }

  private renderNormalMember(member: WarbandMember): React.ReactNode {
    return <PartyMemberFrame memberData={member} hasContextMenu={true} />;
  }

  private renderDraggingMember(member: WarbandMember): React.ReactNode {
    return (
      <div className={WarbandNormalColumnSlot}>
        <PartyMemberFrame memberData={member} hasContextMenu={true} />
      </div>
    );
  }

  private getSelfSubgroupIndex(warband: WarbandSnapshot): number {
    return warband.subgroups.findIndex((subgroup) =>
      subgroup?.members?.some((m) => m?.characterID === this.props.selfCharacterID)
    );
  }

  private onMemberDropped(
    sourceGroupIndex: number,
    sourceMemberIndex: number,
    memberCharacterID: string,
    targetData: { groupIndex: number; slotIndex: number; characterID: string },
    { currentDraggableID }: DropHandlerDraggableData
  ): void {
    // Do nothing if we didn't drop onto a valid slot.
    if (!targetData) {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_BAD_DROP);
      return;
    }

    // TODO: Once we can support member slot retention, we'll need to change these calls to the new API.

    if (targetData.characterID?.length > 0) {
      // Dropped onto a full slot, so swap the members.
      this.props.dispatch(callSwapWarbandMembers({ targetID0: memberCharacterID, targetID1: targetData.characterID }));
    } else {
      // Dropped into an empty slot, so just shift the member into that group.
      this.props.dispatch(callSetWarbandGroup({ targetID: memberCharacterID, targetSubgroup: targetData.groupIndex }));
    }
  }

  private onMemberDragStarted(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_SELECT);
  }

  private onStartInvitesClicked(): void {
    const model: ModalModel = {
      title: getStringTableValue(StringIDUnitFrameContextInviteWarband, this.props.stringTable),
      message: '',
      body: <PartyInviteDialog />,
      buttons: []
    };

    const params: ModalParams = {
      id: `WarbandSendInvites`,
      content: model,
      escapable: true
    };

    this.props.dispatch(showModal(params));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { selectedWidgetID, selectedGroupMemberIDs } = state.hud.editor;

  return {
    ...ownProps,
    warband: state.warband,
    party: state.party,
    selfCharacterID: state.entities.self?.characterID ?? '',
    uiFactionID: state.hud.uiFactionID,
    selectedWidgetID,
    selectedGroupMemberIDs,
    stringTable: state.stringTable.stringTable,
    currentDraggableID: state.dragAndDrop.currentDraggableID,
    isEditMode: state.warband.isEditMode
  };
};

const mockData = camelotMocks.createWarbandSnapshot();
const Warband = connect(mapStateToProps)(AWarband);

export const WIDGET_ID_WARBAND = 'Warband';
export const warbandRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_WARBAND,
  nameStringID: 'HUDEditorWidgetNameWarband',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 0,
    yOffset: 50
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <Warband isDragCopy={isDragCopy} />;
  }
};
