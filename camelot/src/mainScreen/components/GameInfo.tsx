/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration, addConditionalWidgetExiting } from '../redux/hudSlice';
import { AddDispatch, RootState } from '../redux/store';
import { MenuSectionData, MenuTabData } from './menu/menuData';
import { Menu } from './menu/Menu';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { allChatScopeDisplayData, getChatScopeFromSlashSelector } from './chat/ChatScopes';
import { MapDataType } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { getFactionData } from '../gameData/factionData';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { ItemDef } from '../dataSources/manifest/itemManifest';
import { ArmorCategoryDef } from '../dataSources/manifest/armorCategoryManifest';
import { getItemEquippedInGearSlot } from '../helpers/itemHelpers';
import { VideoPlayer } from '../../shared/components/VideoPlayer';
import { BorderType, FactionBorder } from './FactionBorder';
import { FactionCheckbox } from './FactionCheckbox';
import ArthCraftingVideo from '../../images/Tutorial/Arth_Crafting.webm';
import VikingCraftingVideo from '../../images/Tutorial/Viking_Crafting.webm';
import TDDCraftingVideo from '../../images/Tutorial/tdd_Crafting.webm';
import ArthLevelingImage from '../../images/Tutorial/Arth_leveling.png';
import VikingLevelingImage from '../../images/Tutorial/Viking_leveling.png';
import TDDLevelingImage from '../../images/Tutorial/TDD_leveling.png';
import ArthCombatImage from '../../images/Tutorial/Arth_Combat.png';
import VikingCombatImage from '../../images/Tutorial/Viking_Combat.png';
import TDDCombatImage from '../../images/Tutorial/TDD_Combat.png';
import ArthPortalsVideo from '../../images/Tutorial/Arth_Portals.webm';
import VikingPortalsVideo from '../../images/Tutorial/Viking_Portals.webm';
import TDDPortalsVideo from '../../images/Tutorial/TDD_Portals.webm';
import ArthCombatVideo from '../../images/Tutorial/Arth_Combat.webm';
import VikingCombatVideo from '../../images/Tutorial/Viking_Combat.webm';
import TDDCombatVideo from '../../images/Tutorial/TDD_Combat.webm';
import ArthVendorVideo from '../../images/Tutorial/Arth_vendor.webm';
import VikingVendorVideo from '../../images/Tutorial/Viking_vendor.webm';
import TDDVendorVideo from '../../images/Tutorial/TDD_vendor.webm';
import ArthAbilityVideo from '../../images/Tutorial/Arth_AB.webm';
import VikingAbilityVideo from '../../images/Tutorial/Viking_AB.webm';
import TDDAbilityVideo from '../../images/Tutorial/TDD_AB.webm';
import ArthNewTabVideo from '../../images/Tutorial/Arth_NewTab.webm';
import VikingNewTabVideo from '../../images/Tutorial/Viking_NewTab.webm';
import TDDNewTabVideo from '../../images/Tutorial/TDD_NewTab.webm';
import ArthEditTabVideo from '../../images/Tutorial/Arth_EditTab.webm';
import VikingEditTabVideo from '../../images/Tutorial/Viking_EditTab.webm';
import TDDEditTabVideo from '../../images/Tutorial/TDD_EditTab.webm';
import ArthUIVideo from '../../images/tutorial/Arth_ui.webm';
import VikingUIVideo from '../../images/tutorial/Viking_ui.webm';
import TDDUIVideo from '../../images/tutorial/TDD_ui.webm';
import ArthCapVideo from '../../images/Tutorial/Arth_cap.webm';
import VikingCapVideo from '../../images/Tutorial/Viking_cap.webm';
import TDDCapVideo from '../../images/Tutorial/TDD_cap.webm';
import ArthMineVideo from '../../images/Tutorial/Arth_mine.webm';
import VikingMineVideo from '../../images/Tutorial/Viking_mine.webm';
import TDDMineVideo from '../../images/Tutorial/TDD_mine.webm';

