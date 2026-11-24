import HealthBar from '../../../images/unit-frames/unit-frame-health.png';
import LockedHealthBar from '../../../images/unit-frames/unit-frame-health-locked.png';
import ShieldBar from '../../../images/unit-frames/unit-frame-health-shield.png';
import JudgementPipFull from '../../../images/unit-frames/unit-frame-judgement-pip-full.png';
import DeterminationPipFull from '../../../images/unit-frames/unit-frame-determination-pip-full.png';
import Courage from '../../../images/unit-frames/unit-frame-courage.png';
import Mana from '../../../images/unit-frames/unit-frame-mana.png';
import Focus from '../../../images/unit-frames/unit-frame-focus.png';
import Faith from '../../../images/unit-frames/unit-frame-faith.png';
import Determination from '../../../images/unit-frames/unit-frame-determination.png';
import Panic from '../../../images/unit-frames/unit-frame-panic.png';

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import {
  EntityResource,
  isEntityPlayer,
  PlayerEntityStateModel
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  DETERMINATION_BUFF_STRING_ID,
  DETERMINATION_PIP_STACK_THRESHOLDS,
  getNewestStatusInstances,
  getStatusInstanceKey,
  isStatusBuff,
  StatusData,
  StatusInstanceGroup
} from '../../helpers/statusHelpers';
import { StatusEffectsIcon } from '../unitFrames/StatusEffectsIcon';
import { ClassIconTooltip } from '../unitFrames/ClassIconTooltip';
import ContextMenuSource from '../ContextMenuSource';
import { ContextMenuItem, ContextMenuParams } from '../../redux/contextMenuSlice';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { FactionBorder, BorderType, BorderBackground } from '../FactionBorder';
import { getFactionData, FactionData } from '../../gameData/factionData';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { WarbandMember } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { PartyMember } from '@csegames/library/dist/camelotunchained/game/GameClientModels/PartySnapshot';
import {
  getIsCharacterDeputy,
  getIsCharacterLeader,
  getLockedResourceRatio,
  getShieldRatio,
  getUnitFrameContextMenuItems
} from '../../helpers/characterHelpers';
import { WarbandState } from '../../redux/warbandSlice';
import { PartyState } from '../../redux/partySlice';
import { GuildSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/GuildSnapshot';
import { Friend } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { StatusState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/StatusState';
import { getTagFromString, tagsMatch, TagVeilPlane } from '../../helpers/tagHelpers';
import { ClassIconSize, getClassIconSize } from '../../helpers/classIconHelpers';

// CSS classes
const Root = 'HUD-PartyMemberFrame-Root';
const FrameContent = 'HUD-PartyMemberFrame-FrameContent';
const OfflineClass = 'HUD-PartyMemberFrame-FrameContent--offline';
const HealthBarContainer = 'HUD-PartyMemberFrame-HealthBarContainer';
const HealthResourceBar = 'HUD-PartyMemberFrame-HealthResourceBar';
const LockedHealthResourceBar = 'HUD-PartyMemberFrame-LockedHealthResourceBar';
const ShieldResourceBar = 'HUD-PartyMemberFrame-ShieldResourceBar';
const SecondaryResourceContainer = 'HUD-PartyMemberFrame-SecondaryResourceContainer';
const SecondaryResourceBar = 'HUD-PartyMemberFrame-SecondaryResourceBar';
const ZoneOverlay = 'HUD-PartyMemberFrame-ZoneOverlay';
const VeilOverlay = 'HUD-PartyMemberFrame-VeilOverlay';
const ClassIcon = 'HUD-PartyMemberFrame-ClassIcon';
const PanicContainer = 'HUD-PartyMemberFrame-PanicContainer';
const PanicBar = 'HUD-PartyMemberFrame-PanicBar';
const PanicMarker = 'HUD-PartyMemberFrame-PanicMarker';
const NameLabel = 'HUD-PartyMemberFrame-NameLabel';
const TitleLabel = 'HUD-PartyMemberFrame-TitleLabel';
const OfflineLabel = 'HUD-PartyMemberFrame-OfflineLabel';
const HealthMarker = 'HUD-PartyMemberFrame-HealthMarker';
const LockedHealthMarker = 'HUD-PartyMemberFrame-LockedHealthMarker';
const ShieldMarker = 'HUD-PartyMemberFrame-ShieldMarker';
const SecondaryMarker = 'HUD-PartyMemberFrame-SecondaryMarker';
const ResourcePips = 'HUD-PartyMemberFrame-ResourcePips';
const ResourcePip = 'HUD-PartyMemberFrame-ResourcePip';
const ResourcePipContent = 'HUD-PartyMemberFrame-ResourcePipContent';
const ResourcePipBackground = 'HUD-PartyMemberFrame-ResourcePipBackground';
const ResourcePipFill = 'HUD-PartyMemberFrame-ResourcePipFill';
const BuffContainer = 'HUD-PartyMemberFrame-BuffContainer';
const BuffRow = 'HUD-PartyMemberFrame-BuffRow';
const BuffOverflow = 'HUD-PartyMemberFrame-BuffOverflow';
const RoleIndicator = 'HUD-PartyMemberFrame-RoleIndicator';
const TargetBorder = 'HUD-PartyMemberFrame-TargetBorder';
// Tags
const TagUIHidden = 'UI.Hidden';

// String IDs
const StringIDUnitFrameCorpse = 'UnitFrameCorpse';
const StringIDUnitFrameOffline = 'UnitFrameOffline';
const StringIDUnitFramePartyLeader = 'UnitFramePartyLeader';
const StringIDUnitFrameWarbandDeputy = 'UnitFrameWarbandDeputy';

interface ReactProps {
  memberData: PartyMember | WarbandMember;
  hasContextMenu: boolean;
  buffPlacement?: 'right' | 'above' | 'below';
}

interface InjectedProps {
  entity: PlayerEntityStateModel | undefined;
  statuses: Record<string, StatusState>;
  statusInstanceCounts: Record<number, number>;
  resources: Record<string, EntityResource>;
  defs: GameDefsState;
  stringTable: Record<string, StringTableEntryDef>;
  factionData: FactionData;
  determinationBuffNumericId: number;
  warband: WarbandState;
  party: PartyState;
  selfAccountID: string;
  selfCharacterID: string;
  selfFaction: Faction;
  selfGroupID: string;
  selfGuildID: string;
  guild: GuildSnapshot;
  friends: (Friend | null)[] | null;
  isTargeted: boolean;
  classIconSize: ClassIconSize;
}

type Props = ReactProps & InjectedProps;

class APartyMemberFrame extends React.Component<Props> {
  render(): JSX.Element {
    const classDef = this.props.defs.classesByNumericID[this.props.memberData.classID];
    const entity = this.props.entity;

    const health = this.props.resources[EntityResourceIDs.Health];
    const shield = this.props.resources[EntityResourceIDs.Shield];
    const courage = this.props.resources[EntityResourceIDs.Courage];
    const mana = this.props.resources[EntityResourceIDs.Mana];
    const focus = this.props.resources[EntityResourceIDs.Focus];
    const faith = this.props.resources[EntityResourceIDs.Faith];
    const determination = this.props.resources[EntityResourceIDs.Determination];
    const judgement = this.props.resources[EntityResourceIDs.Judgement];
    const panic = this.props.resources[EntityResourceIDs.Panic];

    const healthRatio = health ? health.current / health.max : 0;
    const lockedHealthRatio = health ? getLockedResourceRatio(health) : 0;
    const shieldRatio = health && shield ? getShieldRatio(shield, health) : 0;
    const courageRatio = courage ? courage.current / courage.max : 0;
    const manaRatio = mana ? mana.current / mana.max : 0;
    const focusRatio = focus ? focus.current / focus.max : 0;
    const faithRatio = faith ? faith.current / faith.max : 0;
    const determinationRatio = determination ? determination.current / determination.max : 0;
    const panicRatio = panic ? panic.current / panic.max : 0;

    const determinationStacks = this.getDeterminationStacks();

    const isDead = entity ? !entity.isAlive : false;
    const isInVeil =
      !!entity && tagsMatch(entity.tags, [getTagFromString(TagVeilPlane, this.props.defs.tagAffixIDByStringID)]);

    const isLeader = getIsCharacterLeader(this.props.memberData.characterID, this.props.party, this.props.warband);
    const isDeputy = getIsCharacterDeputy(this.props.memberData.characterID, this.props.party, this.props.warband);
    const isInZone = !!this.props.entity;
    const isInWarband = (this.props.warband.groupID?.length ?? 0) > 0;
    const shouldShowRoleIndicator = isInWarband;
    const shouldHideRoleTitles = isInWarband;
    const shouldHideBuffs = isInWarband;

    const buffs: StatusData[] = [];
    const debuffs: StatusData[] = [];
    if (entity && !shouldHideBuffs) {
      const statusInstances = getNewestStatusInstances(
        Object.values(this.props.statuses),
        this.props.statusInstanceCounts
      );
      statusInstances.forEach((status: StatusInstanceGroup) => {
        const def = this.props.defs.statusesByNumericID[status.id];
        if (!def || status.isDisabled) return;
        if (!def.showInHUD && !def.showOnAdd && !def.showOnInactive && !def.showOnRemove) return;
        if (def.statusTags.includes(TagUIHidden)) return;
        const data: StatusData = { ...def, ...status };
        if (isStatusBuff(data)) buffs.push(data);
        else debuffs.push(data);
      });
    }
    const titleText = isDead
      ? getStringTableValue(StringIDUnitFrameCorpse, this.props.stringTable)
      : !shouldHideRoleTitles && isLeader
      ? getStringTableValue(StringIDUnitFramePartyLeader, this.props.stringTable)
      : !shouldHideRoleTitles && isDeputy
      ? getStringTableValue(StringIDUnitFrameWarbandDeputy, this.props.stringTable)
      : null;

    const frameClasses = [FrameContent, !this.props.memberData.isOnline ? OfflineClass : ''].filter(Boolean).join(' ');

    return (
      <ContextMenuSource className={Root} onClick={this.onTarget.bind(this)} menuParams={this.buildContextMenuParams()}>
        <FactionBorder className={frameClasses} type={BorderType.Secondary} background={BorderBackground.PatternLarge}>
          {/* Health and secondary bars — hidden when offline */}
          {this.props.memberData.isOnline && (
            <>
              <div className={HealthBarContainer}>
                {lockedHealthRatio > 0 && (
                  <>
                    <img
                      className={LockedHealthResourceBar}
                      src={LockedHealthBar}
                      style={{ width: `${lockedHealthRatio * 100}%` }}
                    />
                    <div
                      className={`${HealthMarker} ${LockedHealthMarker}`}
                      style={{ left: `${(1 - lockedHealthRatio) * 100}%` }}
                    />
                  </>
                )}
                <img className={HealthResourceBar} src={HealthBar} style={{ width: `${healthRatio * 100}%` }} />
                {shieldRatio > 0 && (
                  <>
                    <img className={ShieldResourceBar} src={ShieldBar} style={{ width: `${shieldRatio * 100}%` }} />
                    <div
                      className={`${HealthMarker} ${ShieldMarker}`}
                      style={{ right: `${(1 - shieldRatio) * 100}%` }}
                    />
                  </>
                )}
                {healthRatio > 0 && (
                  <div className={HealthMarker} style={{ right: `calc(100% - ${healthRatio * 100}%)` }} />
                )}
              </div>

              <div className={SecondaryResourceContainer}>
                {courage && (
                  <img className={SecondaryResourceBar} src={Courage} style={{ width: `${courageRatio * 100}%` }} />
                )}
                {courage && courageRatio > 0 && (
                  <div className={SecondaryMarker} style={{ right: `calc(100% - ${courageRatio * 100}%)` }} />
                )}
                {mana && <img className={SecondaryResourceBar} src={Mana} style={{ width: `${manaRatio * 100}%` }} />}
                {mana && manaRatio > 0 && (
                  <div className={SecondaryMarker} style={{ right: `calc(100% - ${manaRatio * 100}%)` }} />
                )}
                {focus && (
                  <img className={SecondaryResourceBar} src={Focus} style={{ width: `${focusRatio * 100}%` }} />
                )}
                {focus && focusRatio > 0 && (
                  <div className={SecondaryMarker} style={{ right: `calc(100% - ${focusRatio * 100}%)` }} />
                )}
                {faith && (
                  <img className={SecondaryResourceBar} src={Faith} style={{ width: `${faithRatio * 100}%` }} />
                )}
                {faith && faithRatio > 0 && (
                  <div className={SecondaryMarker} style={{ right: `calc(100% - ${faithRatio * 100}%)` }} />
                )}
                {determination && (
                  <img
                    className={SecondaryResourceBar}
                    src={Determination}
                    style={{ width: `${determinationRatio * 100}%` }}
                  />
                )}
                {determination && determinationRatio > 0 && (
                  <div className={SecondaryMarker} style={{ right: `calc(100% - ${determinationRatio * 100}%)` }} />
                )}
              </div>

              {/* Determination pips */}
              {determination && (
                <div className={ResourcePips}>
                  {DETERMINATION_PIP_STACK_THRESHOLDS.map((threshold, i) =>
                    this.renderResourcePip(i, determinationStacks >= threshold, DeterminationPipFull)
                  )}
                </div>
              )}

              {/* Judgement pips */}
              {judgement && (
                <div className={ResourcePips}>
                  {Array.from({ length: judgement.max }, (_, i) =>
                    this.renderResourcePip(i, judgement.current >= i + 1, JudgementPipFull)
                  )}
                </div>
              )}

              {/* Buff / debuff icons */}
              {!shouldHideBuffs && (buffs.length > 0 || debuffs.length > 0) && (
                <div className={`${BuffContainer} ${this.props.buffPlacement ?? 'right'}`}>
                  <div className={BuffRow}>
                    {buffs.slice(0, 8).map((data) => (
                      <StatusEffectsIcon
                        key={getStatusInstanceKey(data)}
                        statusData={data}
                        entityID={this.props.memberData.entityID}
                      />
                    ))}
                    {buffs.length > 8 && <span className={BuffOverflow}>{'+'}</span>}
                  </div>
                  <div className={`${BuffRow} debuffs`}>
                    {debuffs.slice(0, 8).map((data) => (
                      <StatusEffectsIcon
                        key={getStatusInstanceKey(data)}
                        statusData={data}
                        entityID={this.props.memberData.entityID}
                      />
                    ))}
                    {debuffs.length > 8 && <span className={`${BuffOverflow} debuff`}>{'+'}</span>}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Class icon */}
          {classDef && (
            <img
              className={ClassIcon}
              src={
                this.props.classIconSize === 'small' ? classDef.unitFrameIconSmallImage : classDef.unitFrameIconImage
              }
            />
          )}

          {/* Panic bar — after class icon so it layers on top without needing z-index */}
          {this.props.memberData.isOnline && panic && (
            <div className={PanicContainer}>
              <img className={PanicBar} src={Panic} style={{ height: `${panicRatio * 100}%` }} />
              {panicRatio > 0 && <div className={PanicMarker} style={{ top: `calc(100% - ${panicRatio * 100}%)` }} />}
            </div>
          )}

          {/* Overlays render before the name so name/title sit above them */}
          {this.props.memberData.isOnline && !isInZone && <div className={ZoneOverlay} />}
          {isInVeil && <div className={VeilOverlay} />}

          {/* Name */}
          <div className={NameLabel}>
            {shouldShowRoleIndicator && isLeader && <span className={`${RoleIndicator} leader`}>◆ </span>}
            {shouldShowRoleIndicator && isDeputy && !isLeader && <span className={`${RoleIndicator} deputy`}>■ </span>}
            {this.props.memberData.name}
          </div>

          {/* Title row — shows Offline, Leader, or Deputy */}
          {!this.props.memberData.isOnline ? (
            <div className={OfflineLabel}>{getStringTableValue(StringIDUnitFrameOffline, this.props.stringTable)}</div>
          ) : (
            titleText && <div className={TitleLabel}>{titleText}</div>
          )}

          {/* Last so the overlays above don't cover it */}
          {classDef && (
            <ClassIconTooltip
              className={ClassIcon}
              tooltipID={`PartyMemberClass_${this.props.memberData.characterID}`}
              classDef={classDef}
              stringTable={this.props.stringTable}
            />
          )}
        </FactionBorder>
        {this.props.isTargeted && (
          <div className={TargetBorder} style={{ color: this.props.factionData.targetBorderColor }} />
        )}
      </ContextMenuSource>
    );
  }

  private buildContextMenuParams(): ContextMenuParams | undefined {
    if (!this.props.hasContextMenu) {
      // When in Warband edit mode, you can only drag characters around, not open their menu.
      // The menu is expensive, so this is a decent performance improvement.
      return undefined;
    }

    const items: ContextMenuItem[] = getUnitFrameContextMenuItems(
      this.props.party,
      this.props.warband,
      this.props.stringTable,
      this.props.selfAccountID,
      this.props.selfCharacterID,
      this.props.selfFaction,
      this.props.selfGuildID,
      this.props.guild,
      this.props.friends,
      this.props.entity?.entityID ?? '',
      this.props.entity?.accountID ?? '',
      this.props.memberData.characterID,
      this.props.selfGroupID,
      this.props.selfFaction,
      this.props.entity?.guildID
    );

    const menuParams: ContextMenuParams | undefined =
      (items?.length ?? 0) > 0 ? { id: `PartyMember_${this.props.memberData.entityID}`, content: items! } : undefined;

    return menuParams;
  }

  private onTarget(): void {
    clientAPI.requestFriendlyTarget(this.props.memberData.entityID);
  }

  private getDeterminationStacks(): number {
    return this.props.statusInstanceCounts[this.props.determinationBuffNumericId] ?? 0;
  }

  private renderResourcePip(pipIndex: number, isFull: boolean, fillImage: string): JSX.Element {
    return (
      <div key={pipIndex} className={ResourcePip}>
        <div className={ResourcePipContent}>
          <img className={ResourcePipBackground} src={this.props.factionData.unitFrameResourcePipBackground} />
          <img className={`${ResourcePipFill}${isFull ? ' full' : ''}`} src={fillImage} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const rawEntity = state.entities.entities[ownProps.memberData.entityID];

  return {
    ...ownProps,
    defs: state.gameDefs,
    entity: isEntityPlayer(rawEntity) ? rawEntity : undefined,
    statusInstanceCounts: state.entities.entityStatusInstanceCounts[rawEntity?.entityID] ?? {},
    statuses: state.entities.entityStatuses[rawEntity?.entityID] ?? {},
    resources: state.entities.entityResources[rawEntity?.entityID] ?? {},
    stringTable: state.stringTable.stringTable,
    factionData: getFactionData(state.hud.uiFactionID),
    determinationBuffNumericId: state.gameDefs.statusesByStringID?.[DETERMINATION_BUFF_STRING_ID]?.numericID,
    warband: state.warband,
    party: state.party,
    selfAccountID: state.entities.self?.accountID ?? '',
    selfCharacterID: state.entities.self?.characterID ?? '',
    selfFaction: state.entities.self?.faction ?? Faction.Factionless,
    selfGroupID: state.entities.self?.groupID ?? '',
    selfGuildID: state.entities.self?.guildID ?? '',
    guild: state.guild,
    friends: state.social.friends.friends,
    isTargeted: !!state.entities.friendlyTargetID && ownProps.memberData.entityID === state.entities.friendlyTargetID,
    classIconSize: getClassIconSize(state.hud.vminPx)
  };
};

export const PartyMemberFrame = connect(mapStateToProps)(APartyMemberFrame);
