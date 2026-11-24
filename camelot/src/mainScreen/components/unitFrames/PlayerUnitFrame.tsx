/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import {
  EntityResource,
  isEntityPlayer,
  PlayerEntityStateModel
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import ContextMenuSource from '../ContextMenuSource';
import { ContextMenuItem, ContextMenuParams } from '../../redux/contextMenuSlice';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralComma
} from '../../helpers/stringTableHelpers';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { FactionData, getFactionData } from '../../gameData/factionData';
import { getIsEntityNPC, getLockedResourceRatio, getShieldRatio } from '../../helpers/characterHelpers';
import { getNPCTierIconImage } from '../../helpers/npcTierHelpers';
import { isClassLevelNumberShown, UnitFrameGemState, UnitFrameChrome } from './UnitFrameChrome';
import { UnitFrameChromeFront } from './UnitFrameChromeFront';
import { getTagFromString, tagsMatch, TagVeilPlane } from '../../helpers/tagHelpers';
import { UnitFrameBar, UnitFrameBarLayout } from './UnitFrameBar';
import { ClassIconTooltip } from './ClassIconTooltip';
import { UnitFrameTextTooltip } from './UnitFrameTextTooltip';
import { DETERMINATION_BUFF_STRING_ID, DETERMINATION_PIP_STACK_THRESHOLDS } from '../../helpers/statusHelpers';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import Health from '../../../images/unit-frames/unit-frame-health.png';
import LockedHealth from '../../../images/unit-frames/unit-frame-health-locked.png';
import Shield from '../../../images/unit-frames/unit-frame-health-shield.png';
import Courage from '../../../images/unit-frames/unit-frame-courage.png';
import Mana from '../../../images/unit-frames/unit-frame-mana.png';
import Focus from '../../../images/unit-frames/unit-frame-focus.png';
import Faith from '../../../images/unit-frames/unit-frame-faith.png';
import Determination from '../../../images/unit-frames/unit-frame-determination.png';
import Panic from '../../../images/unit-frames/unit-frame-panic.png';
import JudgementPipFull from '../../../images/unit-frames/unit-frame-judgement-pip-full.png';
import DeterminationPipFull from '../../../images/unit-frames/unit-frame-determination-pip-full.png';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { ClassIconSize, getClassIconSize, getUnitFrameTransparentClassIconImage } from '../../helpers/classIconHelpers';
import { NameplateDecorFlags } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';

// CSS classes
const Root = 'HUD-PlayerUnitFrame-Root';
const FrameRoot = 'HUD-PlayerUnitFrame-FrameRoot';
const HitRegion = 'HUD-PlayerUnitFrame-HitRegion';
const ClassIconHitRegion = 'HUD-PlayerUnitFrame-ClassIconHitRegion';
const RealmRenownHitRegion = 'HUD-PlayerUnitFrame-RealmRenownHitRegion';
const GemHitRegion = 'HUD-PlayerUnitFrame-GemHitRegion';
const Marker = 'HUD-PlayerUnitFrame-Marker';
const MarkerHealth = 'HUD-PlayerUnitFrame-MarkerHealth';
const MarkerLockedHealth = 'HUD-PlayerUnitFrame-MarkerLockedHealth';
const MarkerShield = 'HUD-PlayerUnitFrame-MarkerShield';
const MarkerCourage = 'HUD-PlayerUnitFrame-MarkerCourage';
const MarkerMana = 'HUD-PlayerUnitFrame-MarkerMana';
const MarkerFocus = 'HUD-PlayerUnitFrame-MarkerFocus';
const MarkerFaith = 'HUD-PlayerUnitFrame-MarkerFaith';
const MarkerDetermination = 'HUD-PlayerUnitFrame-MarkerDetermination';
const MarkerPanic = 'HUD-PlayerUnitFrame-MarkerPanic';
const PanicBar = 'HUD-PlayerUnitFrame-PanicBar';
const PrimaryMiddleBar = 'HUD-PlayerUnitFrame-PrimaryMiddleBar';
const LockedHealthBar = 'HUD-PlayerUnitFrame-LockedHealthBar';
const ShieldBar = 'HUD-PlayerUnitFrame-ShieldBar';
const SecondaryMiddleBar = 'HUD-PlayerUnitFrame-SecondaryMiddleBar';
const PrimaryResourceText = 'HUD-PlayerUnitFrame-PrimaryResourceText';
const SecondaryResourceText = 'HUD-PlayerUnitFrame-SecondaryResourceText';
const ResourcePips = 'HUD-PlayerUnitFrame-ResourcePips';
const ResourcePip = 'HUD-PlayerUnitFrame-ResourcePip';
const ResourcePipContent = 'HUD-PlayerUnitFrame-ResourcePipContent';
const ResourcePipBackground = 'HUD-PlayerUnitFrame-ResourcePipBackground';
const ResourcePipFill = 'HUD-PlayerUnitFrame-ResourcePipFill';
const NameText = 'HUD-PlayerUnitFrame-NameText';
const SecondaryFill = 'HUD-PlayerUnitFrame-SecondaryFill';

