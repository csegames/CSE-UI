/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {
  ChampionCostumeInfo,
  ChampionGQL,
  ChampionInfo,
  PerkDefGQL,
  PerkType,
  PurchaseDefGQL,
  QuestGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Overlay, hideOverlay, setCosmeticTab, showError } from '../../redux/navigationSlice';
import { RootState } from '../../redux/store';
import { Button } from '../shared/Button';
import { StringIDGeneralBack, getStringTableValue } from '../../helpers/stringTableHelpers';
import { ProfileModel } from '../../redux/profileSlice';
import {
  getEquippedEmotesForChampion,
  getWornCostumeForChampion,
  isPerkUnseen,
  markEquipmentSeen
} from '../../helpers/characterHelpers';
import { StarBadge } from '../../../shared/components/StarBadge';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { PerkMultiButton } from '../views/Lobby/PerkMultiButton';
import { RequestResult } from '@csegames/library/dist/_baseGame/types/Request';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { RadialMenu, RadialMenuButtonData, RadialMenuButtonStyle } from '../shared/RadialMenu';
import { getPerkTypeLocalizedName } from '../../helpers/perkUtils';
import { isFreeReward, isPurchaseable } from '../../helpers/storeHelpers';
import { KeybindIDs, KeybindsState } from '../../redux/keybindsSlice';
import { webConf } from '../../dataSources/networkConfiguration';
import { refreshProfile } from '../../dataSources/profileNetworking';
import { getIsBadgedForUnseenChampionEquipment } from '../../helpers/badgingUtils';

const Root = 'ChampionSelectCosmetics-Root';
const BackgroundBlurEdges = 'ChampionSelectCosmetics-BackgroundBlurEdges';
const BackgroundImage = 'ChampionSelectCosmetics-BackgroundImage';
const LeftPanel = 'ChampionSelectCosmetics-LeftPanel';
const RightPanel = 'ChampionSelectCosmetics-RightPanel';
const BackButton = 'ChampionSelectCosmetics-BackButton';
const ChampionName = 'ChampionSelectCosmetics-ChampionName';
const CosmeticType = 'ChampionSelectCosmetics-CosmeticType';
const NavBarContainer = 'ChampionSelectCosmetics-NavBarContainer';
const NavBarUnderline = 'ChampionSelectCosmetics-NavBarUnderline';
const NavBarTab = 'ChampionSelectCosmetics-NavBarTab';
const NavBadge = 'ChampionSelectCosmetics-NavBadge';
const ItemsContainerWrapper = 'ChampionSelectCosmetics-ItemsContainerWrapper';
const ItemsContainer = 'ChampionSelectCosmetics-ItemsContainer';
const ItemContainer = 'ChampionSelectCosmetics-ItemContainer';
const ItemBadge = 'ChampionSelectCosmetics-ItemBadge';
const ItemIcon = 'ChampionSelectCosmetics-ItemIcon';
const EquippedIcon = 'ChampionSelectCosmetics-EquippedIcon';
const LockedIcon = 'ChampionSelectCosmetics-LockedIcon';
const SkinPreview = 'ChampionSelectCosmetics-SkinPreview';
const PerkPreview = 'ChampionSelectCosmetics-PerkPreview';
const PerkPreviewImage = 'ChampionSelectCosmetics-PerkPreviewImage';
const ActionButton = 'ChampionSelectCosmetics-ActionButton';
const ActionLabel = 'ChampionSelectCosmetics-ActionLabel';
const PreviewInfoContainer = 'ChampionSelectCosmetics-PreviewInfoContainer';
const PreviewInfoTopSection = 'ChampionSelectCosmetics-PreviewInfoTopSection';
const PreviewInfoBottomSection = 'ChampionSelectCosmetics-PreviewInfoBottomSection';
const PreviewInfoTitle = 'ChampionSelectCosmetics-PreviewInfoTitle';
const PreviewInfoDescription = 'ChampionSelectCosmetics-PreviewInfoDescription';
const InlineChampionPortrait = 'ChampionSelectCosmetics-InlineChampionPortrait';
const InlineIcon = 'ChampionSelectCosmetics-InlineIcon';
const WidePortraitPreview = 'ChampionSelectCosmetics-WidePortraitPreview';
const SquarePortraitPreviewContainer = 'ChampionSelectCosmetics-SquarePortraitPreviewContainer';
const SquarePortraitPreview = 'ChampionSelectCosmetics-SquarePortraitPreview';
const PortraitPreviewTextContainer = 'ChampionSelectCosmetics-PortraitPreviewTextContainer';
const PortraitPreviewPlayerName = 'ChampionSelectCosmetics-PortraitPreviewPlayerName';
const PortraitPreviewChampionName = 'ChampionSelectCosmetics-PortraitPreviewChampionName';
const EmoteWheel = 'ChampionSelectCosmetics-EmoteWheel';
const EmoteButtonIcon = 'ChampionSelectCosmetics-EmoteButtonIcon';
const EmoteToBePlaced = 'ChampionSelectCosmetics-EmoteToBePlaced';
const EmoteInstructionsContainer = 'ChampionSelectCosmetics-EmoteInstructionsContainer';
const EmoteInstructionsRow = 'ChampionSelectCosmetics-EmoteInstructionsRow';
const EmoteInstructionsText = 'ChampionSelectCosmetics-EmoteInstructionsText';
const EmoteKeybindBox = 'ChampionSelectCosmetics-EmoteKeybindBox';
const EmoteKeybindText = 'ChampionSelectCosmetics-EmoteKeybindText';

