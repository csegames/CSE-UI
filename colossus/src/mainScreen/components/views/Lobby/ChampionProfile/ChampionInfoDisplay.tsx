/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  ChampionInfo,
  PerkDefGQL,
  PerkType,
  QuestDefGQL,
  QuestGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { setCosmeticTab, Overlay, hideOverlay, showError, showOverlay } from '../../../../redux/navigationSlice';
import { RootState } from '../../../../redux/store';
import { updateStoreRemoveUnseenEquipment } from '../../../../redux/storeSlice';
import { Button } from '../../../shared/Button';
import { QuestsByType } from '../../../../redux/questSlice';
import TooltipSource from '../../../../../shared/components/TooltipSource';
import { ChampionProgressionLevel } from './ChampionProgressionLevel';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import {
  findChampionQuestProgress,
  findChampionQuest,
  getUnlockedRuneModTierForChampion
} from '../../../../helpers/characterHelpers';
import { QuestType, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { QuestXPButton } from '../QuestXPButton';
import { StarBadge } from '../../../../../shared/components/StarBadge';
import { createAlertsForCollectedQuestProgress } from '../../../../helpers/perkUtils';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { webConf } from '../../../../dataSources/networkConfiguration';
import { refreshProfile } from '../../../../dataSources/profileNetworking';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import {
  getIsBadgedForUnseenRuneKeys,
  getIsBadgedForUnseenChampionEquipment,
  getIsBadgedForChampionProgression
} from '../../../../helpers/badgingUtils';
import { AspectRatioDiv } from '../../../../../shared/components/AspectRatioDiv';
import { PerkIcon } from '../Store/PerkIcon';

const Container = 'ChampionProfile-ChampionInfoDisplay-Container';
const ChampionName = 'ChampionProfile-ChampionInfoDisplay-ChampionName';
const SectionHeading = 'ChampionProfile-ChampionInfoDisplay-SectionHeading';
const RuneModContainer = 'ChampionProfile-ChampionInfoDisplay-RuneModContainer';
const RuneModsContainer = 'ChampionProfile-ChampionInfoDisplay-RuneModsContainer';
const RuneModsContainerInner = 'ChampionProfile-ChampionInfoDisplay-RuneModsContainerInner';
const RuneModsOrnament = 'ChampionProfile-ChampionInfoDisplay-RuneModsOrnament';
const RuneModButtonWrapper = 'ChampionProfile-ChampionInfoDisplay-RuneModButtonWrapper';
const RuneModButton = 'ChampionProfile-ChampionInfoDisplay-RuneModButton';
const RuneModIcon = 'ChampionProfile-ChampionInfoDisplay-RuneModIcon';
const RuneModLockIcon = 'ChampionProfile-ChampionInfoDisplay-RuneModLockIcon';
const RuneModToolTipContainer = 'LobbyChampionStatus-RuneTooltipContainer';
const RuneModToolTipTitle = 'LobbyChampionStatus-RuneTooltipTitle';
const RuneModToolTipDescription = 'LobbyChampionStatus-RuneTooltipDescription';
const CustomizationContainer = 'ChampionProfile-ChampionInfoDisplay-CustomizationContainer';
const CustomizationButtons = 'ChampionProfile-ChampionInfoDisplay-CustomizationButtons';
const CustomizationButton = 'ChampionProfile-ChampionInfoDisplay-CustomizationButton';
const CustomizationButtonIcon = 'ChampionProfile-ChampionInfoDisplay-CustomizationButtonIcon';
const MarkSeenButton = 'ChampionProfile-ChampionInfoDisplay-MarkSeenButton';
const RuneModStar = 'ChampionProfile-ChampionInfoDisplay-RuneModStar';
const ChampionQuestXPButton = 'ChampionProfile-ChampionInfoDisplay-ChampionQuestXPButton';
const ProgressionTreeSection = 'ChampionProfile-ChampionInfoDisplay-ProgressionTreeSection';
const ProgressionTreeContainer = 'ChampionProfile-ChampionInfoDisplay-ProgressionTreeContainer';
const ProgressionTreeBadge = 'ChampionProfile-ChampionInfoDisplay-ProgressionTreeBadge';
const TwigContainer = 'ChampionProfile-ChampionInfoDisplay-TwigContainer';
const TwigCount = 'ChampionProfile-ChampionInfoDisplay-TwigCount';
const TwigIcon = 'ChampionProfile-ChampionInfoDisplay-TwigIcon';

const ButtonPosition = 'ChampionProfile-ButtonPosition';
const ChampionButton = 'ChampionProfile-ChampionButton';
const ConsoleButton = 'ChampionProfile-ConsoleButton';
const ConsoleIcon = 'ChampionProfile-ConsoleIcon';
const ConsoleSelectSpacing = 'ChampionProfile-ConsoleSelectSpacing';

const StringIDMarkAllSeen = 'ChampionInfoDisplayMarkAllSeenTitle';
const StringIDRuneMods = 'ChampionInfoDisplayRuneModsTitle';
const StringIDProgressionTree = 'ChampionInfoDisplayProgressionTreeTitle';
const StringIDCustomization = 'ChampionInfoDisplayCustomizationTitle';
const StringIDChampionProfileSetAsDefault = 'ChampionProfileSetAsDefault';
const StringIDChampionProfileShowSkills = 'ChampionProfileShowSkills';
const StringIDSkins = 'ChampionInfoDisplaySkinsTitle';
const StringIDWeapons = 'ChampionInfoDisplayWeaponsTitle';
const StringIDSprints = 'ChampionInfoDisplaySprintsTitle';
const StringIDPortraits = 'ChampionInfoDisplayPortraitsTitle';
const StringIDEmotes = 'ChampionInfoDisplayEmotesTitle';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  champions: ChampionInfo[];
  perksByID: Dictionary<PerkDefGQL>;
  ownedPerks: Dictionary<number>;
  selectedRuneMods: PerkDefGQL[];
  newEquipment: Dictionary<boolean>;
  questsGQL: QuestGQL[];
  quests: QuestsByType;
  stringTable: Dictionary<StringTableEntryDef>;
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AChampionInfoDisplay extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className={Container}>
        <div className={ChampionName}>{this.props.selectedChampion.name}</div>
        {this.renderEquipment()}
      </div>
    );
  }

  public componentDidMount(): void {
    this.checkForCollectableReward();
  }

  public componentDidUpdate(): void {
    this.checkForCollectableReward();
  }

  private renderEquipment(): JSX.Element {
    const shouldBadgeRuneMods = getIsBadgedForUnseenRuneKeys(
      this.props.selectedChampion,
      this.props.newEquipment,
      this.props.ownedPerks,
      this.props.perksByID
    ).value;

    const shouldBadgeProgressionTree = getIsBadgedForChampionProgression(this.props.selectedChampion).value;
    const progressionCurrencyCount = this.props.ownedPerks[this.props.selectedChampion.progressionCurrencyID] ?? 0;

    return (
      <>
        <ChampionProgressionLevel />
        <QuestXPButton
          questType={QuestType.Champion}
          styles={ChampionQuestXPButton}
          champion={this.props.selectedChampion}
        />
        <div className={ProgressionTreeSection}>
          <span className={SectionHeading}>{getStringTableValue(StringIDProgressionTree, this.props.stringTable)}</span>
          <AspectRatioDiv
            aspectRatio={1702 / 320}
            retain='width'
            className={ProgressionTreeContainer}
            onClick={this.onProgressionTreeClick.bind(this)}
          >
            <div className={TwigContainer}>
              <div className={TwigCount}>{progressionCurrencyCount}</div>
              <PerkIcon className={TwigIcon} perkID={this.props.selectedChampion.progressionCurrencyID} />
            </div>
            {shouldBadgeProgressionTree && <StarBadge className={ProgressionTreeBadge} />}
          </AspectRatioDiv>
        </div>
        <div className={RuneModContainer}>
          <span className={SectionHeading}>{getStringTableValue(StringIDRuneMods, this.props.stringTable)}</span>
          <div
            className={RuneModsContainer}
            onClick={this.onRuneModClick.bind(this)}
            onMouseEnter={this.onMouseEnterRuneMods.bind(this)}
          >
            {this.renderRuneModOrnament()}
            <div className={RuneModsContainerInner}>{this.renderRuneMods()}</div>
          </div>
          {shouldBadgeRuneMods && <StarBadge className={RuneModStar} />}
        </div>
        <div className={CustomizationContainer}>
          <div className={SectionHeading}>{getStringTableValue(StringIDCustomization, this.props.stringTable)}</div>
          <div className={CustomizationButtons}>
            {this.renderSkinsButton()}
            {this.renderWeaponsButton()}
            {this.renderSprintButton()}
            {this.renderEmoteButton()}
            {this.renderPortraitButton()}
          </div>
        </div>
        {Object.keys(this.props.newEquipment).length > 0 ? (
          <Button
            type={'double-border'}
            text={getStringTableValue(StringIDMarkAllSeen, this.props.stringTable)}
            onClick={this.markAllSeen.bind(this)}
            disabled={false}
            styles={MarkSeenButton}
          />
        ) : null}
        {this.renderChampionButtons()}
      </>
    );
  }

  private renderRuneModOrnament(): JSX.Element {
    return (
      <svg
        className={RuneModsOrnament}
        width='396'
        height='33'
        viewBox='0 0 396 33'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M381.001 17.2901L387.063 23.6468L387.787 24.4058L388.51 23.6468L394.867 16.9802L395.525 16.2901L394.867 15.6L388.51 8.93337L387.787 8.1744L387.063 8.93337L381.001 15.2901H364.506L377.418 1.7491L375.971 0.368896L361.742 15.2901H352.436V9.82476H350.436V15.2901H45.2539V9.82477H43.2539V15.2901H34.9464L20.7183 0.369046L19.2709 1.74925L32.1829 15.2901H14.6877L8.62652 8.93367L7.9028 8.1747L7.17909 8.93367L0.822111 15.6003L0.164062 16.2904L0.822111 16.9805L7.17909 23.6471L7.9028 24.4061L8.62652 23.6471L14.6883 17.2901H32.1833L19.2709 30.8314L20.7183 32.2116L34.9468 17.2901H43.2539V22.7557H45.2539V17.2901H350.436V22.7557H352.436V17.2901H361.742L375.971 32.2114L377.418 30.8312L364.506 17.2901H381.001ZM7.9028 11.0728L2.92759 16.2904L7.9028 21.5079L12.878 16.2904L7.9028 11.0728ZM392.762 16.2901L387.787 21.5076L382.811 16.2901L387.787 11.0725L392.762 16.2901Z'
          fill='#4444A2'
        />
      </svg>
    );
  }

  private renderRuneMods(): JSX.Element {
    const buttons: JSX.Element[] = [];

    const unlockedTier = getUnlockedRuneModTierForChampion(
      this.props.selectedChampion,
      this.props.perksByID,
      this.props.ownedPerks
    );

    if (this.props.selectedRuneMods && this.props.selectedRuneMods.length > 0) {
      this.props.selectedRuneMods.map((runeMod, index) => {
        // Is this tier unlocked yet?
        const lockIcon = unlockedTier <= index ? 'fs-icon-misc-lock' : 'fs-icon-misc-unlock';
        const lockedStyle = unlockedTier <= index ? 'locked' : '';

        buttons.push(
          <TooltipSource
            key={index}
            className={RuneModButtonWrapper}
            tooltipParams={{ id: `${index}`, content: runeMod ? this.renderRuneModTooltip.bind(this, runeMod) : null }}
          >
            <div className={`${RuneModButton} ${lockedStyle}`}>
              {runeMod ? (
                <img className={RuneModIcon} src={runeMod.iconURL} />
              ) : (
                <div className={`${RuneModLockIcon} ${lockedStyle} ${lockIcon}`} />
              )}
            </div>
          </TooltipSource>
        );
      });
      return <>{buttons}</>;
    } else {
      return null;
    }
  }

  private renderSkinsButton(): JSX.Element {
    const isBadged = getIsBadgedForUnseenChampionEquipment(
      this.props.selectedChampion,
      this.props.champions,
      PerkType.Costume,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    ).value;

    return this.renderCustomizationButton(
      getStringTableValue(StringIDSkins, this.props.stringTable),
      'fs-icon-misc-skins',
      isBadged,
      this.onSkinSlotClick.bind(this)
    );
  }

  private renderWeaponsButton(): JSX.Element {
    const isBadged = getIsBadgedForUnseenChampionEquipment(
      this.props.selectedChampion,
      this.props.champions,
      PerkType.Weapon,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    ).value;

    return this.renderCustomizationButton(
      getStringTableValue(StringIDWeapons, this.props.stringTable),
      'fs-icon-misc-weapons',
      isBadged,
      this.onWeaponSlotClick.bind(this)
    );
  }

  private renderSprintButton(): JSX.Element {
    const isBadged = getIsBadgedForUnseenChampionEquipment(
      this.props.selectedChampion,
      this.props.champions,
      PerkType.SprintFX,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    ).value;

    return this.renderCustomizationButton(
      getStringTableValue(StringIDSprints, this.props.stringTable),
      'fs-icon-effects-speed-boost',
      isBadged,
      this.onSprintClick.bind(this)
    );
  }

  private renderPortraitButton(): JSX.Element {
    const isBadged = getIsBadgedForUnseenChampionEquipment(
      this.props.selectedChampion,
      this.props.champions,
      PerkType.Portrait,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    ).value;

    return this.renderCustomizationButton(
      getStringTableValue(StringIDPortraits, this.props.stringTable),
      'fs-icon-misc-portraits',
      isBadged,
      this.onPortraitClick.bind(this)
    );
  }

  private renderEmoteButton(): JSX.Element {
    const isBadged = getIsBadgedForUnseenChampionEquipment(
      this.props.selectedChampion,
      this.props.champions,
      PerkType.Emote,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    ).value;

    return this.renderCustomizationButton(
      getStringTableValue(StringIDEmotes, this.props.stringTable),
      'fs-icon-misc-emotes',
      isBadged,
      this.onEmoteSlotClick.bind(this)
    );
  }

  private renderCustomizationButton(
    name: string,
    iconClass: string,
    isBadged: boolean,
    onClick: () => void
  ): JSX.Element {
    return (
      <>
        <TooltipSource
          tooltipParams={{
            id: `CustomizationButton-${name}`,
            content: name
          }}
          onClick={onClick.bind(this)}
          onMouseEnter={this.onMouseEnterCosmeticButton.bind(this)}
        >
          <div className={CustomizationButton}>
            <div className={`${CustomizationButtonIcon} ${iconClass}`} />
            {isBadged && <StarBadge className={RuneModStar} />}
          </div>
        </TooltipSource>
      </>
    );
  }

  private renderChampionButtons(): JSX.Element {
    if (!this.props.usingGamepad || !this.props.usingGamepadInMainMenu) {
      return (
        <div className={ButtonPosition}>
          <Button
            type={'blue'}
            text={getStringTableValue(StringIDChampionProfileShowSkills, this.props.stringTable)}
            styles={ChampionButton}
            onClick={this.onShowSkills.bind(this)}
            disabled={false}
          />
          <Button
            type={'blue'}
            text={getStringTableValue(StringIDChampionProfileSetAsDefault, this.props.stringTable)}
            styles={ChampionButton}
            onClick={this.onSetAsDefault.bind(this)}
            disabled={false}
          />
        </div>
      );
    }
    return (
      <div className={ButtonPosition}>
        <Button
          type={'blue'}
          text={
            <div className={ConsoleButton}>
              <span className={`${ConsoleIcon} icon-xb-x`} />
              {getStringTableValue(StringIDChampionProfileShowSkills, this.props.stringTable)}
            </div>
          }
          onClick={this.onShowSkills.bind(this)}
          disabled={false}
        />
        <Button
          type={'blue'}
          text={
            <div className={ConsoleButton}>
              <span className={`${ConsoleIcon} icon-xb-a`} />
              {getStringTableValue(StringIDChampionProfileSetAsDefault, this.props.stringTable)}
            </div>
          }
          styles={ConsoleSelectSpacing}
          onClick={this.onSetAsDefault.bind(this)}
          disabled={false}
        />
      </div>
    );
  }

  private onMouseEnterCosmeticButton(): void {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_MOUSEOVER);
  }

  private onMouseEnterRuneMods(): void {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_MOUSEOVER);
  }

  private onWeaponSlotClick(): void {
    game.playGameSound(SoundEvents.PLAY_UI_CUSTOMIZEMENU_WEAPONS_CLICK);
    this.props.dispatch?.(setCosmeticTab(PerkType.Weapon));
    this.props.dispatch(showOverlay(Overlay.ChampionSelectCosmetics));
  }

  private onSkinSlotClick(): void {
    game.playGameSound(SoundEvents.PLAY_UI_CUSTOMIZEMENU_SKINS_CLICK);
    this.props.dispatch?.(setCosmeticTab(PerkType.Costume));
    this.props.dispatch(showOverlay(Overlay.ChampionSelectCosmetics));
  }

  private onEmoteSlotClick(): void {
    game.playGameSound(SoundEvents.PLAY_UI_CUSTOMIZEMENU_EMOTE_CLICK);
    this.props.dispatch?.(setCosmeticTab(PerkType.Emote));
    this.props.dispatch(showOverlay(Overlay.ChampionSelectCosmetics));
  }

  private onProgressionTreeClick(): void {
    this.props.dispatch(showOverlay(Overlay.ProgressionTree));
  }

  private onRuneModClick(): void {
    game.playGameSound(SoundEvents.PLAY_UI_RUNEMENU_CLICK);
    this.props.dispatch(showOverlay(Overlay.RuneMods));
  }

  private onSprintClick(): void {
    game.playGameSound(SoundEvents.PLAY_UI_CUSTOMIZEMENU_SPRINT_CLICK);
    this.props.dispatch?.(setCosmeticTab(PerkType.SprintFX));
    this.props.dispatch(showOverlay(Overlay.ChampionSelectCosmetics));
  }

  private onPortraitClick(): void {
    game.playGameSound(SoundEvents.PLAY_UI_CUSTOMIZEMENU_PORTRAIT_CLICK);
    this.props.dispatch?.(setCosmeticTab(PerkType.Portrait));
    this.props.dispatch(showOverlay(Overlay.ChampionSelectCosmetics));
  }

  private markAllSeen(): void {
    for (const [key] of Object.entries(this.props.newEquipment)) {
      //update redux
      this.props.dispatch(updateStoreRemoveUnseenEquipment(key));
    }
    // update local store
    clientAPI.setUnseenEquipment({});
  }

  private renderRuneModTooltip(runeMod: PerkDefGQL): JSX.Element {
    return (
      <div className={RuneModToolTipContainer}>
        <span className={RuneModToolTipTitle}>{runeMod.name}</span>
        <span className={RuneModToolTipDescription}>{runeMod.description}</span>
      </div>
    );
  }

  private checkForCollectableReward() {
    const questGQL = findChampionQuestProgress(this.props.selectedChampion, this.props.questsGQL);
    const quest = findChampionQuest(this.props.selectedChampion, this.props.quests.Champion);

    if (questGQL && questGQL.currentQuestIndex > questGQL.nextCollection) {
      const questLink = quest.links?.[questGQL.nextCollection];
      if (questLink?.rewards.length > 0) {
        this.props.dispatch(showOverlay(Overlay.RewardCollection));
      } else {
        this.claimAllRewards(quest, questGQL);
      }
    } else {
      // This solves a race condition between the above check and the profile updating after the first reward window closes.
      this.props.dispatch(hideOverlay(Overlay.RewardCollection));
    }
  }

  private async claimAllRewards(quest: QuestDefGQL, questProgress: QuestGQL) {
    const res = await ProfileAPI.CollectQuestReward(webConf, quest.id);
    if (!res.ok) {
      console.error('failed to claim all progression rewards in championInfoDisplay');
      this.props.dispatch(showError(res));
    } else {
      createAlertsForCollectedQuestProgress(
        quest,
        questProgress,
        this.props.perksByID,
        this.props.champions,
        this.props.dispatch
      );
    }
  }

  private onShowSkills() {
    this.props.dispatch(showOverlay(Overlay.ChampionDetails));
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CLICK);
  }

  private async onSetAsDefault() {
    game.playGameSound(SoundEvents.PLAY_UI_CUSTOMIZEMENU_SELECTDEFAULT_CLICK);

    const res = await ProfileAPI.SetDefaultChampion(webConf, this.props.selectedChampion.id as any);

    if (res.ok) {
      refreshProfile();
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { perksByID, newEquipment } = state.store;
  const { selectedChampion, champions } = state.championInfo;
  const { ownedPerks, selectedRuneMods, quests } = state.profile;
  const selectedRuneModsByChamp = selectedRuneMods[selectedChampion.id];
  const questsByType = state.quests.quests;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    selectedChampion,
    champions,
    perksByID,
    ownedPerks,
    selectedRuneMods: selectedRuneModsByChamp,
    newEquipment,
    questsGQL: quests,
    quests: questsByType,
    stringTable
  };
}

export const ChampionInfoDisplay = connect(mapStateToProps)(AChampionInfoDisplay);