// String IDs
const StringIDUnitFrameCorpse = 'UnitFrameCorpse';
const StringIDUnitFrameRealmRenownRank = 'UnitFrameRealmRenownRank';
const StringIDUnitFrameClassLevel = 'UnitFrameClassLevel';
const StringIDUnitFrameClassLevelMax = 'UnitFrameClassLevelMax';
const StringIDUnitFrameGemDead = 'UnitFrameGemDead';
const StringIDUnitFrameGemPanicked = 'UnitFrameGemPanicked';
const StringIDUnitFrameGemVeil = 'UnitFrameGemVeil';
const StringIDUnitFrameResourceHealth = 'UnitFrameResourceHealth';
const StringIDUnitFrameResourceMana = 'UnitFrameResourceMana';
const StringIDUnitFrameResourceFocus = 'UnitFrameResourceFocus';
const StringIDUnitFrameResourceCourage = 'UnitFrameResourceCourage';
const StringIDUnitFrameResourceFaith = 'UnitFrameResourceFaith';
const StringIDUnitFrameResourceDetermination = 'UnitFrameResourceDetermination';
const StringIDUnitFrameOffline = 'UnitFrameOffline';
const StringIDUnitFramePartyLeader = 'UnitFramePartyLeader';
const StringIDUnitFrameWarbandDeputy = 'UnitFrameWarbandDeputy';

const MISSING_ASSET_IMAGE = '/images/MissingAsset.png';

// Tags
const TagPanicked = 'Granted.State.Panicked';

function getRealmIconURL(faction: Faction): string {
  return `/dynamic/userclasses/assets/${Faction[faction]}-transparency-Realm.png`;
}

const GemStateTooltipStringIDs: Record<UnitFrameGemState, string> = {
  dead: StringIDUnitFrameGemDead,
  panicked: StringIDUnitFrameGemPanicked,
  veil: StringIDUnitFrameGemVeil
};

interface ReactProps {
  entityID: string;
  isAlive: boolean;
  name: string;
  faction: Faction;
  contextMenu?: ContextMenuItem[];
  isLeader: boolean;
  isDeputy: boolean;
  isOnline: boolean;
  classID?: number;
  onTarget?: () => void;
  hasCompass?: boolean;
  nameplateDecor?: NameplateDecorFlags;
}

interface InjectedProps {
  defs: GameDefsState;
  friendlyTargetType: string | null;
  entity: PlayerEntityStateModel | undefined;
  statusInstanceCounts: Record<number, number>;
  resources: Record<string, EntityResource>;
  stringTable: Record<string, StringTableEntryDef>;
  determinationStacks: number;
  classIconSize: ClassIconSize;
}

type Props = ReactProps & InjectedProps;