const Root = 'HUD-GameInfo-Root';
const WelcomeHeader = 'HUD-GameInfo-WelcomeHeader';
const WelcomeTitle = 'HUD-GameInfo-WelcomeTitle';
const WelcomeSubtitle = 'HUD-GameInfo-WelcomeSubtitle';
const SectionBody = 'HUD-GameInfo-SectionBody';
const SectionHeading = 'HUD-GameInfo-SectionHeading';
const SectionDivider = 'HUD-GameInfo-SectionDivider';
const Paragraph = 'HUD-GameInfo-Paragraph';
const CommandRow = 'HUD-GameInfo-CommandRow';
const CommandKey = 'HUD-GameInfo-CommandKey';
const CommandDesc = 'HUD-GameInfo-CommandDesc';
const StationRow = 'HUD-GameInfo-StationRow';
const StationKey = 'HUD-GameInfo-StationKey';
const StationName = 'HUD-GameInfo-StationName';
const StationIcon = 'HUD-GameInfo-StationIcon';
const ProficiencyNote = 'HUD-GameInfo-ProficiencyNote';
const VideoContainer = 'HUD-GameInfo-VideoContainer';
const VideoBorder = 'HUD-GameInfo-VideoBorder';
const CombatVideoBorder = 'HUD-GameInfo-CombatVideoBorder';
const Video = 'HUD-GameInfo-Video';
const VideoStepsRow = 'HUD-GameInfo-VideoStepsRow';
const VideoStepsRowTop = 'HUD-GameInfo-VideoStepsRowTop';
const StepsColumn = 'HUD-GameInfo-StepsColumn';
const SubHeading = 'HUD-GameInfo-SubHeading';
const SubSubHeading = 'HUD-GameInfo-SubSubHeading';
const ImageContainer = 'HUD-GameInfo-ImageContainer';
const ImageBorder = 'HUD-GameInfo-ImageBorder';
const LevelingImage = 'HUD-GameInfo-LevelingImage';
const CombatImage = 'HUD-GameInfo-CombatImage';
const PortalLegend = 'HUD-GameInfo-PortalLegend';
const PortalRow = 'HUD-GameInfo-PortalRow';
const PortalIconClass = 'HUD-GameInfo-PortalIcon';
const PortalLabel = 'HUD-GameInfo-PortalLabel';
const BuildingRow = 'HUD-GameInfo-BuildingRow';
const BuildingIcon = 'HUD-GameInfo-BuildingIcon';
const BuildingInfo = 'HUD-GameInfo-BuildingInfo';
const BuildingTitle = 'HUD-GameInfo-BuildingTitle';
const BuildingBody = 'HUD-GameInfo-BuildingBody';
const ShowAtStartupLabel = 'HUD-GameInfo-ShowAtStartupLabel';

// The gear slot whose equipped armor determines the character's armor proficiency.
const ProficiencyGearSlotID = 'Torso';

const CraftingVideosByFaction: Record<string, string> = {
  Arthurian: ArthCraftingVideo,
  Viking: VikingCraftingVideo,
  TDD: TDDCraftingVideo
};

const LevelingImagesByFaction: Record<string, string> = {
  Arthurian: ArthLevelingImage,
  Viking: VikingLevelingImage,
  TDD: TDDLevelingImage
};

const CombatImagesByFaction: Record<string, string> = {
  Arthurian: ArthCombatImage,
  Viking: VikingCombatImage,
  TDD: TDDCombatImage
};

const CombatVideosByFaction: Record<string, string> = {
  Arthurian: ArthCombatVideo,
  Viking: VikingCombatVideo,
  TDD: TDDCombatVideo
};

const PortalVideosByFaction: Record<string, string> = {
  Arthurian: ArthPortalsVideo,
  Viking: VikingPortalsVideo,
  TDD: TDDPortalsVideo
};

const VendorVideosByFaction: Record<string, string> = {
  Arthurian: ArthVendorVideo,
  Viking: VikingVendorVideo,
  TDD: TDDVendorVideo
};

const AbilityVideosByFaction: Record<string, string> = {
  Arthurian: ArthAbilityVideo,
  Viking: VikingAbilityVideo,
  TDD: TDDAbilityVideo
};

const NewTabVideosByFaction: Record<string, string> = {
  Arthurian: ArthNewTabVideo,
  Viking: VikingNewTabVideo,
  TDD: TDDNewTabVideo
};

const EditTabVideosByFaction: Record<string, string> = {
  Arthurian: ArthEditTabVideo,
  Viking: VikingEditTabVideo,
  TDD: TDDEditTabVideo
};

const UIVideosByFaction: Record<string, string> = {
  Arthurian: ArthUIVideo,
  Viking: VikingUIVideo,
  TDD: TDDUIVideo
};

const CapVideosByFaction: Record<string, string> = {
  Arthurian: ArthCapVideo,
  Viking: VikingCapVideo,
  TDD: TDDCapVideo
};

const MineVideosByFaction: Record<string, string> = {
  Arthurian: ArthMineVideo,
  Viking: VikingMineVideo,
  TDD: TDDMineVideo
};

const PortalIconTypes: MapDataType[] = [MapDataType.PortalLocal, MapDataType.PortalZone];

