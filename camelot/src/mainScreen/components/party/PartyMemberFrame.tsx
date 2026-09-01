import HealthBar from '../../../images/unit-frames/unit-frame-health.png';
import JudgementPipFull from '../../../images/unit-frames/unit-frame-judgement-pip-full.png';
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
import { EntityResource } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import {
  isPlayerEntityWithStatusInstanceCounts,
  PlayerEntityStateModelWithStatusInstanceCounts
} from '../../redux/entitiesSlice';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  DETERMINATION_BUFF_STRING_ID,
  getNewestStatusInstances,
  getStatusInstanceKey,
  isStatusBuff,
  StatusData,
  StatusInstanceGroup
} from '../../helpers/statusHelpers';
import { StatusEffectsIcon } from '../unitFrames/StatusEffectsIcon';
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
  getUnitFrameContextMenuItems
} from '../../helpers/characterHelpers';
import { WarbandState } from '../../redux/warbandSlice';
import { PartyState } from '../../redux/partySlice';
import { GuildSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/GuildSnapshot';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';

// CSS classes
const Root = 'HUD-PartyMemberFrame-Root';
const FrameContent = 'HUD-PartyMemberFrame-FrameContent';
const OfflineClass = 'HUD-PartyMemberFrame-FrameContent--offline';
const HealthBarContainer = 'HUD-PartyMemberFrame-HealthBarContainer';
const HealthResourceBar = 'HUD-PartyMemberFrame-HealthResourceBar';
const SecondaryResourceContainer = 'HUD-PartyMemberFrame-SecondaryResourceContainer';
const SecondaryResourceBar = 'HUD-PartyMemberFrame-SecondaryResourceBar';
const ZoneOverlay = 'HUD-PartyMemberFrame-ZoneOverlay';
const ClassIcon = 'HUD-PartyMemberFrame-ClassIcon';
const PanicContainer = 'HUD-PartyMemberFrame-PanicContainer';
const PanicBar = 'HUD-PartyMemberFrame-PanicBar';
const PanicMarker = 'HUD-PartyMemberFrame-PanicMarker';
const NameLabel = 'HUD-PartyMemberFrame-NameLabel';
const TitleLabel = 'HUD-PartyMemberFrame-TitleLabel';
const OfflineLabel = 'HUD-PartyMemberFrame-OfflineLabel';
const HealthMarker = 'HUD-PartyMemberFrame-HealthMarker';
const SecondaryMarker = 'HUD-PartyMemberFrame-SecondaryMarker';
const DeterminationPips = 'HUD-PartyMemberFrame-DeterminationPips';
const DeterminationPip = 'HUD-PartyMemberFrame-DeterminationPip';
const DeterminationPipBackground = 'HUD-PartyMemberFrame-DeterminationPipBackground';
const DeterminationPipBar = 'HUD-PartyMemberFrame-DeterminationPipBar';
const DeterminationPipBorder = 'HUD-PartyMemberFrame-DeterminationPipBorder';
const JudgementPips = 'HUD-PartyMemberFrame-JudgementPips';
const JudgementPip = 'HUD-PartyMemberFrame-JudgementPip';
const JudgementPipBackground = 'HUD-PartyMemberFrame-JudgementPipBackground';
const JudgementPipBar = 'HUD-PartyMemberFrame-JudgementPipBar';
const JudgementPipBorder = 'HUD-PartyMemberFrame-JudgementPipBorder';
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
  entity: PlayerEntityStateModelWithStatusInstanceCounts | undefined;
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
  isTargeted: boolean;
}

type Props = ReactProps & InjectedProps;