class PlayerUnitFrame extends React.PureComponent<Props> {
  render(): JSX.Element {
    const factionData = getFactionData(this.props.defs.factions[Faction[this.props.faction]].id);

    const entity = this.props.entity;
    const hasClassIconTooltip = !!entity && this.props.isOnline && this.hasClassIcon();
    const onlineEntity = this.props.isOnline ? entity : undefined;
    const hasRealmRenownTooltip = !!onlineEntity && this.getRealmRenown(onlineEntity) != null;
    const gemState = onlineEntity ? this.getGemState(onlineEntity) : undefined;
    const gemTooltip = onlineEntity ? this.getGemTooltip(onlineEntity, gemState) : undefined;

    let name = this.props.name;
    if (!this.props.isAlive && this.props.entityID?.length > 0) {
      name += ` ${getStringTableValue(StringIDUnitFrameCorpse, this.props.stringTable)}`;
    }
    if (this.props.isLeader) {
      name += ` ${getStringTableValue(StringIDUnitFramePartyLeader, this.props.stringTable)}`;
    }
    if (this.props.isDeputy) {
      name += ` ${getStringTableValue(StringIDUnitFrameWarbandDeputy, this.props.stringTable)}`;
    }
    if (!this.props.isOnline) {
      name += ` ${getStringTableValue(StringIDUnitFrameOffline, this.props.stringTable)}`;
    }

    return (
      <div className={Root}>
        <div className={FrameRoot}>
          {onlineEntity && this.getEntityContent(onlineEntity, name, factionData, gemState)}
          {!entity && this.getOutOfZoneContent(name, factionData)}
          <ContextMenuSource
            className={HitRegion}
            onClick={this.props.onTarget}
            menuParams={this.getContextMenuParams()}
          >
            {hasClassIconTooltip && (
              <ClassIconTooltip
                className={ClassIconHitRegion}
                tooltipID={`UnitFrameClass_${this.props.entityID}`}
                classDef={this.props.defs.classesByNumericID[this.props.classID]}
                stringTable={this.props.stringTable}
              />
            )}
            {hasRealmRenownTooltip && (
              <UnitFrameTextTooltip
                className={RealmRenownHitRegion}
                tooltipID={`UnitFrameRealmRenown_${this.props.entityID}`}
                text={getStringTableValue(StringIDUnitFrameRealmRenownRank, this.props.stringTable)}
              />
            )}
            {gemTooltip && (
              // The text is in the ID so an open tooltip refreshes when the gem changes under the cursor.
              <UnitFrameTextTooltip
                className={GemHitRegion}
                tooltipID={`UnitFrameGem_${this.props.entityID}_${gemTooltip}`}
                text={gemTooltip}
              />
            )}
          </ContextMenuSource>
        </div>
        {this.props.children}
      </div>
    );
  }

  private getClassLevel(entity: PlayerEntityStateModel): number | undefined {
    return !getIsEntityNPC(entity) && entity.characterLevel != null ? entity.characterLevel + 1 : undefined;
  }

  private getRealmRenown(entity: PlayerEntityStateModel): string | undefined {
    return !getIsEntityNPC(entity) && entity.realmRank != null ? String(entity.realmRank) : undefined;
  }

  private getGemState(entity: PlayerEntityStateModel): UnitFrameGemState | undefined {
    if (!this.props.isAlive) {
      return 'dead';
    }
    const { tagAffixIDByStringID } = this.props.defs;
    if (tagsMatch(entity.tags, [getTagFromString(TagPanicked, tagAffixIDByStringID)])) {
      return 'panicked';
    }
    if (tagsMatch(entity.tags, [getTagFromString(TagVeilPlane, tagAffixIDByStringID)])) {
      return 'veil';
    }
    return undefined;
  }

  private getGemTooltip(entity: PlayerEntityStateModel, gemState: UnitFrameGemState | undefined): string | undefined {
    if (gemState) {
      return getStringTableValue(GemStateTooltipStringIDs[gemState], this.props.stringTable);
    }
    const classLevel = this.getClassLevel(entity);
    if (classLevel == null) {
      return undefined;
    }
    return isClassLevelNumberShown(classLevel)
      ? getStringTableValue(StringIDUnitFrameClassLevel, this.props.stringTable)
      : getStringTableValue(StringIDUnitFrameClassLevelMax, this.props.stringTable);
  }

