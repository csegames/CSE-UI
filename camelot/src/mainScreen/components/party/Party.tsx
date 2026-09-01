import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import * as React from 'react';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { camelotMocks } from '@csegames/library/dist/camelotunchained/camelotMockData';
import { PartyMemberFrame } from './PartyMemberFrame';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { WarbandSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { getTokenizedStringTableValue } from '../../helpers/stringTableHelpers';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { PartyState } from '../../redux/partySlice';

// CSS classes
const PartyMemberClass = 'HUD-Party-PartyMember';
const HorizontalRoot = 'HUD-Party-HorizontalRoot';
const HorizontalRow = 'HUD-Party-HorizontalRow';
const HorizontalMemberSlot = 'HUD-Party-HorizontalMemberSlot';

const PartyNumberLabel = 'HUD-Party-PartyNumberLabel';
const PartyNumberLabelText = 'HUD-Party-PartyNumberLabelText';
const VerticalPartyNumberLabel = 'HUD-Party-VerticalPartyNumberLabel';
const VerticalPartyNumberLabelText = 'HUD-Party-VerticalPartyNumberLabelText';
const HorizontalPartyNumber = 'HUD-Party-HorizontalPartyNumber';
const HorizontalEmptySlot = 'HUD-Party-HorizontalEmptySlot';

// String IDs
const StringIDWarbandPartyNumber = 'WarbandPartyNumber';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  party: PartyState;
  warband: WarbandSnapshot;
  selectedWidgetID: string | null;
  selectedGroupMemberIDs: string[];
  stringTable: Record<string, StringTableEntryDef>;
  selfCharacterID: string | undefined;
  isWarbandEditMode: boolean;
}

type Props = ReactProps & InjectedProps;

class AParty extends React.Component<Props> {
  render(): React.ReactNode {
    // Treat being edited via the active group (e.g. Social) the same as being selected directly, so
    // selecting either Party or Warband shows both.
    const isSelected =
      this.props.selectedWidgetID === WIDGET_ID_PARTY ||
      this.props.selectedGroupMemberIDs.includes(WIDGET_ID_PARTY);
    const hasWarband = (this.props.warband.groupID?.length ?? 0) > 0;

    // In warband edit mode the warband widget shows all subgroups — hide party to avoid duplication.
    if (hasWarband && this.props.isWarbandEditMode && !isSelected) {
      return null;
    }

    // In a warband (normal mode), render the player's own subgroup using the party UI.
    if (hasWarband) {
      const selfSubgroupIndex = this.getSelfSubgroupIndex();
      const selfSubgroup = selfSubgroupIndex >= 0 ? this.props.warband.subgroups[selfSubgroupIndex] : null;
      if (!selfSubgroup && !isSelected) return null;
      const members = (
        selfSubgroup ? selfSubgroup.members.filter((m) => !!m) : mockData.members
      ) as PartyState['members'];
      const sortedMembers = [...members].sort((a, b) => (b.isLeader ? 1 : 0) - (a.isLeader ? 1 : 0));
      if (this.props.party.isHorizontal) {
        return this.renderHorizontal(sortedMembers, selfSubgroupIndex);
      }
      return this.renderVertical(sortedMembers, selfSubgroupIndex);
    }

    const hasParty = (this.props.party.groupID?.length ?? 0) > 0;
    if (!hasParty && !isSelected) {
      return null;
    }

    const party = hasParty ? this.props.party : mockData;
    const sortedMembers = [...party.members].sort((a, b) => (b.isLeader ? 1 : 0) - (a.isLeader ? 1 : 0));

    if (this.props.party.isHorizontal) {
      return this.renderHorizontal(sortedMembers, -1);
    }

    return this.renderVertical(sortedMembers, -1);
  }

  private renderVertical(members: PartyState['members'], subgroupIndex: number): React.ReactNode {
    const memberList = (
      <>
        {members.map((m) => (
          <div className={PartyMemberClass} key={m.characterID}>
            <PartyMemberFrame memberData={m} hasContextMenu={true} buffPlacement={'right'} />
          </div>
        ))}
      </>
    );

    if (subgroupIndex < 0) return memberList;

    return (
      <>
        <FactionBorder
          className={VerticalPartyNumberLabel}
          type={BorderType.Primary}
          background={BorderBackground.Leather}
          cornerSize='1.5vmin'
        >
          <div className={VerticalPartyNumberLabelText}>
            {getTokenizedStringTableValue(StringIDWarbandPartyNumber, this.props.stringTable, {
              NUMBER: `${subgroupIndex + 1}`
            })}
          </div>
        </FactionBorder>
        {memberList}
      </>
    );
  }

  private renderHorizontal(members: PartyState['members'], subgroupIndex: number): React.ReactNode {
    const row1 = members.slice(0, 4);
    const row2 = members.slice(4, 8);

    const inWarband = subgroupIndex >= 0;
    const memberRows = (
      <div className={HorizontalRoot}>
        <div className={HorizontalRow}>
          {row1.map((m) => (
            <div className={HorizontalMemberSlot} key={m.characterID}>
              <PartyMemberFrame memberData={m} hasContextMenu={true} buffPlacement={'above'} />
            </div>
          ))}
        </div>
        {(row2.length > 0 || inWarband) && (
          <div className={`${HorizontalRow}${inWarband ? ` warband` : ''}`}>
            {row2.map((m) => (
              <div className={HorizontalMemberSlot} key={m.characterID}>
                <PartyMemberFrame memberData={m} hasContextMenu={true} buffPlacement={'below'} />
              </div>
            ))}
            {inWarband &&
              Array.from({ length: row1.length - row2.length }, (_, i) => (
                <div className={HorizontalMemberSlot} key={`empty-${i}`}>
                  <FactionBorder
                    className={HorizontalEmptySlot}
                    type={BorderType.Secondary}
                    background={BorderBackground.PatternLarge}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    );

    if (subgroupIndex < 0) return memberRows;

    return (
      <div className={HorizontalPartyNumber}>
        <FactionBorder
          className={PartyNumberLabel}
          type={BorderType.Primary}
          background={BorderBackground.Leather}
          cornerSize='1.5vmin'
        >
          <div className={PartyNumberLabelText}>
            {getTokenizedStringTableValue(StringIDWarbandPartyNumber, this.props.stringTable, {
              NUMBER: `${subgroupIndex + 1}`
            })}
          </div>
        </FactionBorder>
        {memberRows}
      </div>
    );
  }

  private getSelfSubgroupIndex(): number {
    return this.props.warband.subgroups.findIndex((subgroup) =>
      subgroup?.members?.some((m) => m?.characterID === this.props.selfCharacterID)
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { selectedWidgetID, selectedGroupMemberIDs } = state.hud.editor;

  return {
    ...ownProps,
    party: state.party,
    warband: state.warband,
    selectedWidgetID,
    selectedGroupMemberIDs,
    stringTable: state.stringTable.stringTable,
    selfCharacterID: state.entities.self?.characterID,
    isWarbandEditMode: state.warband.isEditMode
  };
};

const mockData = camelotMocks.createPartySnapshot();
const Party = connect(mapStateToProps)(AParty);

export const WIDGET_ID_PARTY = 'Party';
export const partyRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_PARTY,
  nameStringID: 'HUDEditorWidgetNameParty',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 1,
    yOffset: 20
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <Party isDragCopy={isDragCopy} />;
  }
};