// The portal legend reuses the world map's POI labels (e.g. "MapPOIName_PortalLocal").
const StringIDPrefixMapPOIName = 'MapPOIName_';

const StationIconTypes: Record<string, MapDataType> = {
  textiles: MapDataType.CraftingTailoring,
  leatherworking: MapDataType.CraftingLeatherworking,
  blacksmithing: MapDataType.CraftingSmithy,
  woodworking: MapDataType.CraftingWoodworking,
  alchemy: MapDataType.CraftingAlchemy,
  cooking: MapDataType.CraftingCooking,
  jewelry: MapDataType.CraftingJewels,
  artifice: MapDataType.CraftingArtifice,
  forge: MapDataType.CraftingForge
};

const StringIDGameInfoTitle = 'GameInfoTitle';
const StringIDTabHelp = 'FTUETabHelp';
const StringIDShowAtStartup = 'FTUEShowAtStartup';

const StringIDWelcomeMain = 'FTUESectionWelcomeMain';
const StringIDWelcomeSub = 'FTUESectionWelcomeSub';

const StringIDChatHeading = 'FTUESectionChat';
const StringIDChatSubHeaderOne = 'FTUESectionChatSubHeaderOne';
const StringIDChatBodyOne = 'FTUESectionChatBodyOne';
const StringIDChatSubHeaderTwo = 'FTUESectionChatSubHeaderTwo';
const StringIDChatBodyTwo = 'FTUESectionChatBodyTwo';
const StringIDChatSubHeaderChatCommands = 'FTUESectionChatSubHeaderChatCommands';
const StringIDChatBodyChatCommands = 'FTUESectionChatBodyChatCommands';
const StringIDChatList = 'FTUESectionChatList';
const StringIDFollowListSubHeader = 'FTUESectionFollowListSubHeader';
const StringIDFollowListBody = 'FTUESectionFollowListBody';
const StringIDFollowList = 'FTUESectionFollowList';

const StringIDCraftArmorHeading = 'FTUESectionCrafting';
const StringIDCraftingGathering = 'FTUESectionCraftingGathering';
const StringIDCraftArmorStartHeader = 'FTUESectionCraftArmorStartHeader';
const StringIDCraftArmorStartBody = 'FTUESectionCraftArmorStartBody';
const StringIDCraftArmorIntro = 'FTUESectionCraftArmorHeader';
const StringIDCraftArmorList = 'FTUESectionCraftArmorList';
const StringIDCraftingProficiency = 'FTUESectionCraftingProficiency';
const StringIDCraftingProcessHeader = 'FTUESectionCraftingProcessHeader';
const StringIDCraftingProcessBody = 'FTUESectionCraftingProcessBody';
const StringIDCraftingResourcesHeader = 'FTUESectionCraftingResourcesHeader';
const StringIDCraftingCapture = 'FTUESectionCraftingCapture';
const StringIDCraftingGather = 'FTUESectionCraftingGather';
const StringIDCraftingResourcesBody = 'FTUESectionCraftingResourcesBody';
const StringIDCraftingHighLevelHeader = 'FTUESectionCraftingHighLevelResourcesHeader';
const StringIDCraftingHighLevelBody = 'FTUESectionCraftingHighLevelResourcesBody';
const StringIDCraftingBodyFollowUp = 'FTUESectionCraftingBodyFollowUp';

const StringIDCombatHeading = 'FTUESectionCombatHeader';
const StringIDCombatSubHeaderOne = 'FTUESectionCombatSubHeaderOne';
const StringIDCombatBodyOne = 'FTUESectionCombatBodyOne';
const StringIDCombatList = 'FTUESectionCombatList';
const StringIDCombatSubHeaderTwo = 'FTUESectionCombatSubHeaderTwo';
const StringIDCombatBodyTwo = 'FTUESectionCombatBodyTwo';

const StringIDLevelingHeading = 'FTUESectionLevelingHeader';
const StringIDLevelingSubHeaderOne = 'FTUESectionLevelingSubHeaderOne';
const StringIDLevelingBodyOne = 'FTUESectionLevelingBodyOne';
const StringIDLevelingSubHeaderTwo = 'FTUESectionLevelingSubHeaderTwo';
const StringIDLevelingBodyTwo = 'FTUESectionLevelingBodyTwo';