  private getEntityContent(
    entity: PlayerEntityStateModel,
    name: string,
    factionData: FactionData,
    gemState: UnitFrameGemState | undefined
  ): JSX.Element {
    const isNPC = getIsEntityNPC(entity);
    const panic = this.props.resources[EntityResourceIDs.Panic];
    const panicRatio = panic ? panic.current / panic.max : 0;
    const barLayout: UnitFrameBarLayout = isNPC ? 'two-bars' : 'three-bars';

    return (
      <>
        <UnitFrameChrome
          factionID={factionData.id}
          realmRenown={this.getRealmRenown(entity)}
          classLevel={this.getClassLevel(entity)}
          gemState={gemState}
          hasBottomDiamond={!!this.props.hasCompass}
          layout={barLayout}
          decor={this.props.nameplateDecor}
        />
        <UnitFrameBar slot='name' layout={barLayout} factionID={factionData.id}>
          {panic && <img className={PanicBar} style={{ width: `${panicRatio * 100}%` }} src={Panic} />}
          {panicRatio > 0 && (
            <div className={`${Marker} ${MarkerPanic}`} style={{ right: `calc(100% - ${panicRatio * 100}%)` }} />
          )}
          <div className={NameText}>{name}</div>
        </UnitFrameBar>
        <UnitFrameBar slot='health' layout={barLayout} factionID={factionData.id}>
          {this.renderHealthContent()}
        </UnitFrameBar>
        {!isNPC && (
          <UnitFrameBar slot='secondary' layout='three-bars' factionID={factionData.id}>
            <div className={SecondaryFill}>{this.renderSecondaryContent()}</div>
          </UnitFrameBar>
        )}
        {this.renderResourcePips(factionData)}
        <UnitFrameChromeFront
          factionID={factionData.id}
          iconURL={this.getIconURL(isNPC)}
          layout={barLayout}
          decor={this.props.nameplateDecor}
        />
      </>
    );
  }

  private getIconURL(isNPC: boolean): string | null {
    if (this.hasClassIcon() || (isNPC && this.hasNPCClassIcon())) {
      return getUnitFrameTransparentClassIconImage(
        this.props.defs.classesByNumericID[this.props.classID],
        this.props.classIconSize
      );
    }
    if (this.props.faction === Faction.Factionless) {
      return getNPCTierIconImage(this.props.entity?.characterKind);
    }
    return isNPC ? getRealmIconURL(this.props.faction) : null;
  }

  private renderHealthContent(): JSX.Element | null {
    const health = this.props.resources[EntityResourceIDs.Health];
    if (!health) {
      return null;
    }

    const healthRatio = health.current / health.max;
    return (
      <>
        {this.renderLockedHealth(health)}
        <img className={PrimaryMiddleBar} src={Health} style={{ width: `${healthRatio * 100}%` }} />
        {this.renderShield(health)}
        {healthRatio > 0 && (
          <div className={`${Marker} ${MarkerHealth}`} style={{ right: `calc(100% - ${healthRatio * 100}%)` }} />
        )}
        <div className={PrimaryResourceText}>{this.getResourceText(StringIDUnitFrameResourceHealth, health)}</div>
      </>
    );
  }