const StringIDEquipEmotePrompt = 'CosmeticsEquipEmotePrompt';
const StringIDUseEmoteInstructions = 'CosmeticsUseEmoteInstructions';
const StringIDSetEmoteInstructions = 'CosmeticsSetEmoteInstructions';
const StringIDPurchasePrompt = 'CosmeticsPurchasePrompt';
const StringIDRedeemPrompt = 'CosmeticsRedeemPrompt';
const StringIDCosmetics: { [type in PerkType]: string } = {
  [PerkType.Costume]: 'ChampionInfoDisplaySkinsTitle',
  [PerkType.Weapon]: 'ChampionInfoDisplayWeaponsTitle',
  [PerkType.SprintFX]: 'ChampionInfoDisplaySprintsTitle',
  [PerkType.Emote]: 'ChampionInfoDisplayEmotesTitle',
  [PerkType.Portrait]: 'ChampionInfoDisplayPortraitsTitle',
  // Proper data typing on the key requires the inclusion of all PerkTypes.
  [PerkType.Invalid]: '',
  [PerkType.Currency]: '',
  [PerkType.Key]: '',
  [PerkType.CurrentBattlePassXP]: '',
  [PerkType.QuestXP]: '',
  [PerkType.RuneMod]: '',
  [PerkType.RuneModTierKey]: '',
  [PerkType.StatusMod]: '',
  [PerkType.StatMod]: ''
};
const StringIDPlayDefaultDisplayName = 'PlayDefaultDisplayName';

const tabIcons: { [type in PerkType]: string } = {
  [PerkType.Costume]: 'fs-icon-misc-skins',
  [PerkType.Weapon]: 'fs-icon-misc-weapons',
  [PerkType.SprintFX]: 'fs-icon-effects-speed-boost',
  [PerkType.Emote]: 'fs-icon-misc-emotes',
  [PerkType.Portrait]: 'fs-icon-misc-portraits',
  // Proper data typing on the key requires the inclusion of all PerkTypes.
  [PerkType.Invalid]: '',
  [PerkType.Currency]: '',
  [PerkType.Key]: '',
  [PerkType.CurrentBattlePassXP]: '',
  [PerkType.QuestXP]: '',
  [PerkType.RuneMod]: '',
  [PerkType.RuneModTierKey]: '',
  [PerkType.StatusMod]: '',
  [PerkType.StatMod]: ''
};

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  champions: ChampionInfo[];
  ownedPerks: Dictionary<number>;
  perks: PerkDefGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  cosmeticTab: PerkType;
  profile: ProfileModel;
  newEquipment: Dictionary<boolean>;
  championsGQL: ChampionGQL[];
  championCostumes: ChampionCostumeInfo[];
  purchases: PurchaseDefGQL[];
  displayName: string;
  maxEmoteCount: number;
  usingGamepadInMainMenu: boolean;
  keybinds: KeybindsState;
  progressionNodes: string[];
  quests: QuestGQL[];
  serverTimeDeltaMS: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  selectedPerkID: string;
  selectedSkinID: string;
  isSaving: boolean;
}

