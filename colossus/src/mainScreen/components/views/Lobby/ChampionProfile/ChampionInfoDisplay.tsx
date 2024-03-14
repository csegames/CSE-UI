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
import { storeLocalStore } from '../../../../localStorage/storeLocalStorage';
import { updateSelectedEmoteIndex } from '../../../../redux/championInfoSlice';
import { LobbyView, Overlay, hideOverlay, navigateTo, showError, showOverlay } from '../../../../redux/navigationSlice';
import { RootState } from '../../../../redux/store';
import { updateStoreRemoveUnseenEquipment } from '../../../../redux/storeSlice';
import { Button } from '../../../shared/Button';
import { QuestsByType } from '../../../../redux/questSlice';
import TooltipSource from '../../../../../shared/components/TooltipSource';
import { ChampionProgressionLevel } from './ChampionProgressionLevel';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { webConf } from '../../../../dataSources/networkConfiguration';
import {
  findChampionQuestProgress,
  findChampionQuest,
  hasUnseenPerkForChampion
} from '../../../../helpers/characterHelpers';
import { QuestType, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { QuestXPButton } from '../QuestXPButton';
import { StarBadge } from '../../../../../shared/components/StarBadge';
import { createAlertsForCollectedQuestProgress } from '../../../../helpers/perkUtils';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { startProfileRefresh } from '../../../../redux/profileSlice';

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

const ButtonPosition = 'ChampionProfile-ButtonPosition';
const ChampionButton = 'ChampionProfile-ChampionButton';
const ConsoleButton = 'ChampionProfile-ConsoleButton';
const ConsoleIcon = 'ChampionProfile-ConsoleIcon';
const ConsoleSelectSpacing = 'ChampionProfile-ConsoleSelectSpacing';

const StringIDMarkAllSeen = 'ChampionInfoDisplayMarkAllSeenTitle';
const StringIDRuneMods = 'ChampionInfoDisplayRuneModsTitle';
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
    this.checkForCollectableReward();

    return (
      <div className={Container}>
        <div className={ChampionName}>{this.props.selectedChampion.name}</div>
        {this.renderEquipment()}
      </div>
    );
  }

  private renderEquipment(): JSX.Element {
    const hasUnseenRunes = hasUnseenPerkForChampion(
      this.props.selectedChampion,
      PerkType.RuneMod,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    );

    return (
      <>
        <ChampionProgressionLevel />
        <QuestXPButton
          questType={QuestType.Champion}
          styles={ChampionQuestXPButton}
          champion={this.props.selectedChampion}
        />
        <div className={RuneModContainer}>
          <span className={SectionHeading}>{getStringTableValue(StringIDRuneMods, this.props.stringTable)}</span>
          <div className={RuneModsContainer} onClick={this.onRuneModClick.bind(this)}>
            {this.renderRuneModOrnament()}
            <div className={RuneModsContainerInner}>{this.renderRuneMods()}</div>
          </div>
          {hasUnseenRunes && <StarBadge className={RuneModStar} />}
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
    if (this.props.selectedRuneMods && this.props.selectedRuneMods.length > 0) {
      this.props.selectedRuneMods.map((runeMod, index) => {
        if (!runeMod || !runeMod.id || !runeMod.iconURL) {
          return;
        }

        buttons.push(
          <TooltipSource
            key={index}
            className={RuneModButtonWrapper}
            tooltipParams={{ id: `${index}`, content: runeMod ? this.renderRuneModTooltip.bind(this, runeMod) : null }}
          >
            <div className={RuneModButton} key={runeMod.id}>
              <img className={RuneModIcon} src={runeMod ? runeMod.iconURL : null} />
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
    const alertStar = hasUnseenPerkForChampion(
      this.props.selectedChampion,
      PerkType.Costume,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    );

    return this.renderCustomizationButton(
      getStringTableValue(StringIDSkins, this.props.stringTable),
      'fs-icon-misc-skins',
      alertStar,
      this.onSkinSlotClick.bind(this)
    );
  }

  private renderWeaponsButton(): JSX.Element {
    const alertStar = hasUnseenPerkForChampion(
      this.props.selectedChampion,
      PerkType.Weapon,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    );

    return this.renderCustomizationButton(
      getStringTableValue(StringIDWeapons, this.props.stringTable),
      'fs-icon-misc-weapons',
      alertStar,
      this.onWeaponSlotClick.bind(this)
    );
  }

  private renderSprintButton(): JSX.Element {
    const alertStar = hasUnseenPerkForChampion(
      this.props.selectedChampion,
      PerkType.SprintFX,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    );

    return this.renderCustomizationButton(
      getStringTableValue(StringIDSprints, this.props.stringTable),
      'fs-icon-effects-speed-boost',
      alertStar,
      this.onSprintClick.bind(this)
    );
  }

  private renderPortraitButton(): JSX.Element {
    const alertStar = hasUnseenPerkForChampion(
      this.props.selectedChampion,
      PerkType.Portrait,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    );

    return this.renderCustomizationButton(
      getStringTableValue(StringIDPortraits, this.props.stringTable),
      'fs-icon-misc-portraits',
      alertStar,
      this.onPortraitClick.bind(this)
    );
  }

  private renderEmoteButton(): JSX.Element {
    const alertStar = hasUnseenPerkForChampion(
      this.props.selectedChampion,
      PerkType.Emote,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    );

    return this.renderCustomizationButton(
      getStringTableValue(StringIDEmotes, this.props.stringTable),
      'fs-icon-misc-emotes',
      alertStar,
      this.onEmoteSlotClick.bind(this)
    );
  }

  private renderCustomizationButton(
    name: string,
    iconClass: string,
    alertStar: boolean,
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
        >
          <div className={CustomizationButton}>
            <div className={`${CustomizationButtonIcon} ${iconClass}`} />
            {alertStar && <StarBadge className={RuneModStar} />}
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

  private onWeaponSlotClick(): void {
    this.props.dispatch(navigateTo(LobbyView.SelectWeapon));
  }

  private onSkinSlotClick(): void {
    this.props.dispatch(navigateTo(LobbyView.SelectSkin));
  }

  private onEmoteSlotClick(): void {
    this.props.dispatch(updateSelectedEmoteIndex(0));
    this.props.dispatch(navigateTo(LobbyView.SelectEmote));
  }

  private onRuneModClick(): void {
    this.props.dispatch(showOverlay(Overlay.RuneMods));
  }

  private onSprintClick(): void {
    this.props.dispatch(navigateTo(LobbyView.SelectAppearance));
  }

  private onPortraitClick(): void {
    this.props.dispatch(navigateTo(LobbyView.SelectAppearance));
  }

  private markAllSeen(): void {
    for (const [key] of Object.entries(this.props.newEquipment)) {
      //update redux
      this.props.dispatch(updateStoreRemoveUnseenEquipment(key));
    }
    // update local store
    storeLocalStore.setUnseenEquipment({});
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
      createAlertsForCollectedQuestProgress(quest, questProgress, this.props.perksByID, this.props.dispatch);
    }
  }

  private onShowSkills() {
    this.props.dispatch(showOverlay(Overlay.ChampionDetails));
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
  }

  private async onSetAsDefault() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);

    const res = await ProfileAPI.SetDefaultChampion(webConf, this.props.selectedChampion.id as any);

    if (res.ok) {
      this.props.dispatch(startProfileRefresh());
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { perksByID, newEquipment } = state.store;
  const { selectedChampion } = state.championInfo;
  const { ownedPerks, selectedRuneMods, quests } = state.profile;
  const selectedRuneModsByChamp = selectedRuneMods[selectedChampion.id];
  const questsByType = state.quests.quests;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    selectedChampion,
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