  private renderSecondaryContent(): JSX.Element {
    const mana = this.props.resources[EntityResourceIDs.Mana];
    const focus = this.props.resources[EntityResourceIDs.Focus];
    const focusCharger = this.props.resources[EntityResourceIDs.FocusCharger];
    const courage = this.props.resources[EntityResourceIDs.Courage];
    const faith = this.props.resources[EntityResourceIDs.Faith];
    const determination = this.props.resources[EntityResourceIDs.Determination];

    const manaRatio = mana ? mana.current / mana.max : 0;
    const focusRatio = focus ? focus.current / focus.max : 0;
    let focusChargerRatio = focusCharger ? focusCharger.current / focusCharger.max : 0;
    if (focusRatio >= 1) focusChargerRatio = 1;
    const courageRatio = courage ? courage.current / courage.max : 0;
    const faithRatio = faith ? faith.current / faith.max : 0;
    const determinationRatio = determination ? determination.current / determination.max : 0;

    let secondaryLabel: string | null = null;
    if (courage) secondaryLabel = this.getResourceText(StringIDUnitFrameResourceCourage, courage);
    else if (mana) secondaryLabel = this.getResourceText(StringIDUnitFrameResourceMana, mana);
    else if (focus) secondaryLabel = this.getResourceText(StringIDUnitFrameResourceFocus, focus);
    else if (faith) secondaryLabel = this.getResourceText(StringIDUnitFrameResourceFaith, faith);
    else if (determination)
      secondaryLabel = this.getResourceText(StringIDUnitFrameResourceDetermination, determination);

    return (
      <>
        {courage && (
          <>
            <img className={SecondaryMiddleBar} src={Courage} style={{ width: `${courageRatio * 100}%` }} />
            {courageRatio > 0 && (
              <div className={`${Marker} ${MarkerCourage}`} style={{ right: `calc(100% - ${courageRatio * 100}%)` }} />
            )}
          </>
        )}
        {mana && (
          <>
            <img className={SecondaryMiddleBar} src={Mana} style={{ width: `${manaRatio * 100}%` }} />
            {manaRatio > 0 && (
              <div className={`${Marker} ${MarkerMana}`} style={{ right: `calc(100% - ${manaRatio * 100}%)` }} />
            )}
          </>
        )}
        {focus && (
          <>
            <img className={`${SecondaryMiddleBar} top`} src={Focus} style={{ width: `${focusRatio * 100}%` }} />
            {focusRatio > 0 && (
              <div className={`${Marker} ${MarkerFocus}`} style={{ right: `calc(100% - ${focusRatio * 100}%)` }} />
            )}
            <img
              className={`${SecondaryMiddleBar} bottom`}
              src={Focus}
              style={{ width: `${focusChargerRatio * 100}%` }}
            />
            {focusChargerRatio > 0 && (
              <div
                className={`${Marker} ${MarkerFocus}`}
                style={{ right: `calc(100% - ${focusChargerRatio * 100}%)` }}
              />
            )}
          </>
        )}
        {faith && (
          <>
            <img className={SecondaryMiddleBar} src={Faith} style={{ width: `${faithRatio * 100}%` }} />
            {faithRatio > 0 && (
              <div className={`${Marker} ${MarkerFaith}`} style={{ right: `calc(100% - ${faithRatio * 100}%)` }} />
            )}
          </>
        )}
        {determination && (
          <>
            <img className={SecondaryMiddleBar} src={Determination} style={{ width: `${determinationRatio * 100}%` }} />
            {determinationRatio > 0 && (
              <div
                className={`${Marker} ${MarkerDetermination}`}
                style={{ right: `calc(100% - ${determinationRatio * 100}%)` }}
              />
            )}
          </>
        )}
        {secondaryLabel && <div className={SecondaryResourceText}>{secondaryLabel}</div>}
      </>
    );
  }

  private getResourceText(stringID: string, resource: EntityResource): string {
    const separator = getStringTableValue(StringIDGeneralComma, this.props.stringTable);
    return getTokenizedStringTableValue(stringID, this.props.stringTable, {
      CURRENT: printWithSeparator(Math.floor(resource.current), separator),
      MAX: printWithSeparator(Math.floor(resource.max), separator)
    });
  }

  private getOutOfZoneContent(name: string, factionData: FactionData): JSX.Element {
    const classDef = this.props.defs.classesByNumericID[this.props.classID];
    return (
      <>
        <UnitFrameChrome
          factionID={factionData.id}
          hasBottomDiamond={!!this.props.hasCompass}
          layout='three-bars'
          decor={this.props.nameplateDecor}
        />
        <UnitFrameBar slot='name' layout='three-bars' factionID={factionData.id}>
          <div className={NameText}>{name}</div>
        </UnitFrameBar>
        <UnitFrameBar slot='health' layout='three-bars' factionID={factionData.id} />
        <UnitFrameBar slot='secondary' layout='three-bars' factionID={factionData.id} />
        <UnitFrameChromeFront
          factionID={factionData.id}
          iconURL={classDef ? getUnitFrameTransparentClassIconImage(classDef, this.props.classIconSize) : null}
          layout='three-bars'
          decor={this.props.nameplateDecor}
        />
      </>
    );
  }