class AChampionSelectCosmetics extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedPerkID: this.getSortedCosmetics(this.props.cosmeticTab)[0].id,
      selectedSkinID: this.getInitialSkinID(),
      isSaving: false
    };
  }

  render(): JSX.Element {
    const item = this.getSelectedPerk();
    const isUnowned = this.props.ownedPerks[item.id] === undefined || this.props.ownedPerks[item.id] < 1;
    const purchase = this.props.purchases.find((purchase) => {
      return purchase.perks.length === 1 && purchase.perks[0].perkID === item.id;
    });
    const canBuy =
      !!purchase &&
      isPurchaseable(
        purchase,
        this.props.perksByID,
        this.props.ownedPerks,
        this.props.progressionNodes,
        this.props.quests,
        this.props.serverTimeDeltaMS
      );
    const isFree = !!purchase && isFreeReward(purchase);
    const costPerk = this.props.perksByID[purchase?.costs?.[0]?.perkID];
    const isShowingCostume = this.props.cosmeticTab === PerkType.Costume;
    const bindIndex = this.props.usingGamepadInMainMenu ? 1 : 0;
    const emoteKeybind = this.props.keybinds[KeybindIDs.Emote].binds[bindIndex];
    const emoteMenuKeybind = this.props.keybinds[KeybindIDs.EmoteMenu].binds[bindIndex];

    return (
      <div className={Root}>
        <div className={BackgroundBlurEdges}>
          <div className={BackgroundImage} />
        </div>
        <div className={LeftPanel}>
          <div className={ChampionName}>{this.props.selectedChampion.name}</div>
          <div className={CosmeticType}>
            {getStringTableValue(StringIDCosmetics[this.props.cosmeticTab], this.props.stringTable)}
          </div>
          <div className={NavBarContainer}>
            <div className={NavBarUnderline} />
            {this.renderNavBarTab(PerkType.Costume)}
            {this.renderNavBarTab(PerkType.Weapon)}
            {this.renderNavBarTab(PerkType.SprintFX)}
            {this.renderNavBarTab(PerkType.Emote)}
            {this.renderNavBarTab(PerkType.Portrait)}
          </div>
          <div className={ItemsContainerWrapper}>
            <div className={ItemsContainer}>
              {this.getSortedCosmetics(this.props.cosmeticTab).map(this.renderCosmeticItem.bind(this))}
            </div>
          </div>
          <Button
            type={'blue'}
            text={getStringTableValue(StringIDGeneralBack, this.props.stringTable).toUpperCase()}
            styles={BackButton}
            onClick={this.onBackClick.bind(this)}
            disabled={false}
          />
        </div>
        <div className={RightPanel}>
          <img className={`${SkinPreview} ${isShowingCostume ? 'selected' : ''}`} src={this.getCurrentSkinIconURL()} />
          <div className={`${PerkPreview} ${!isShowingCostume ? 'selected' : ''}`}>
            {this.renderPerkPreviewContents()}
          </div>
          {item && (
            <div className={PreviewInfoContainer}>
              <div className={PreviewInfoTopSection}>
                <div className={PreviewInfoTitle}>{item.name}</div>
                <div className={PreviewInfoDescription}>
                  <span>{`${getPerkTypeLocalizedName(item.perkType, this.props.stringTable)}\xa0\xa0-\xa0\xa0`}</span>
                  {this.renderInlineChampionPortrait()}
                  <span>{`\xa0\xa0${this.props.selectedChampion.name}`}</span>
                </div>
                <div className={PreviewInfoDescription}>{item.description}</div>
              </div>
              {isUnowned && canBuy && (
                <div className={PreviewInfoBottomSection}>
                  {!isFree &&
                    !!costPerk && ( // If it's not free, and we know the price, show the price.
                      <div className={PreviewInfoDescription}>
                        <div
                          className={`${InlineIcon} ${costPerk.iconClass}`}
                          style={{ color: `#${costPerk.iconClassColor}` }}
                        />
                        {addCommasToNumber(purchase.costs?.[0]?.qty ?? 0)}
                      </div>
                    )}
                  <div className={PreviewInfoDescription}>
                    {getStringTableValue(
                      isFree ? StringIDRedeemPrompt : StringIDPurchasePrompt,
                      this.props.stringTable
                    )}
                    {'\xa0\xa0'}
                    <div className={`${InlineIcon} fs-icon-misc-lock`} style={{ color: `#dddddd` }} />
                  </div>
                </div>
              )}
              {item.perkType === PerkType.Emote && (
                <div className={EmoteInstructionsContainer}>
                  <div className={EmoteInstructionsRow}>
                    <div className={EmoteInstructionsText}>
                      {getStringTableValue(StringIDUseEmoteInstructions, this.props.stringTable)}
                    </div>
                    <div className={EmoteKeybindBox}>
                      {emoteKeybind?.iconClass ? (
                        <span className={`${EmoteKeybindText} ${emoteKeybind?.iconClass}`} />
                      ) : (
                        <span className={EmoteKeybindText}>{emoteKeybind?.name}</span>
                      )}
                    </div>
                  </div>
                  <div className={EmoteInstructionsRow}>
                    <div className={EmoteInstructionsText}>
                      {getStringTableValue(StringIDSetEmoteInstructions, this.props.stringTable)}
                    </div>
                    <div className={EmoteKeybindBox}>
                      {emoteMenuKeybind?.iconClass ? (
                        <span className={`${EmoteKeybindText} ${emoteMenuKeybind?.iconClass}`} />
                      ) : (
                        <span className={EmoteKeybindText}>{emoteMenuKeybind?.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {this.renderActionButton()}
        </div>
      </div>
    );
  }

  private renderPerkPreviewContents(): React.ReactNode {
    const item = this.props.perksByID[this.state.selectedPerkID];

    const displayName = this.props.displayName
      ? this.props.displayName
      : getStringTableValue(StringIDPlayDefaultDisplayName, this.props.stringTable);

    switch (item.perkType) {
      case PerkType.Portrait: {
        return (
          <>
            <img className={WidePortraitPreview} src={item.portraitChampionSelectImageUrl} />
            <div className={SquarePortraitPreviewContainer}>
              <img className={SquarePortraitPreview} src={item.portraitThumbnailURL} />
              <div className={PortraitPreviewTextContainer}>
                <div className={PortraitPreviewPlayerName}>{displayName}</div>
                <div className={PortraitPreviewChampionName}>{this.props.selectedChampion.name}</div>
              </div>
            </div>
          </>
        );
      }
      case PerkType.Emote: {
        return (
          <RadialMenu
            className={EmoteWheel}
            buttons={this.getEmoteButtonData()}
            firstButtonAngle={-Math.PI / 2}
            onButtonClicked={this.onEmoteButtonClicked.bind(this)}
          >
            <img className={EmoteToBePlaced} src={item.iconURL} />
          </RadialMenu>
        );
      }
      default: {
        return <img className={PerkPreviewImage} src={this.getCurrentPerkIconURL()} />;
      }
    }
  }

  private async onEmoteButtonClicked(buttonIndex: number): Promise<void> {
    // Only try to equip a perk if we own that perk.
    if (this.props.ownedPerks[this.state.selectedPerkID]) {
      this.onEquipClick(this.state.selectedPerkID, buttonIndex);
    }
  }

  private getEmoteButtonData(): RadialMenuButtonData[] {
    const data: RadialMenuButtonData[] = [];

    // Buttons are "selected" if they match the current selected perkID.
    const equippedEmotes = getEquippedEmotesForChampion(
      this.props.selectedChampion.id,
      this.props.championsGQL,
      this.props.perksByID,
      this.props.maxEmoteCount
    );

    equippedEmotes.forEach((emotePerk, index) => {
      const d: RadialMenuButtonData = {
        renderContents: this.renderEmoteButtonContent.bind(this, emotePerk, index),
        isSelected: emotePerk?.id === this.state.selectedPerkID,
        styleOverride: this.getEmoteButtonStyleOverride.bind(this)
      };
      data.push(d);
    });

    return data;
  }

  private renderEmoteButtonContent(
    emotePerk: PerkDefGQL | null,
    index: number,
    isHovered: boolean,
    isSelected: boolean,
    isDisabled: boolean
  ): React.ReactNode {
    // No emote, no content.
    if (!emotePerk) {
      return null;
    } else {
      return (
        <img
          className={EmoteButtonIcon}
          src={(emotePerk.iconURL?.length ?? 0) > 0 ? emotePerk.iconURL : 'images/MissingAsset.png'}
          key={`${emotePerk.id}_${index}`}
        />
      );
    }
  }

  private getEmoteButtonStyleOverride(
    isHovered: boolean,
    isSelected: boolean,
    isDisabled: boolean
  ): RadialMenuButtonStyle {
    let backgroundColorStyle: RadialMenuButtonStyle = {
      backgroundColor: '#1d1d44'
    };
    if (isHovered) backgroundColorStyle.backgroundColor = '#333388';
    if (isSelected) backgroundColorStyle.backgroundColor = '#0e1124';

    let borderColorStyle: RadialMenuButtonStyle = {};
    if (isSelected) borderColorStyle.borderColor = '#1d1d44';

    const style: RadialMenuButtonStyle = {
      // By spreading styles in, we can support the case where a style is only overridden some of the time.
      ...backgroundColorStyle,
      ...borderColorStyle,
      borderWidth: '0.2%'
    };

    return style;
  }

  private getSelectedPerk(): PerkDefGQL {
    const itemId = this.props.cosmeticTab === PerkType.Costume ? this.state.selectedSkinID : this.state.selectedPerkID;
    return this.props.perksByID[itemId];
  }

  private renderInlineChampionPortrait(): JSX.Element {
    const portraitURL =
      getWornCostumeForChampion(
        this.props.championCostumes,
        this.props.championsGQL,
        this.props.perksByID,
        this.props.selectedChampion?.id
      )?.thumbnailURL ?? 'images/MissingAsset.png';

    return <img className={InlineChampionPortrait} src={portraitURL} />;
  }

  private renderActionButton(): React.ReactNode {
    if (this.props.cosmeticTab === PerkType.Emote && this.props.ownedPerks[this.state.selectedPerkID]) {
      // Just an instructional label for owned Emotes.
      return <div className={ActionLabel}>{getStringTableValue(StringIDEquipEmotePrompt, this.props.stringTable)}</div>;
    } else {
      const itemId =
        this.props.cosmeticTab === PerkType.Costume ? this.state.selectedSkinID : this.state.selectedPerkID;

      const equippedItemIDs = this.getEquippedCosmeticIDs();
      const isEquipped = equippedItemIDs.includes(itemId);

      return isEquipped ? null : (
        <PerkMultiButton
          additionalClassNames={ActionButton}
          isSaving={this.state.isSaving}
          perk={this.props.perksByID[itemId]}
          onEquip={this.onEquipClick.bind(this, itemId)}
        />
      );
    }

    return null;
  }

  private renderNavBarTab(tab: PerkType): React.ReactNode {
    const selectedClass = tab === this.props.cosmeticTab ? 'selected' : '';

    const shouldBadge = getIsBadgedForUnseenChampionEquipment(
      this.props.selectedChampion,
      this.props.champions,
      tab,
      this.props.newEquipment,
      this.props.perksByID,
      this.props.ownedPerks
    ).value;

    return (
      <div
        className={`${NavBarTab} ${selectedClass} ${tabIcons[tab]}`}
        onClick={() => {
          game.playGameSound(this.getSoundEventForTab(tab));
          this.props.dispatch?.(setCosmeticTab(tab));
        }}
      >
        {shouldBadge && <StarBadge className={NavBadge} />}
      </div>
    );
  }

  private getSoundEventForTab(tab: PerkType): SoundEvents {
    switch (tab) {
      case PerkType.Costume:
        return SoundEvents.PLAY_UI_CUSTOMIZEMENUPAGE_SKINS_CLICK;
      case PerkType.Emote:
        return SoundEvents.PLAY_UI_CUSTOMIZEMENUPAGE_EMOTE_CLICK;
      case PerkType.Portrait:
        return SoundEvents.PLAY_UI_CUSTOMIZEMENUPAGE_PORTRAIT_CLICK;
      case PerkType.SprintFX:
        return SoundEvents.PLAY_UI_CUSTOMIZEMENUPAGE_SPRINT_CLICK;
      case PerkType.Weapon:
        return SoundEvents.PLAY_UI_CUSTOMIZEMENUPAGE_WEAPONS_CLICK;
      default:
        return SoundEvents.PLAY_UI_CUSTOMIZEMENUPAGE_SKINS_CLICK;
    }
  }

  private renderCosmeticItem(item: PerkDefGQL): React.ReactNode {
    const equippedItemIDs = this.getEquippedCosmeticIDs();
    const isUnowned = this.props.ownedPerks[item.id] === undefined || this.props.ownedPerks[item.id] < 1;
    const isEquipped = equippedItemIDs.includes(item.id);
    const isBadged = isPerkUnseen(item.id, this.props.newEquipment, this.props.ownedPerks);
    const selectedClass =
      item.id === (this.props.cosmeticTab === PerkType.Costume ? this.state.selectedSkinID : this.state.selectedPerkID)
        ? 'selected'
        : '';
    const ownedClass = isUnowned ? 'unowned' : '';

    const imageURL = this.props.cosmeticTab === PerkType.Portrait ? item.portraitThumbnailURL : item.iconURL;

    return (
      <div
        className={`${ItemContainer} ${selectedClass} ${ownedClass}`}
        key={item.id}
        onClick={() => {
          game.playGameSound(SoundEvents.PLAY_UI_CUSTOMIZEMENU_ITEM_CLICK);

          // When the user clicks onto a "new" item, unbadge it.
          markEquipmentSeen(item.id, this.props.newEquipment, this.props.ownedPerks, this.props.dispatch);
          if (this.props.cosmeticTab === PerkType.Costume) {
            this.setState({ selectedSkinID: item.id });
          } else {
            this.setState({ selectedPerkID: item.id });
          }
        }}
      >
        <img
          className={`${ItemIcon} ${this.props.cosmeticTab}`}
          src={imageURL && imageURL.length > 0 ? imageURL : 'images/MissingAsset.png'}
        />
        {isEquipped && <div className={`${EquippedIcon} fs-icon-misc-pass`} />}
        {isUnowned && <div className={`${LockedIcon} fs-icon-misc-lock`} />}
        {isBadged && <StarBadge className={ItemBadge} />}
      </div>
    );
  }

  private async onEquipClick(itemId: string, index: number): Promise<void> {
    game.playGameSound(SoundEvents.PLAY_UI_CUSTOMIZEMENU_EQUIP_CLICK);

    this.setState({ isSaving: true });

    let res: RequestResult = null;
    switch (this.props.cosmeticTab) {
      case PerkType.Costume: {
        res = await ProfileAPI.SetChampionCostume(webConf, this.props.selectedChampion.id, itemId);
        break;
      }
      case PerkType.Weapon: {
        res = await ProfileAPI.SetChampionWeapon(webConf, this.props.selectedChampion.id, itemId);
        break;
      }
      case PerkType.SprintFX: {
        res = await ProfileAPI.SetChampionSprintFX(webConf, this.props.selectedChampion.id, itemId);
        break;
      }
      case PerkType.Emote: {
        res = await ProfileAPI.SetChampionEmote(webConf, this.props.selectedChampion.id, itemId, index);
        break;
      }
      case PerkType.Portrait: {
        res = await ProfileAPI.SetChampionPortrait(webConf, this.props.selectedChampion.id, itemId);
        break;
      }
    }

    if (res.ok) {
      refreshProfile();
    } else {
      this.props.dispatch(showError(res));
    }
    this.setState({ isSaving: false });
  }

  private getInitialSkinID(): string {
    const equippedChampion = this.props.profile.champions.find((c) => c.championID == this.props.selectedChampion?.id);

    if (this.props.cosmeticTab === PerkType.Costume) {
      // Currently previewing Skins, so use whatever is selected (the first item).
      const selectedSkin = this.props.perksByID[this.getSortedCosmetics(this.props.cosmeticTab)[0].id];
      return selectedSkin.id;
    } else {
      // Not currently previewing Skins, so use whatever they have equipped.
      const equippedSkin = equippedChampion ? this.props.perksByID[equippedChampion.costumePerkID] : null;
      return equippedSkin.id;
    }
  }

  private getCurrentSkinIconURL(): string {
    const skin = this.props.perksByID[this.state.selectedSkinID];
    return skin.iconURL && skin.iconURL.length > 0 ? skin.iconURL : 'images/MissingAsset.png';
  }

  private getCurrentPerkIconURL(): string {
    const selectedPerk = this.props.perksByID[this.state.selectedPerkID];
    return selectedPerk.iconURL && selectedPerk.iconURL.length > 0 ? selectedPerk.iconURL : 'images/MissingAsset.png';
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // On tab change, select the first item so we don't have to make a no-selection state.
    if (prevProps.cosmeticTab !== this.props.cosmeticTab) {
      if (this.props.cosmeticTab === PerkType.Costume) {
        this.setState({ selectedSkinID: this.getSortedCosmetics(this.props.cosmeticTab)[0].id });
      } else {
        const equippedChampion = this.props.profile.champions.find(
          (c) => c.championID == this.props.selectedChampion?.id
        );
        this.setState({
          selectedPerkID: this.getSortedCosmetics(this.props.cosmeticTab)[0].id,
          // When not previewing skins, the shown skin is the equipped skin.
          selectedSkinID: this.props.perksByID[equippedChampion.costumePerkID].id
        });
      }
    }
  }

  private onBackClick(): void {
    game.playGameSound(SoundEvents.PLAY_UI_CUSTOMIZEMENUPAGE_BACK_CLICK);
    this.props.dispatch(hideOverlay(Overlay.ChampionSelectCosmetics));
  }

  private getEquippedCosmeticIDs(): string[] {
    const equippedChampion = this.props.profile.champions.find((c) => c.championID == this.props.selectedChampion?.id);
    if (!equippedChampion) {
      return null;
    } else {
      switch (this.props.cosmeticTab) {
        case PerkType.Costume: {
          return [equippedChampion.costumePerkID];
        }
        case PerkType.Weapon: {
          return [equippedChampion.weaponPerkID];
        }
        case PerkType.SprintFX: {
          return [equippedChampion.sprintFXPerkID];
        }
        case PerkType.Emote: {
          return equippedChampion.emotePerkIDs;
        }
        case PerkType.Portrait: {
          return [equippedChampion.portraitPerkID];
        }
        default: {
          console.error(`Unsupported PerkType: ${this.props.cosmeticTab}.`);
          return null;
        }
      }
    }
  }

  private getSortedCosmetics(type: PerkType): PerkDefGQL[] {
    // We only want cosmetics that match the currently selected champion.
    const cosmetics = this.props.perks.filter((p) => {
      return (
        p.perkType === type &&
        (!p.champion || p.champion.id === this.props.selectedChampion?.id) &&
        (p.showIfUnowned || this.props.ownedPerks[p.id])
      );
    });

    cosmetics.sort((pa, pb) => {
      const aIsDefault = pa.id.indexOf('default') !== -1;
      const bIsDefault = pb.id.indexOf('default') !== -1;

      // Default is always first.
      // There should only be one default per champion, so this check can be a little simpler.
      if (aIsDefault) {
        return -1;
      }
      if (bIsDefault) {
        return 1;
      }

      // Owned comes before unowned.
      const aIsOwned = this.props.ownedPerks[pa.id] !== undefined && this.props.ownedPerks[pa.id] > 0 ? 1 : 0;
      const bIsOwned = this.props.ownedPerks[pb.id] !== undefined && this.props.ownedPerks[pb.id] > 0 ? 1 : 0;
      const ownedSort = bIsOwned - aIsOwned;
      if (ownedSort !== 0) {
        return ownedSort;
      }

      // Sort by ID at the end to make sure we maintain a consistent order.
      if (pa.id < pb.id) {
        return -1;
      } else if (pa.id > pb.id) {
        return 1;
      }

      return 0;
    });

    return cosmetics;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion } = state.championInfo;
  const { ownedPerks, quests, progressionNodes } = state.profile;
  const { stringTable } = state.stringTable;
  const { perks, perksByID, newEquipment, purchases } = state.store;
  const { cosmeticTab } = state.navigation;
  const { championCostumes, champions } = state.championInfo;
  const { champions: championsGQL } = state.profile;
  const { displayName } = state.user;
  const { maxEmoteCount } = state.gameSettings;
  const { usingGamepadInMainMenu } = state.baseGame;
  const { serverTimeDeltaMS } = state.clock;

  return {
    ...ownProps,
    selectedChampion,
    champions,
    ownedPerks,
    perks,
    perksByID,
    stringTable,
    cosmeticTab,
    profile: state.profile,
    newEquipment,
    championsGQL,
    championCostumes,
    purchases,
    displayName,
    maxEmoteCount,
    usingGamepadInMainMenu,
    keybinds: state.keybinds,
    progressionNodes,
    quests,
    serverTimeDeltaMS
  };
}

export const ChampionSelectCosmetics = connect(mapStateToProps)(AChampionSelectCosmetics);