const StringIDNavigationHeading = 'FTUESectionNavigation';
const StringIDNavigationHeaderOne = 'FTUESectionNavigationHeaderOne';
const StringIDNavigationBodyOne = 'FTUESectionNavigationBodyOne';
const StringIDNavigationHeaderTwo = 'FTUESectionNavigationHeaderTwo';
const StringIDNavigationBodyTwo = 'FTUESectionNavigationBodyTwo';
const StringIDNavigationHeaderThree = 'FTUESectionNavigationHeaderThree';
const StringIDNavigationBodyThree = 'FTUESectionNavigationBodyThree';
const StringIDNavigationHeaderFour = 'FTUESectionNavigationHeaderFour';
const StringIDNavigationBodyFour = 'FTUESectionNavigationBodyFour';
const StringIDNavigationTravelHeader = 'FTUESectionNavigationTravelHeader';
const StringIDNavigationTravelBody = 'FTUESectionNavigationTravelBody';

const StringIDRvrHeading = 'FTUESectionRvr';
const StringIDRvrHeaderOne = 'FTUESectionRvrHeaderOne';
const StringIDRvrBodyOne = 'FTUESectionRvrBodyOne';
const StringIDRvrHeaderTwo = 'FTUESectionRvrHeaderTwo';
const StringIDRvrBodyTwo = 'FTUESectionRvrBodyTwo';
const StringIDRvrHeaderThree = 'FTUESectionRvrHeaderThree';
const StringIDRvrBodyThree = 'FTUESectionRvrBodyThree';
const StringIDRvrKeepHeader = 'FTUESectionRvrKeepHeader';
const StringIDRvrKeepBody = 'FTUESectionRvrKeepBody';
const StringIDRvrChapelHeader = 'FTUESectionRvrChapelHeader';
const StringIDRvrChapelBody = 'FTUESectionRvrChapelBody';
const StringIDRvrStablesHeader = 'FTUESectionRvrStablesHeader';
const StringIDRvrStablesBody = 'FTUESectionRvrStablesBody';
const StringIDRvrArmoryHeader = 'FTUESectionRvrArmoryHeader';
const StringIDRvrArmoryBody = 'FTUESectionRvrArmoryBody';
const StringIDRvrBarracksHeader = 'FTUESectionRvrBarracksHeader';
const StringIDRvrBarracksBody = 'FTUESectionRvrBarracksBody';

const StringIDUIHeading = 'FTUESectionUI';
const StringIDUIHeader = 'FTUESectionUIHeader';
const StringIDUIBody = 'FTUESectionUIBody';

const StringIDEconomyHeading = 'FTUESectionEconomy';
const StringIDEconomyHeaderOne = 'FTUESectionEconomyHeaderOne';
const StringIDEconomyBodyOne = 'FTUESectionEconomyBodyOne';
const StringIDEconomyHeaderTwo = 'FTUESectionEconomyHeaderTwo';
const StringIDEconomyBodyTwo = 'FTUESectionEconomyBodyTwo';
const StringIDEconomySubHeaderOne = 'FTUESectionEconomySubHeaderOne';
const StringIDEconomySubBodyOne = 'FTUESectionEconomySubBodyOne';
const StringIDEconomySubHeaderTwo = 'FTUESectionEconomySubHeaderTwo';
const StringIDEconomySubBodyTwo = 'FTUESectionEconomySubBodyTwo';

const NavigationSubsections: { headerID: string; bodyID: string; showPortals?: boolean }[] = [
  { headerID: StringIDNavigationHeaderOne, bodyID: StringIDNavigationBodyOne },
  { headerID: StringIDNavigationHeaderTwo, bodyID: StringIDNavigationBodyTwo },
  { headerID: StringIDNavigationHeaderThree, bodyID: StringIDNavigationBodyThree, showPortals: true },
  { headerID: StringIDNavigationHeaderFour, bodyID: StringIDNavigationBodyFour },
  { headerID: StringIDNavigationTravelHeader, bodyID: StringIDNavigationTravelBody }
];

const RvrSubsections: { headerID: string; bodyID: string }[] = [
  { headerID: StringIDRvrHeaderOne, bodyID: StringIDRvrBodyOne },
  { headerID: StringIDRvrHeaderTwo, bodyID: StringIDRvrBodyTwo },
  { headerID: StringIDRvrHeaderThree, bodyID: StringIDRvrBodyThree }
];

const RvrBuildings: { type: MapDataType; titleID: string; bodyID: string }[] = [
  { type: MapDataType.KeepMain, titleID: StringIDRvrKeepHeader, bodyID: StringIDRvrKeepBody },
  { type: MapDataType.KeepTowerChurch, titleID: StringIDRvrChapelHeader, bodyID: StringIDRvrChapelBody },
  { type: MapDataType.KeepTowerStable, titleID: StringIDRvrStablesHeader, bodyID: StringIDRvrStablesBody },
  { type: MapDataType.KeepTowerArmory, titleID: StringIDRvrArmoryHeader, bodyID: StringIDRvrArmoryBody },
  { type: MapDataType.KeepTowerBarrack, titleID: StringIDRvrBarracksHeader, bodyID: StringIDRvrBarracksBody }
];