  private getContextMenuParams(): ContextMenuParams | undefined {
    const content = this.props.contextMenu;
    if (content && content.length > 0) {
      const params: ContextMenuParams = {
        id: `UnitFrame_${this.props.entityID}`,
        content
      };
      return params;
    } else {
      // If no content, then no context menu will appear.
      return undefined;
    }
  }

  private renderLockedHealth(health: EntityResource): JSX.Element | null {
    const lockedHealthRatio = getLockedResourceRatio(health);
    if (lockedHealthRatio <= 0) return null;

    return (
      <>
        <img className={LockedHealthBar} src={LockedHealth} style={{ width: `${lockedHealthRatio * 100}%` }} />
        <div className={`${Marker} ${MarkerLockedHealth}`} style={{ left: `${(1 - lockedHealthRatio) * 100}%` }} />
      </>
    );
  }

  private renderShield(health: EntityResource): JSX.Element | null {
    const shield = this.props.resources[EntityResourceIDs.Shield];
    if (!shield) return null;

    const shieldRatio = getShieldRatio(shield, health);
    if (shieldRatio <= 0) return null;

    return (
      <>
        <img className={ShieldBar} src={Shield} style={{ width: `${shieldRatio * 100}%` }} />
        <div className={`${Marker} ${MarkerShield}`} style={{ right: `${(1 - shieldRatio) * 100}%` }} />
      </>
    );
  }

  private renderResourcePips(factionData: FactionData): JSX.Element {
    const determination = this.props.resources[EntityResourceIDs.Determination];
    const judgement = this.props.resources[EntityResourceIDs.Judgement];

    return (
      <>
        {determination && (
          <div className={ResourcePips}>
            {DETERMINATION_PIP_STACK_THRESHOLDS.map((threshold, i) =>
              this.renderResourcePip(i, this.props.determinationStacks >= threshold, DeterminationPipFull, factionData)
            )}
          </div>
        )}
        {judgement && (
          <div className={ResourcePips}>
            {Array.from({ length: judgement.max }, (_, i) =>
              this.renderResourcePip(i, judgement.current >= i + 1, JudgementPipFull, factionData)
            )}
          </div>
        )}
      </>
    );
  }

  private renderResourcePip(
    pipIndex: number,
    isFull: boolean,
    fillImage: string,
    factionData: FactionData
  ): JSX.Element {
    return (
      <div key={pipIndex} className={ResourcePip}>
        <div className={ResourcePipContent}>
          <img className={ResourcePipBackground} src={factionData.unitFrameResourcePipBackground} />
          <img className={`${ResourcePipFill}${isFull ? ' full' : ''}`} src={fillImage} />
        </div>
      </div>
    );
  }

  private hasClassIcon(): boolean {
    const classDef = this.props.defs.classesByNumericID[this.props.classID];
    return !getIsEntityNPC(this.props.entity) && !!this.props.classID && !!classDef?.unitFrameIconImage;
  }

  // NPC classes without art point at the missing-asset image, and keep the realm icon instead.
  private hasNPCClassIcon(): boolean {
    const icon = this.props.defs.classesByNumericID[this.props.classID]?.unitFrameIconImage;
    return !!icon && icon !== MISSING_ASSET_IMAGE;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const rawEntity = state.entities.entities[ownProps.entityID];
  const determinationBuffNumericId = state.gameDefs.statusesByStringID?.[DETERMINATION_BUFF_STRING_ID]?.numericID;
  const determinationStacks =
    state.entities.entityStatusInstanceCounts[ownProps.entityID]?.[determinationBuffNumericId] ?? 0;

  return {
    ...ownProps,
    defs: state.gameDefs,
    friendlyTargetType: state.entities.friendlyTarget?.type ?? null,
    entity: isEntityPlayer(rawEntity) ? rawEntity : undefined,
    statusInstanceCounts: state.entities.entityStatusInstanceCounts[rawEntity?.entityID] ?? {},
    resources: state.entities.entityResources[rawEntity?.entityID] ?? {},
    stringTable,
    determinationStacks,
    classIconSize: getClassIconSize(state.hud.vminPx)
  };
}

export default connect(mapStateToProps)(PlayerUnitFrame);