class APartyMemberFrame extends React.Component<Props> {
  render(): JSX.Element {
    const classDef = this.props.defs.classesByNumericID[this.props.memberData.classID];
    const entity = this.props.entity;

    const health = this.getResource(EntityResourceIDs.Health);
    const courage = this.getResource(EntityResourceIDs.Courage);
    const mana = this.getResource(EntityResourceIDs.Mana);
    const focus = this.getResource(EntityResourceIDs.Focus);
    const faith = this.getResource(EntityResourceIDs.Faith);
    const determination = this.getResource(EntityResourceIDs.Determination);
    const judgement = this.getResource(EntityResourceIDs.Judgement);
    const panic = this.getResource(EntityResourceIDs.Panic);

    const healthRatio = health ? health.current / health.max : 0;
    const courageRatio = courage ? courage.current / courage.max : 0;
    const manaRatio = mana ? mana.current / mana.max : 0;
    const focusRatio = focus ? focus.current / focus.max : 0;
    const faithRatio = faith ? faith.current / faith.max : 0;
    const determinationRatio = determination ? determination.current / determination.max : 0;
    const panicRatio = panic ? panic.current / panic.max : 0;

    const determinationStacks = determination && entity ? this.getDeterminationStacks(entity) : 0;

    const isDead = entity ? !entity.isAlive : false;

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
      const statusInstances = getNewestStatusInstances(Object.values(entity.statuses), entity.statusInstanceCounts);
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
                <img className={HealthResourceBar} src={HealthBar} style={{ width: `${healthRatio * 100}%` }} />
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
                <div className={DeterminationPips}>
                  <div className={DeterminationPip}>
                    <div className={DeterminationPipBackground}>
                      <img
                        className={`${DeterminationPipBar}${determinationStacks >= 6 ? ` full` : ''}`}
                        src={Determination}
                      />
                    </div>
                    <img
                      className={DeterminationPipBorder}
                      src={this.props.factionData.unitFrameDeterminationPipBorder}
                    />
                  </div>
                  <div className={DeterminationPip}>
                    <div className={DeterminationPipBackground}>
                      <img
                        className={`${DeterminationPipBar}${determinationStacks >= 5 ? ` full` : ''}`}
                        src={Determination}
                      />
                    </div>
                    <img
                      className={DeterminationPipBorder}
                      src={this.props.factionData.unitFrameDeterminationPipBorder}
                    />
                  </div>
                </div>
              )}

              {/* Judgement pips */}
              {judgement && (
                <div className={JudgementPips}>
                  {Array.from({ length: judgement.max }, (_, i) => (
                    <div key={i} className={JudgementPip}>
                      <div className={JudgementPipBackground}>
                        <img
                          className={JudgementPipBorder}
                          src={this.props.factionData.unitFrameJudgementPipBackground}
                        />
                        <img
                          className={`${JudgementPipBar}${judgement.current >= i + 1 ? ` full` : ''}`}
                          src={JudgementPipFull}
                        />
                      </div>
                    </div>
                  ))}
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
                    {buffs.length > 8 && <span className={BuffOverflow}>+</span>}
                  </div>
                  <div className={`${BuffRow} debuffs`}>
                    {debuffs.slice(0, 8).map((data) => (
                      <StatusEffectsIcon
                        key={getStatusInstanceKey(data)}
                        statusData={data}
                        entityID={this.props.memberData.entityID}
                      />
                    ))}
                    {debuffs.length > 8 && <span className={`${BuffOverflow} debuff`}>+</span>}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Class icon */}
          {classDef && <img className={ClassIcon} src={classDef.unitFrameIconImage} />}

          {/* Panic bar — after class icon so it layers on top without needing z-index */}
          {this.props.memberData.isOnline && panic && (
            <div className={PanicContainer}>
              <img className={PanicBar} src={Panic} style={{ height: `${panicRatio * 100}%` }} />
              {panicRatio > 0 && <div className={PanicMarker} style={{ top: `calc(100% - ${panicRatio * 100}%)` }} />}
            </div>
          )}

          {/* Dark overlay when online but in a different zone — rendered here so name/title sit above it */}
          {this.props.memberData.isOnline && !isInZone && <div className={ZoneOverlay} />}

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

  private getResource(resourceID: EntityResourceIDs): EntityResource | undefined {
    return this.props.entity?.resources[resourceID];
  }

  private getDeterminationStacks(entity: PlayerEntityStateModelWithStatusInstanceCounts): number {
    return entity.statusInstanceCounts[this.props.determinationBuffNumericId] ?? 0;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const rawEntity = state.entities.entities[ownProps.memberData.entityID];

  return {
    ...ownProps,
    defs: state.gameDefs,
    entity: isPlayerEntityWithStatusInstanceCounts(rawEntity) ? rawEntity : undefined,
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
    isTargeted: !!state.entities.friendlyTargetID && ownProps.memberData.entityID === state.entities.friendlyTargetID
  };
};

export const PartyMemberFrame = connect(mapStateToProps)(APartyMemberFrame);