const EconomyMethods: { headerID: string; bodyID: string }[] = [
  { headerID: StringIDEconomySubHeaderOne, bodyID: StringIDEconomySubBodyOne },
  { headerID: StringIDEconomySubHeaderTwo, bodyID: StringIDEconomySubBodyTwo }
];


interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  uiFactionID: string;
  equippedItems: Item[];
  itemsByNumericID: Record<number, ItemDef>;
  armorCategories: Record<string, ArmorCategoryDef>;
}

type Props = ReactProps & InjectedProps & AddDispatch;

enum GameInfoTab {
  Help = 'help'
}

enum GameInfoSection {
  Chat = 'chat',
  Tradeskills = 'tradeskills',
  Combat = 'combat',
  LevelingAbilities = 'levelingAbilities',
  Navigation = 'navigation',
  Rvr = 'rvr',
  Economy = 'economy',
  UI = 'ui'
}

interface SectionConfig {
  id: GameInfoSection;
  // String ID for both the left-nav label and the section heading.
  headingID: string;
}

const SECTIONS: SectionConfig[] = [
  { id: GameInfoSection.Chat, headingID: StringIDChatHeading },
  { id: GameInfoSection.Tradeskills, headingID: StringIDCraftArmorHeading },
  { id: GameInfoSection.Combat, headingID: StringIDCombatHeading },
  { id: GameInfoSection.LevelingAbilities, headingID: StringIDLevelingHeading },
  { id: GameInfoSection.Navigation, headingID: StringIDNavigationHeading },
  { id: GameInfoSection.Rvr, headingID: StringIDRvrHeading },
  { id: GameInfoSection.Economy, headingID: StringIDEconomyHeading },
  { id: GameInfoSection.UI, headingID: StringIDUIHeading }
];

interface State {
  showAtStartup: boolean;
}

class AGameInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showAtStartup: clientAPI.getShowGameInfoAtStartup() };
  }

  private onShowAtStartupChanged = (showAtStartup: boolean): void => {
    this.setState({ showAtStartup });
    clientAPI.setShowGameInfoAtStartup(showAtStartup);
  };

  render(): JSX.Element {
    const sections: MenuSectionData[] = SECTIONS.map((section) => ({
      id: section.id,
      title: this.text(section.headingID),
      content: {
        scrollable: true,
        node: this.renderSection(section.id, section.headingID)
      }
    }));

    const tabs: MenuTabData[] = [
      {
        id: GameInfoTab.Help,
        title: this.text(StringIDTabHelp),
        sections
      }
    ];

    return (
      <div className={Root}>
        <Menu
          isDragCopy={this.props.isDragCopy}
          title={this.text(StringIDGameInfoTitle)}
          menuID={WIDGET_ID_GAME_INFO}
          closeSelf={this.closeSelf.bind(this)}
          tabs={tabs}
          hideTabBar
          header={this.renderWelcomeHeader()}
          escapable
          sidebarFooter={
            <FactionCheckbox
              className={ShowAtStartupLabel}
              isChecked={this.state.showAtStartup}
              labelText={this.text(StringIDShowAtStartup)}
              onCheckedChanged={this.onShowAtStartupChanged}
            />
          }
        />
      </div>
    );
  }

  private text(entryID: string): string {
    return getStringTableValue(entryID, this.props.stringTable);
  }

  private renderWelcomeHeader(): React.ReactNode {
    const subtitle = this.text(StringIDWelcomeSub);
    return (
      <div className={WelcomeHeader}>
        <div className={WelcomeTitle} style={{ color: this.getHighlightColor() }}>
          {this.text(StringIDWelcomeMain)}
        </div>
        {subtitle.length > 0 && <div className={WelcomeSubtitle}>{subtitle}</div>}
      </div>
    );
  }

  private renderSection(sectionId: GameInfoSection, headingID: string): React.ReactNode {
    const highlightColor = this.getHighlightColor();
    return (
      <div className={SectionBody}>
        <div className={SectionHeading} style={{ color: highlightColor }}>
          {this.text(headingID)}
        </div>
        <div className={SectionDivider} style={{ background: `linear-gradient(to right, ${highlightColor}, transparent)` }} />
        {this.renderSectionContent(sectionId)}
      </div>
    );
  }

  private renderSectionContent(sectionId: GameInfoSection): React.ReactNode {
    switch (sectionId) {
      case GameInfoSection.Chat:
        return this.renderChatBody();
      case GameInfoSection.Tradeskills:
        return this.renderTradeskillsBody();
      case GameInfoSection.Combat:
        return this.renderCombatBody();
      case GameInfoSection.LevelingAbilities:
        return this.renderLevelingAbilitiesBody();
      case GameInfoSection.Navigation:
        return this.renderNavigationBody();
      case GameInfoSection.Rvr:
        return this.renderRvrBody();
      case GameInfoSection.Economy:
        return this.renderEconomyBody();
      case GameInfoSection.UI:
        return this.renderUIBody();
      default:
        return null;
    }
  }

  private renderChatBody(): React.ReactNode {
    const highlightColor = this.getHighlightColor();
    return (
      <>
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDChatSubHeaderChatCommands)}
        </div>
        {this.renderBody(this.text(StringIDChatBodyChatCommands))}
        {this.renderCommandList(this.text(StringIDChatList))}
        {this.renderChatTab(StringIDChatSubHeaderOne, StringIDChatBodyOne, NewTabVideosByFaction)}
        {this.renderChatTab(StringIDChatSubHeaderTwo, StringIDChatBodyTwo, EditTabVideosByFaction)}
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDFollowListSubHeader)}
        </div>
        {this.renderBody(this.text(StringIDFollowListBody))}
        {this.renderCommandList(this.text(StringIDFollowList))}
      </>
    );
  }

  private renderChatTab(headerID: string, bodyID: string, videosByFaction: Record<string, string>): React.ReactNode {
    return (
      <>
        <div className={SubHeading} style={{ color: this.getHighlightColor() }}>
          {this.text(headerID)}
        </div>
        {this.renderBody(this.text(bodyID))}
        {this.renderRealmVideo(videosByFaction)}
      </>
    );
  }

  private renderTradeskillsBody(): React.ReactNode {
    const currentArmorType = this.getCurrentArmorTypeName();
    const highlightColor = this.getHighlightColor();
    return (
      <>
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDCraftingGathering)}
        </div>
        <p className={Paragraph}>{this.text(StringIDCraftArmorIntro)}</p>
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDCraftArmorStartHeader)}
        </div>
        {this.renderBody(this.text(StringIDCraftArmorStartBody))}
        {this.renderArmorList(this.text(StringIDCraftArmorList), currentArmorType)}
        <div className={VideoStepsRow}>
          {this.renderRealmVideo(CraftingVideosByFaction)}
          <div className={StepsColumn}>
            <div className={SubHeading} style={{ color: highlightColor }}>
              {this.text(StringIDCraftingProcessHeader)}
            </div>
            {this.renderBody(this.text(StringIDCraftingProcessBody))}
          </div>
        </div>
        <p className={Paragraph}>{this.text(StringIDCraftingBodyFollowUp)}</p>
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDCraftingResourcesHeader)}
        </div>
        {this.renderBody(this.text(StringIDCraftingResourcesBody))}
        <div className={VideoStepsRow}>
          <div>
            <div className={SubSubHeading} style={{ color: highlightColor }}>
              {this.text(StringIDCraftingCapture)}
            </div>
            {this.renderRealmVideo(CapVideosByFaction)}
          </div>
          <div>
            <div className={SubSubHeading} style={{ color: highlightColor }}>
              {this.text(StringIDCraftingGather)}
            </div>
            {this.renderRealmVideo(MineVideosByFaction)}
          </div>
        </div>
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDCraftingHighLevelHeader)}
        </div>
        {this.renderBody(this.text(StringIDCraftingHighLevelBody))}
      </>
    );
  }

  private renderCombatBody(): React.ReactNode {
    const highlightColor = this.getHighlightColor();
    return (
      <>
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDCombatSubHeaderOne)}
        </div>
        {this.renderBody(this.text(StringIDCombatBodyOne))}
        {this.renderKeybindList(this.text(StringIDCombatList))}
        {this.renderCombatImage()}
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDCombatSubHeaderTwo)}
        </div>
        {this.renderBody(this.text(StringIDCombatBodyTwo))}
        {this.renderRealmVideo(CombatVideosByFaction, CombatVideoBorder)}
      </>
    );
  }

  private renderLevelingAbilitiesBody(): React.ReactNode {
    const highlightColor = this.getHighlightColor();
    return (
      <>
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDLevelingSubHeaderOne)}
        </div>
        {this.renderBody(this.text(StringIDLevelingBodyOne))}
        {this.renderRealmVideo(AbilityVideosByFaction)}
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDLevelingSubHeaderTwo)}
        </div>
        {this.renderBody(this.text(StringIDLevelingBodyTwo))}
        {this.renderLevelingImage()}
      </>
    );
  }

  private renderNavigationBody(): React.ReactNode {
    const highlightColor = this.getHighlightColor();
    return (
      <>
        {NavigationSubsections.map((sub, index) => (
          <React.Fragment key={index}>
            <div className={SubHeading} style={{ color: highlightColor }}>
              {this.text(sub.headerID)}
            </div>
            {this.renderBody(this.text(sub.bodyID))}
            {sub.showPortals && this.renderRealmVideo(PortalVideosByFaction)}
            {sub.showPortals && this.renderPortalLegend()}
          </React.Fragment>
        ))}
      </>
    );
  }

  private renderRvrBody(): React.ReactNode {
    const highlightColor = this.getHighlightColor();
    const factionData = getFactionData(this.props.uiFactionID);
    return (
      <>
        {RvrSubsections.map((sub, index) => (
          <React.Fragment key={index}>
            <div className={SubHeading} style={{ color: highlightColor }}>
              {this.text(sub.headerID)}
            </div>
            {this.renderBody(this.text(sub.bodyID))}
          </React.Fragment>
        ))}
        {RvrBuildings.map((building, index) => (
          <div className={BuildingRow} key={index}>
            <img className={BuildingIcon} src={factionData.mapIconImages[building.type]} />
            <div className={BuildingInfo}>
              <div className={BuildingTitle} style={{ color: highlightColor }}>
                {this.text(building.titleID)}
              </div>
              <div className={BuildingBody}>{this.text(building.bodyID)}</div>
            </div>
          </div>
        ))}
      </>
    );
  }

  private renderEconomyBody(): React.ReactNode {
    const highlightColor = this.getHighlightColor();
    return (
      <>
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDEconomyHeaderOne)}
        </div>
        {this.renderBody(this.text(StringIDEconomyBodyOne))}
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDEconomyHeaderTwo)}
        </div>
        {this.renderBody(this.text(StringIDEconomyBodyTwo))}
        <div className={`${VideoStepsRow} ${VideoStepsRowTop}`}>
          <div className={StepsColumn}>
            {EconomyMethods.map((method, index) => (
              <React.Fragment key={index}>
                <div className={SubSubHeading} style={{ color: highlightColor }}>
                  {this.text(method.headerID)}
                </div>
                {this.renderBody(this.text(method.bodyID))}
              </React.Fragment>
            ))}
          </div>
          {this.renderRealmVideo(VendorVideosByFaction)}
        </div>
      </>
    );
  }

  private renderUIBody(): React.ReactNode {
    const highlightColor = this.getHighlightColor();
    return (
      <>
        <div className={SubHeading} style={{ color: highlightColor }}>
          {this.text(StringIDUIHeader)}
        </div>
        {this.renderBody(this.text(StringIDUIBody))}
        {this.renderRealmVideo(UIVideosByFaction)}
      </>
    );
  }

  private renderBody(body: string): React.ReactNode {
    return body.split('\n').map((line, index) => {
      const trimmed = line.trim();
      return trimmed.length > 0 ? (
        <p className={Paragraph} key={index}>
          {trimmed}
        </p>
      ) : null;
    });
  }

  private renderCommandList(list: string): React.ReactNode {
    return list.split('\n').map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        return null;
      }
      const match = trimmed.match(/^(\/\S+(?:\s+<[^>]+>)?)\s+(.+)$/);
      if (!match) {
        return (
          <p className={Paragraph} key={index}>
            {trimmed}
          </p>
        );
      }
      return this.renderCommandRow(match[1], match[2], index);
    });
  }

  private renderKeybindList(list: string): React.ReactNode {
    return list.split('\n').map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        return null;
      }
      const dashIndex = trimmed.indexOf(' - ');
      if (dashIndex < 0) {
        return (
          <p className={Paragraph} key={index}>
            {trimmed}
          </p>
        );
      }
      const key = trimmed.slice(0, dashIndex);
      const desc = trimmed.slice(dashIndex + 3);
      return this.renderCommandRow(key, desc, index);
    });
  }

  private renderArmorList(list: string, currentArmorType?: string): React.ReactNode {
    return list.split('\n').map((line, index) => {
      const trimmed = line.trim();
      const spaceIndex = trimmed.indexOf(' ');
      if (spaceIndex < 0) {
        return null;
      }
      const armorType = trimmed.slice(0, spaceIndex);
      const stationName = trimmed.slice(spaceIndex + 1).trim();
      return this.renderStationRow(armorType, stationName, index, currentArmorType);
    });
  }

  private renderLevelingImage(): React.ReactNode {
    const imageUrl = LevelingImagesByFaction[this.props.uiFactionID];
    if (!imageUrl) {
      return null;
    }
    return (
      <div className={ImageContainer}>
        <FactionBorder type={BorderType.Primary} className={ImageBorder}>
          <img className={LevelingImage} src={imageUrl} />
        </FactionBorder>
      </div>
    );
  }

  private renderCombatImage(): React.ReactNode {
    const imageUrl = CombatImagesByFaction[this.props.uiFactionID];
    if (!imageUrl) {
      return null;
    }
    return (
      <div className={ImageContainer}>
        <img className={CombatImage} src={imageUrl} />
      </div>
    );
  }

  // borderClassName controls aspect ratio; defaults to the 1.75:1 box most clips use.
  private renderRealmVideo(videosByFaction: Record<string, string>, borderClassName: string = VideoBorder): React.ReactNode {
    const videoUrl = videosByFaction[this.props.uiFactionID];
    if (!videoUrl) {
      return null;
    }
    return (
      <div className={VideoContainer}>
        <FactionBorder type={BorderType.Primary} className={borderClassName}>
          <VideoPlayer className={Video} src={videoUrl} play />
        </FactionBorder>
      </div>
    );
  }

  private renderPortalLegend(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    return (
      <div className={PortalLegend}>
        {PortalIconTypes.map((type, index) => (
          <div className={PortalRow} key={index}>
            <img className={PortalIconClass} src={factionData.mapIconImages[type]} />
            <span className={PortalLabel}>{this.text(StringIDPrefixMapPOIName + MapDataType[type])}</span>
          </div>
        ))}
      </div>
    );
  }

  private getHighlightColor(): string {
    return getFactionData(this.props.uiFactionID).targetBorderColor;
  }

  private getCurrentArmorTypeName(): string | undefined {
    const torsoItem = getItemEquippedInGearSlot(
      this.props.equippedItems ?? [],
      this.props.itemsByNumericID,
      ProficiencyGearSlotID
    );
    const categoryDefID = torsoItem ? this.props.itemsByNumericID[torsoItem.defID]?.armorConfig?.armorCategoryDefID : undefined;
    return categoryDefID ? this.props.armorCategories[categoryDefID]?.name : undefined;
  }

  private renderCommandRow(key: string, description: string, index: number): React.ReactNode {
    // Color the slash command to match its chat channel's in-game color, when it maps to one.
    const scope = getChatScopeFromSlashSelector(key.replace('/', '').trim().split(/\s+/)[0]);
    const color = scope ? allChatScopeDisplayData[scope]?.color : this.getHighlightColor();
    return (
      <div className={CommandRow} key={index}>
        <span className={CommandKey} style={{ color }}>
          {key}
        </span>
        <span className={CommandDesc}>{description}</span>
      </div>
    );
  }

  private renderStationRow(
    armorType: string,
    stationName: string,
    index: number,
    currentArmorType?: string
  ): React.ReactNode {
    const iconType = StationIconTypes[stationName.trim().toLowerCase()];
    const iconImage = iconType !== undefined ? getFactionData(this.props.uiFactionID).mapIconImages[iconType] : undefined;
    const isProficiency = !!currentArmorType && armorType.trim().toLowerCase() === currentArmorType.trim().toLowerCase();
    const highlightColor = this.getHighlightColor();
    return (
      <div className={StationRow} key={index}>
        <span className={StationKey} style={{ color: highlightColor }}>
          {armorType}
        </span>
        <span className={StationName}>
          {iconImage && <img className={StationIcon} src={iconImage} />}
          {stationName}
          {isProficiency && (
            <span className={ProficiencyNote} style={{ color: highlightColor }}>
              {' '}
              {this.text(StringIDCraftingProficiency)}
            </span>
          )}
        </span>
      </div>
    );
  }

  closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_GAME_INFO));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID,
    equippedItems: state.inventory.equipment,
    itemsByNumericID: state.gameDefs.itemsByNumericID,
    armorCategories: state.gameDefs.armorCategories,
    ...ownProps
  };
};

const GameInfo = connect(mapStateToProps)(AGameInfo);

export const WIDGET_ID_GAME_INFO = 'Game Info';
export const gameInfoRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_GAME_INFO,
  nameStringID: 'HUDEditorWidgetNameGameInfo',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 0
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.Menus,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <GameInfo isDragCopy={isDragCopy} />;
  }
};
