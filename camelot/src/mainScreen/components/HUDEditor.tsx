/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  hideHUDEditor,
  HUDWidget,
  HUDWidgetRegistration,
  resetAllWidgets,
  resetWidget,
  setNameplateStyle,
  setSelectedWidget,
  setSelectedWidgetGroup,
  setSnapEnabled,
  setGuidesEnabled,
  unregisterWidget,
  updateWidgetStates
} from '../redux/hudSlice';
import { AddDispatch, RootState } from '../redux/store';
import Draggable from './Draggable';
import DraggableHandle, { DropHandlerDraggableData } from './DraggableHandle';
import TooltipSource from './TooltipSource';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { hideModal, showModal } from '../redux/modalsSlice';
import { AbilityEditStatus, AbilityGroup, ButtonLayout } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import Escapable from './Escapable';
import {
  HUDHorizontalAnchor,
  HUDVerticalAnchor,
  HUDWidgetState
} from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralCancel,
  StringIDGeneralDelete,
  StringIDGeneralPercent
} from '../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { WIDGET_ID_ABILITY_BOOK } from './abilityBook/AbilityBook';
import { WIDGET_ID_ABILITY_CASTING } from './AbilityCasting';
import { WIDGET_ID_BANK } from './bank/Bank';
import { WIDGET_ID_CRAFTING } from './crafting/Crafting';
import { WIDGET_ID_EQUIPPED } from './Equipped';
import { WIDGET_ID_INVENTORY } from './inventory/Inventory';
import { WIDGET_ID_LEVEL_BARS } from './levelBars/LevelBars';
import { WIDGET_ID_NAV_MENU } from './HUDNavMenu';
import { WIDGET_ID_PARTY } from './party/Party';
import { WIDGET_ID_WORLD_MAP } from './WorldMap';
import { WIDGET_ID_WORLD_MAP as WIDGET_ID_MINI_MAP } from './MiniMap';
import { WIDGET_ID_REPAIRWARNING } from './repairWarning/RepairWarning';
import { WIDGET_ID_RESPAWN } from './Respawn';
import { WIDGET_ID_WARBAND } from './warband/Warband';
import { WIDGET_ID_CHAT } from './chat/Chat';
import { WIDGET_ID_GUILD } from './guild/Guild';
import { WIDGET_ID_ZONENAME } from './zoneName/ZoneName';
import { WIDGET_ID_QUESTLOG } from './quests/QuestLog';
import { WIDGET_ID_QUESTTRACKER } from './quests/QuestTracker';
import { WIDGET_ID_LEVEL_NOTIFICATIONS, WIDGET_ID_QUEST_NOTIFICATIONS } from './NotificationToasts';
import { WIDGET_ID_MAIL } from './mail/Mail';
import { WIDGET_ID_TRADE } from './trade/Trade';
import { WIDGET_ID_TRADEREQUESTS } from './trade/TradeRequests';
import { WIDGET_ID_VENDOR } from './vendor/Vendor';
import { WIDGET_ID_GAME_INFO } from './GameInfo';
import { WIDGET_ID_GAME_MENU } from './GameMenu';
import { WIDGET_ID_SERVERMESSAGES } from './serverMessages/ServerMessages';
import { WIDGET_ID_SETTINGS } from './Settings';
import { WIDGET_ID_WARNING_ICONS } from './WarningIcons';
import { WIDGET_ID_SELF } from './unitFrames/SelfUnitFrame';
import { WIDGET_ID_FRIENDLY, WIDGET_ID_ENEMY } from './unitFrames/TargetUnitFrame';
import {
  MAX_UI_SCALE,
  MIN_UI_SCALE,
  NameplateStyle
} from '@csegames/library/dist/camelotunchained/clientFunctions/HUDFunctions';
// import { getAbilityBarsCount } from '../helpers/abilityBarHelpers';
import { onToggleUIEditMode } from '../helpers/hudEditModeHelpers';
import { FlatButton } from './FlatButton';
import { SimpleRect } from '../redux/dragAndDropSlice';
import { BorderBackground, BorderType, FactionBorder } from './FactionBorder';
import { CornerButtonType, FactionCornerButton } from './FactionCornerButton';
import { FactionData, getFactionData } from '../gameData/factionData';
import { FactionScrollArea } from './FactionScrollArea';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import RefreshIconURL from '../../images/hudeditor/refresh-icon.png';
import AnchorTopLeftURL from '../../images/hudeditor/anchor-topleft.png';
import AnchorTopURL from '../../images/hudeditor/anchor-top.png';
import AnchorTopRightURL from '../../images/hudeditor/anchor-topright.png';
import AnchorLeftURL from '../../images/hudeditor/anchor-left.png';
import AnchorCenterURL from '../../images/hudeditor/anchor-center.png';
import AnchorRightURL from '../../images/hudeditor/anchor-right.png';
import AnchorBottomLeftURL from '../../images/hudeditor/anchor-bottomleft.png';
import AnchorBottomURL from '../../images/hudeditor/anchor-bottom.png';
import AnchorBottomRightURL from '../../images/hudeditor/anchor-bottomright.png';
import AnchorSelectedTopLeftURL from '../../images/hudeditor/anchor-selected-topleft.png';
import AnchorSelectedTopURL from '../../images/hudeditor/anchor-selected-top.png';
import AnchorSelectedTopRightURL from '../../images/hudeditor/anchor-selected-topright.png';
import AnchorSelectedLeftURL from '../../images/hudeditor/anchor-selected-left.png';
import AnchorSelectedCenterURL from '../../images/hudeditor/anchor-selected-center.png';
import AnchorSelectedRightURL from '../../images/hudeditor/anchor-selected-right.png';
import AnchorSelectedBottomLeftURL from '../../images/hudeditor/anchor-selected-bottomleft.png';
import AnchorSelectedBottomURL from '../../images/hudeditor/anchor-selected-bottom.png';
import AnchorSelectedBottomRightURL from '../../images/hudeditor/anchor-selected-bottomright.png';
import ArrowDownURL from '../../images/hudeditor/arrow-down.png';
import HorVertArrowURL from '../../images/hudeditor/hor-vert-arrow.png';
import ArrowLeftURL from '../../images/hudeditor/arrow-left.png';
import ArrowRightURL from '../../images/hudeditor/arrow-right.png';
import ArrowUpURL from '../../images/hudeditor/arrow-up.png';
import { FactionNumberSelector } from './FactionNumberSelector';
import { FactionButton } from './FactionButton';
import { FactionSearchBar } from './FactionSearchBar';
import { FactionCheckbox } from './FactionCheckbox';

// CSS classes
const Root = 'HUD-HUDEditor-Root';
const Contents = 'HUD-HUDEditor-Contents';
const Header = 'HUD-HUDEditor-Header';
const HeaderText = 'HUD-HUDEditor-HeaderText';
const ResetSection = 'HUD-HUDEditor-ResetSection';
const Search = 'HUD-HUDEditor-Search';
const ExpandCollapseButton = 'HUD-HUDEditor-ExpandCollapseButton';
const ListContainer = 'HUD-HUDEditor-ListContainer';
const ListContent = 'HUD-HUDEditor-ListContent';
const ListItem = 'HUD-HUDEditor-ListItem';
const ListItemName = 'HUD-HUDEditor-ListItem-Name';
const ListItemRefreshButton = 'HUD-HUDEditor-ListItem-RefreshButton';
const Footer = 'HUD-HUDEditor-Footer';
const SelectedWidgetName = 'HUD-HUDEditor-SelectedWidgetName';
const ToolbarRow = 'HUD-HUDEditor-ToolbarRow';
const ToolbarItem = 'HUD-HUDEditor-ToolbarItem';
const ToolbarControls = 'HUD-HUDEditor-ToolbarItemControls';
const ToolbarText = 'HUD-HUDEditor-ToolbarItemControls-Text';
const OptionRow = 'HUD-HUDEditor-OptionRow';
const OptionLabel = 'HUD-HUDEditor-OptionLabel';
const DisplayPrioritySelector = 'HUD-HUDEditor-DisplayPrioritySelector';
const SelectedWidgetHeader = 'HUD-HUDEditor-SelectedWidgetHeader';
const SelectedWidgetDivider = 'HUD-HUDEditor-SelectedWidgetDivider';
const SliderInput = 'HUD-HUDEditor-SliderInput';
const SliderRow = 'HUD-HUDEditor-SliderRow';
const MovementContainer = 'HUD-HUDEditor-MovementControls-Container';
const MovementUp = 'HUD-HUDEditor-MovementControls-Up';
const MovementDown = 'HUD-HUDEditor-MovementControls-Down';
const MovementLeft = 'HUD-HUDEditor-MovementControls-Left';
const MovementRight = 'HUD-HUDEditor-MovementControls-Right';
const AnchorContainer = 'HUD-HUDEditor-AnchorControls-Container';
const AnchorButton = 'HUD-HUDEditor-AnchorControls-Button';
const ControlHeaderText = 'HUD-HUDEditor-ControlHeaderText';
const AddAbilityBarsSection = 'HUD-HUDEditor-AddAbilityBarsSection';
const AddAbilityBarsSectionLabel = 'HUD-HUDEditor-AddAbilityBarsSection-Label';
const AbilityBarSection = 'HUD-HUDEditor-AbilityBarSection';
const AbilityBarSectionRow = 'HUD-HUDEditor-AbilityBarSection-Row';
const AbilityBarSectionButtonRow = 'HUD-HUDEditor-AbilityBarSection-ButtonRow';
const AbilityBarSectionLabel = 'HUD-HUDEditor-AbilityBarSection-Label';
const PlusMinusButton = 'HUD-HUDEditor-AbilityBarSection-PlusMinusButton';
const PartyLayoutButton = 'HUD-HUDEditor-PartyLayoutButton';
const PartyLayoutIcon = 'HUD-HUDEditor-PartyLayoutIcon';
const PartySection = 'HUD-HUDEditor-PartySection';
const PartySectionButtonRow = 'HUD-HUDEditor-PartySection-ButtonRow';
const PartySectionLabel = 'HUD-HUDEditor-PartySection-Label';
const ActionButton = 'HUD-HUDEditor-ActionButton';
const TargetPlatesGroup = 'HUD-HUDEditor-TargetPlatesGroup';
const TargetPlatesGroupHeader = 'HUD-HUDEditor-TargetPlatesGroupHeader';
const TargetPlatesGroupArrow = 'HUD-HUDEditor-TargetPlatesGroupArrow';
const TargetPlatesGroupDivider = 'HUD-HUDEditor-TargetPlatesGroupDivider';
const TargetPlatesGroupContent = 'HUD-HUDEditor-TargetPlatesGroupContent';
const TargetPlatesGroupItem = 'HUD-HUDEditor-TargetPlatesGroupItem';
const SnapToggleContainer = 'HUD-HUDEditor-SnapToggleContainer';
const SnapToggleRow = 'HUD-HUDEditor-SnapToggleRow';
const SnapToggleDivider = 'HUD-HUDEditor-SnapToggleDivider';
const PartyLayoutIconHorizontal = 'HUD-HUDEditor-PartyLayoutIcon--horizontal';

// CSS state modifier classes
const ModSelected = 'selected';
const ModHidden = 'hidden';
const ModCollapsed = 'collapsed';

// Ability bar limits
const AbilitiesBarIDPrefixLength = 'Bar: Abilities '.length;
const MaxAbilityGroups = 6;
const MaxAbilitySlots = 20;

// Widget scale bounds
const MinWidgetScale = 0.5;
const MaxWidgetScale = 3;

// String IDs
const StringIDHUDEditorResetAll = 'HUDEditorResetAll';
const StringIDHUDEditorReloadUI = 'HUDEditorReloadUI';
const StringIDHUDEditorAbilityBarGroupsLabel = 'HUDEditorAbilityBarGroupsLabel';
const StringIDHUDEditorAbilityBarSlotsLabel = 'HUDEditorAbilityBarSlotsLabel';
const StringIDHUDEditorDeleteAbilityBar = 'HUDEditorDeleteAbilityBar';
const StringIDHUDEditorCreateAbilityGroupErrorTitle = 'HUDEditorCreateAbilityGroupErrorTitle';
const StringIDHUDEditorCreateAbilityGroupErrorMessage = 'HUDEditorCreateAbilityGroupErrorMessage';
const StringIDHUDEditorConfirmDeleteButtonLayoutTitle = 'HUDEditorConfirmDeleteButtonLayoutTitle';
const StringIDHUDEditorConfirmDeleteButtonLayoutMessage = 'HUDEditorConfirmDeleteButtonLayoutMessage';
const StringIDHUDEditorSelectedWidgetName = 'HUDEditorSelectedWidgetName';
const StringIDHUDEditorSelectedWidgetNone = 'HUDEditorSelectedWidgetNone';
const StringIDHUDEditorSelectedWidgetPositionLabel = 'HUDEditorSelectedWidgetPositionLabel';
const StringIDHUDEditorSelectedWidgetAnchorLabel = 'HUDEditorSelectedWidgetAnchorLabel';
const StringIDHUDEditorSelectedWidgetResetWidget = 'HUDEditorSelectedWidgetResetWidget';
const StringIDHUDEditorSelectedWidgetMoveWidget = 'HUDEditorSelectedWidgetMoveWidget';
const StringIDHUDEditorSelectedWidgetChangeAnchor = 'HUDEditorSelectedWidgetChangeAnchor';
const StringIDHUDEditorDisplayPriority = 'HUDEditorDisplayPriority';
const StringIDHUDEditorToggleGridSnapping = 'HUDEditorToggleGridSnapping';
const StringIDHUDEditorToggleGuides = 'HUDEditorToggleGuides';
const StringIDHUDEditorUIUniversalScale = 'HUDEditorUIUniversalScale';
const StringIDHUDEditorTitle = 'HUDEditorTitle';
const StringIDHUDEditorDisplayPriorityExplanation = 'HUDEditorDisplayPriorityExplanation';
const StringIDHUDEditorPartyLayoutOptions = 'HUDEditorWidgetPartyLayoutOptions';
const StringIDHUDEditorTargetPlatesGroupName = 'HUDEditorTargetPlatesGroupName';
const StringIDHUDEditorAbilitiesGroupName = 'HUDEditorAbilitiesGroupName';
const StringIDHUDEditorCharacterGroupName = 'HUDEditorCharacterGroupName';
const StringIDHUDEditorEconomyGroupName = 'HUDEditorEconomyGroupName';
const StringIDHUDEditorMapsGroupName = 'HUDEditorMapsGroupName';
const StringIDHUDEditorSocialGroupName = 'HUDEditorSocialGroupName';
const StringIDHUDEditorQuestsGroupName = 'HUDEditorQuestsGroupName';
const StringIDHUDEditorTradeGroupName = 'HUDEditorTradeGroupName';
const StringIDHUDEditorSystemGroupName = 'HUDEditorSystemGroupName';
const StringIDHUDEditorTargetPlatesSimple = 'HUDEditorTargetPlatesSimple';
const StringIDHUDEditorTargetPlatesFancy = 'HUDEditorTargetPlatesFancy';
const StringIDHUDEditorChatFontSize = 'HUDEditorChatFontSize';
const StringIDHUDEditorToastDuration = 'HUDEditorToastDuration';
const StringIDHUDEditorExpandAll = 'HUDEditorExpandAll';
const StringIDHUDEditorCollapseAll = 'HUDEditorCollapseAll';
const StringIDHUDEditorSelectedWidgetOpacity = 'HUDEditorSelectedWidgetOpacity';
const StringIDHUDEditorSelectedWidgetSize = 'HUDEditorSelectedWidgetSize';

const FirstButtonRepeatTimeoutMS = 400;
const ButtonRepeatTimeoutMS = 80;

const ChatFontSizeMin = 50;
const ChatFontSizeMax = 150;
const ChatFontSizeDefault = 100;

const ToastDurationSecondsMin = 0;
const ToastDurationSecondsMax = 5;
const ToastDurationSecondsDefault = 5;

const DraggableID = 'HUDEditor';

interface HUDEditorWidgetGroup {
  // Also tracks expanded/collapsed state.
  key: string;
  labelStringID: string;
  fallbackLabel: string;
  // Matched members are sorted alphabetically by display name.
  match: (widgetID: string) => boolean;
}

const HUDEditorWidgetGroups: HUDEditorWidgetGroup[] = [
  {
    key: 'health-bars-group',
    labelStringID: StringIDHUDEditorTargetPlatesGroupName,
    fallbackLabel: 'Health Bars',
    match: (id) => [WIDGET_ID_ENEMY, WIDGET_ID_FRIENDLY, WIDGET_ID_SELF].includes(id)
  },
  {
    key: 'abilities-group',
    labelStringID: StringIDHUDEditorAbilitiesGroupName,
    fallbackLabel: 'Abilities',
    match: (id) => id.startsWith('Bar:') || [WIDGET_ID_ABILITY_BOOK, WIDGET_ID_ABILITY_CASTING].includes(id)
  },
  {
    key: 'character-group',
    labelStringID: StringIDHUDEditorCharacterGroupName,
    fallbackLabel: 'Character',
    match: (id) =>
      [
        WIDGET_ID_EQUIPPED,
        WIDGET_ID_LEVEL_BARS,
        WIDGET_ID_LEVEL_NOTIFICATIONS,
        WIDGET_ID_REPAIRWARNING,
        WIDGET_ID_RESPAWN
      ].includes(id)
  },
  {
    key: 'economy-group',
    labelStringID: StringIDHUDEditorEconomyGroupName,
    fallbackLabel: 'Economy',
    match: (id) => [WIDGET_ID_BANK, WIDGET_ID_CRAFTING, WIDGET_ID_INVENTORY].includes(id)
  },
  {
    key: 'maps-group',
    labelStringID: StringIDHUDEditorMapsGroupName,
    fallbackLabel: 'Maps',
    match: (id) => [WIDGET_ID_WORLD_MAP, WIDGET_ID_MINI_MAP, WIDGET_ID_ZONENAME].includes(id)
  },
  {
    key: 'social-group',
    labelStringID: StringIDHUDEditorSocialGroupName,
    fallbackLabel: 'Social',
    match: (id) => [WIDGET_ID_PARTY, WIDGET_ID_WARBAND, WIDGET_ID_CHAT, WIDGET_ID_GUILD, WIDGET_ID_MAIL].includes(id)
  },
  {
    key: 'quests-group',
    labelStringID: StringIDHUDEditorQuestsGroupName,
    fallbackLabel: 'Quests',
    match: (id) => [WIDGET_ID_QUESTLOG, WIDGET_ID_QUESTTRACKER, WIDGET_ID_QUEST_NOTIFICATIONS].includes(id)
  },
  {
    key: 'trade-group',
    labelStringID: StringIDHUDEditorTradeGroupName,
    fallbackLabel: 'Trade',
    match: (id) => [WIDGET_ID_TRADE, WIDGET_ID_TRADEREQUESTS, WIDGET_ID_VENDOR].includes(id)
  },
  {
    key: 'system-group',
    labelStringID: StringIDHUDEditorSystemGroupName,
    fallbackLabel: 'System',
    match: (id) =>
      [
        WIDGET_ID_GAME_INFO,
        WIDGET_ID_GAME_MENU,
        WIDGET_ID_NAV_MENU,
        WIDGET_ID_SERVERMESSAGES,
        WIDGET_ID_SETTINGS,
        WIDGET_ID_WARNING_ICONS
      ].includes(id)
  }
];

interface ReactProps {}

interface InjectedProps {
  hudWidth: number;
  hudHeight: number;
  widgets: Dictionary<HUDWidget>;
  selectedWidgetID: string;
  selectedGroupKey: string;
  selectedWidgetBounds: SimpleRect;
  editStatus: AbilityEditStatus;
  layouts: Dictionary<ButtonLayout>;
  groups: Dictionary<AbilityGroup>;
  activeConditionalWidgetIDs: string[];
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
  isPartyHorizontal: boolean;
  nameplateStyle: NameplateStyle;
  uiScale: number;
  snapEnabled: boolean;
  guidesEnabled: boolean;
}

type Props = ReactProps & InjectedProps & AddDispatch;

interface State {
  offset: [number, number];
  expandedGroups: Record<string, boolean>;
  searchQuery: string;
  expandAll: boolean;
}

class AHUDEditor extends React.Component<Props, State> {
  private buttonHeldHandle: number = 0;
  private isApplyingChanges = false;

  constructor(props: Props) {
    super(props);
    this.state = { offset: clientAPI.getHUDEditorOffset(), expandedGroups: {}, searchQuery: '', expandAll: false };
  }

  componentDidUpdate(prevProps: Props): void {
    if (this.props.selectedWidgetID && this.props.selectedWidgetID !== prevProps.selectedWidgetID) {
      for (const group of HUDEditorWidgetGroups) {
        if (this.getGroupMemberIDs(group).includes(this.props.selectedWidgetID)) {
          this.setState((prev) => ({ expandedGroups: { ...prev.expandedGroups, [group.key]: true } }));
          break;
        }
      }
    }
  }

  render(): JSX.Element {
    return (
      <Draggable
        className={Root}
        draggableID={DraggableID}
        style={{ transform: `translate(${this.state.offset[0]}vmin,${this.state.offset[1]}vmin)` }}
        draggingRender={this.renderDraggableContents.bind(this)}
      >
        <Escapable
          escapeID={'closeHUDEditor'}
          onEscape={() => {
            this.props.dispatch(hideHUDEditor());
            if (!this.props.activeConditionalWidgetIDs.includes(WIDGET_ID_ABILITY_BOOK)) {
              clientAPI.requestEditMode(false);
            }
          }}
        />
        {this.renderDraggableContents()}
      </Draggable>
    );
  }

  private renderDraggableContents(): JSX.Element {
    // const numBars = getAbilityBarsCount(this.props.widgets);
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <FactionBorder
        className={Contents}
        type={BorderType.Primary}
        background={BorderBackground.Leather}
        cornerButtons={[
          <FactionCornerButton type={CornerButtonType.Close} small onClick={this.onCloseClick.bind(this)} />
        ]}
      >
        <DraggableHandle
          className={Header}
          draggableID={DraggableID}
          dropHandler={this.handleDragEnded.bind(this)}
          style={{ borderBottomColor: factionData.borderColor }}
        >
          <div className={HeaderText}>{getStringTableValue(StringIDHUDEditorTitle, this.props.stringTable)}</div>
        </DraggableHandle>
        {/* "Ability Bars X/9" + Add New row disabled for now — adding ability bars isn't supported yet.
        <div className={AddAbilityBarsSection} style={{ borderBottomColor: factionData.borderColor }}>
          <div className={AddAbilityBarsSectionLabel}>
            {getTokenizedStringTableValue(StringIDHUDEditorAbilityBarsLabel, this.props.stringTable, {
              MIN: String(numBars),
              MAX: String(9)
            })}
          </div>
          <FactionButton
            className={ActionButton}
            widthOverrideVmin={8}
            disabled={!this.props.editStatus.canAddButtons}
            onClick={this.onAddNewLayoutClicked.bind(this)}
          >
            {getStringTableValue(StringIDHUDEditorAddAbilityBar, this.props.stringTable)}
          </FactionButton>
        </div>
        */}
        {this.renderUIScaleControls(factionData)}
        <FactionSearchBar
          className={Search}
          value={this.state.searchQuery}
          onValueChanged={(value) => this.setState({ searchQuery: value })}
          heightOverrideVmin={2.67}
        />
        <div className={ExpandCollapseButton} onClick={this.onExpandCollapseAllClicked.bind(this)}>
          {this.state.expandAll
            ? getStringTableValue(StringIDHUDEditorCollapseAll, this.props.stringTable)
            : getStringTableValue(StringIDHUDEditorExpandAll, this.props.stringTable)}
        </div>
        <style>{`.HUD-HUDEditor-ExpandCollapseButton { color: ${factionData.borderColor}; }`}</style>
        <style>{`.HUD-HUDEditor-ExpandCollapseButton:hover { background-color: ${factionData.borderColor}aa; }`}</style>
        <style>{`.HUD-HUDEditor-ListItem-Name { color: ${factionData.borderColor}; }`}</style>
        <style>{`.HUD-HUDEditor-ListItem:not(.hidden):hover { background-color: ${factionData.borderColor}aa; }`}</style>
        <style>{`.HUD-HUDEditor-ListItem.selected { background-color: ${factionData.borderColor} !important; }`}</style>
        <style>{`.HUD-HUDEditor-TargetPlatesGroupHeader:hover { background-color: ${factionData.borderColor}aa; }`}</style>
        {/* A selected group stands out as a whole: a faction tint over the block, with a left accent
            bar running only the height of the expanded submenu (the member list). */}
        <style>{`.HUD-HUDEditor-TargetPlatesGroup.selected { box-shadow: inset 0 0 0 100vmax ${factionData.borderColor}22; }`}</style>
        <style>{`.HUD-HUDEditor-TargetPlatesGroup.selected .HUD-HUDEditor-TargetPlatesGroupContent { box-shadow: inset 0.4vmin 0 0 0 ${factionData.borderColor}; }`}</style>
        <style>{`.HUD-HUDEditor-TargetPlatesGroup.selected .HUD-HUDEditor-ListItem:not(.selected):not(:hover) { background-color: transparent; }`}</style>
        <style>{`.HUD-HUDEditor-SliderInput::-webkit-slider-thumb { background-image: url(${factionData.sliderMiniImage}); }`}</style>
        <style>{`.HUD-HUDEditor-SliderInput::-webkit-slider-runnable-track { border-color: ${factionData.borderColor}; }`}</style>
        <FactionScrollArea
          className={ListContainer}
          contentClassName={ListContent}
          useSmallThumb
          scrollbarWidth={'1.5vmin'}
        >
          {this.renderWidgetList(factionData)}
        </FactionScrollArea>
        <div className={Footer} style={{ borderTopColor: factionData.borderColor }}>
          {this.renderWidgetControls(factionData)}
        </div>
        {this.renderAbilityBarControls(factionData)}
        {this.renderPartyControls(factionData)}
        {this.renderNameplateStyleControls(factionData)}
        <div className={ResetSection} style={{ borderTopColor: factionData.borderColor }}>
          <FactionButton className={ActionButton} onClick={this.onResetAllClicked.bind(this)} widthOverrideVmin={8}>
            {getStringTableValue(StringIDHUDEditorResetAll, this.props.stringTable)}
          </FactionButton>
          <FactionButton className={ActionButton} onClick={this.onReloadUIClicked.bind(this)} widthOverrideVmin={8}>
            {getStringTableValue(StringIDHUDEditorReloadUI, this.props.stringTable)}
          </FactionButton>
        </div>
      </FactionBorder>
    );
  }

  private renderWidgetList(factionData: FactionData): React.ReactNode[] {
    const groupMembers: Record<string, string[]> = {};
    const groupedIDs = new Set<string>();
    HUDEditorWidgetGroups.forEach((group) => {
      const members = this.getGroupMemberIDs(group);
      if (members.length === 0) {
        return;
      }
      groupMembers[group.key] = members;
      members.forEach((id) => groupedIDs.add(id));
    });
    interface ListEntry {
      sortKey: string;
      render: () => React.ReactNode;
    }
    const entries: ListEntry[] = [];

    const query = this.state.searchQuery.trim().toLowerCase();
    const nameMatches = (id: string): boolean =>
      this.getWidgetName(this.props.widgets[id].registration).toLowerCase().includes(query);

    Object.keys(this.props.widgets)
      .filter((id) => this.props.widgets[id].registration && !groupedIDs.has(id))
      .filter((id) => !query || nameMatches(id))
      .forEach((id) => {
        entries.push({
          sortKey: this.getWidgetName(this.props.widgets[id].registration),
          render: () => this.renderListItem(id)
        });
      });

    HUDEditorWidgetGroups.forEach((group) => {
      const members = groupMembers[group.key];
      if (!members) {
        return;
      }
      const label = getStringTableValue(group.labelStringID, this.props.stringTable) || group.fallbackLabel;
      // When searching, a group shows if its label matches (then all members) or any member matches
      // (then just the matching members). Groups with no match are hidden entirely.
      let visibleMembers = members;
      if (query) {
        const labelMatches = label.toLowerCase().includes(query);
        visibleMembers = labelMatches ? members : members.filter(nameMatches);
        if (visibleMembers.length === 0) {
          return;
        }
      }
      entries.push({
        sortKey: label,
        render: () => this.renderWidgetGroup(group, visibleMembers, label, factionData)
      });
    });

    return entries.sort((a, b) => a.sortKey.localeCompare(b.sortKey)).map((entry) => entry.render());
  }

  private getGroupMemberIDs(group: HUDEditorWidgetGroup): string[] {
    return Object.keys(this.props.widgets)
      .filter((id) => this.props.widgets[id].registration && group.match(id))
      .sort((a, b) =>
        this.getWidgetName(this.props.widgets[a].registration).localeCompare(
          this.getWidgetName(this.props.widgets[b].registration)
        )
      );
  }

  private toggleGroupExpanded(key: string): void {
    this.setState((prev) => ({ expandedGroups: { ...prev.expandedGroups, [key]: !prev.expandedGroups[key] } }));
  }

  private onExpandCollapseAllClicked(): void {
    this.setState((prev) => ({ expandAll: !prev.expandAll, expandedGroups: {} }));
  }

  private onGroupHeaderClicked(group: HUDEditorWidgetGroup, memberIDs: string[]): void {
    this.toggleGroupExpanded(group.key);
    // Selecting a group makes all members individually movable in the HUD.
    this.props.dispatch(setSelectedWidgetGroup({ groupKey: group.key, memberIDs }));
  }

  private renderListItem(widgetID: string): React.ReactNode {
    const isSelected = widgetID === this.props.selectedWidgetID;
    const selectedClass = isSelected ? ModSelected : '';
    const hiddenClass = this.props.widgets[widgetID].state.visible ? '' : ModHidden;
    return (
      <div
        className={`${ListItem} ${selectedClass} ${hiddenClass}`}
        key={widgetID}
        onClick={this.onWidgetSelected.bind(this, widgetID)}
      >
        <div className={`${ListItemName} ${selectedClass} ${hiddenClass}`}>
          {this.getWidgetName(this.props.widgets[widgetID].registration)}
        </div>
        {isSelected && (
          <TooltipSource
            className={ListItemRefreshButton}
            id='ResetWidget'
            tooltipID='HUDEditor-ResetWidget'
            content={() => getStringTableValue(StringIDHUDEditorSelectedWidgetResetWidget, this.props.stringTable)}
            positionType='mouse'
          >
            <img
              src={RefreshIconURL}
              onClick={(e) => {
                e.stopPropagation();
                this.onResetWidgetClicked();
              }}
            />
          </TooltipSource>
        )}
      </div>
    );
  }

  private renderWidgetGroup(
    group: HUDEditorWidgetGroup,
    memberIDs: string[],
    label: string,
    factionData: FactionData
  ): React.ReactNode {
    // Force groups open while searching so matching members are visible.
    const isExpanded =
      this.state.searchQuery.trim().length > 0 || this.state.expandAll || !!this.state.expandedGroups[group.key];
    const isGroupSelected = this.props.selectedGroupKey === group.key;
    const anyMemberSelected = memberIDs.includes(this.props.selectedWidgetID);
    const dividerImage = factionData.dividerVerticalSimpleImage;

    return (
      <div className={`${TargetPlatesGroup}${isGroupSelected ? ` ${ModSelected}` : ''}`} key={group.key}>
        <div
          className={`${TargetPlatesGroupHeader}${isGroupSelected || anyMemberSelected ? ` ${ModSelected}` : ''}`}
          onClick={() => this.onGroupHeaderClicked(group, memberIDs)}
        >
          <img
            className={`${TargetPlatesGroupArrow}${isExpanded ? '' : ` ${ModCollapsed}`}`}
            src={factionData.arrowPointerImage}
          />
          <div className={ListItemName}>{label}</div>
        </div>
        {isExpanded && (
          <>
            {dividerImage && <img className={TargetPlatesGroupDivider} src={dividerImage} />}
            <div className={TargetPlatesGroupContent}>
              {memberIDs.map((id) => {
                const isSelected = id === this.props.selectedWidgetID;
                const selectedClass = isSelected ? ModSelected : '';
                const hiddenClass = this.props.widgets[id]?.state.visible ? '' : ModHidden;
                return (
                  <div
                    className={`${TargetPlatesGroupItem} ${ListItem} ${selectedClass} ${hiddenClass}`}
                    key={id}
                    onClick={this.onWidgetSelected.bind(this, id)}
                  >
                    <div className={`${ListItemName} ${selectedClass} ${hiddenClass}`}>
                      {this.getWidgetName(this.props.widgets[id].registration)}
                    </div>
                    {isSelected && (
                      <TooltipSource
                        className={ListItemRefreshButton}
                        id='ResetWidget'
                        tooltipID='HUDEditor-ResetWidget'
                        content={() =>
                          getStringTableValue(StringIDHUDEditorSelectedWidgetResetWidget, this.props.stringTable)
                        }
                        positionType='mouse'
                      >
                        <img
                          src={RefreshIconURL}
                          onClick={(e) => {
                            e.stopPropagation();
                            this.onResetWidgetClicked();
                          }}
                        />
                      </TooltipSource>
                    )}
                  </div>
                );
              })}
            </div>
            {dividerImage && <img className={TargetPlatesGroupDivider} src={dividerImage} />}
          </>
        )}
      </div>
    );
  }

  private renderPartyControls(factionData: FactionData): React.ReactNode {
    if (this.props.selectedWidgetID !== WIDGET_ID_PARTY) {
      return null;
    }
    const isHorizontal = this.props.isPartyHorizontal;

    return (
      <div className={PartySection} style={{ borderTopColor: factionData.borderColor }}>
        <div className={PartySectionButtonRow}>
          <div className={PartySectionLabel}>
            {getStringTableValue(StringIDHUDEditorPartyLayoutOptions, this.props.stringTable)}
          </div>
          <div className={ToolbarControls}>
            <FlatButton
              className={`${PartyLayoutButton}${!isHorizontal ? ` ${ModSelected}` : ''}`}
              onClick={() => {
                clientAPI.setPartyLayout('vertical');
              }}
            >
              <img src={HorVertArrowURL} className={PartyLayoutIcon} />
            </FlatButton>
            <FlatButton
              className={`${PartyLayoutButton}${isHorizontal ? ` ${ModSelected}` : ''}`}
              onClick={() => {
                clientAPI.setPartyLayout('horizontal');
              }}
            >
              <img src={HorVertArrowURL} className={`${PartyLayoutIcon} ${PartyLayoutIconHorizontal}`} />
            </FlatButton>
          </div>
        </div>
      </div>
    );
  }

  private renderUIScaleControls(factionData: FactionData): React.ReactNode {
    const percent = Math.round(this.props.uiScale * 100);
    return (
      <div className={AddAbilityBarsSection} style={{ borderBottomColor: factionData.borderColor }}>
        <div className={AddAbilityBarsSectionLabel}>
          {getStringTableValue(StringIDHUDEditorUIUniversalScale, this.props.stringTable)}
        </div>
        <div className={SliderRow}>
          <input
            className={SliderInput}
            type='range'
            min={Math.round(MIN_UI_SCALE * 100)}
            max={Math.round(MAX_UI_SCALE * 100)}
            step={1}
            value={percent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setUIScaleAbsolute(Number(e.target.value) / 100)}
          />
          <div className={ToolbarText}>
            {getTokenizedStringTableValue(StringIDGeneralPercent, this.props.stringTable, {
              VALUE: String(percent)
            })}
          </div>
        </div>
      </div>
    );
  }

  private renderNameplateStyleControls(factionData: FactionData): React.ReactNode {
    const plateIDs = [WIDGET_ID_SELF, WIDGET_ID_FRIENDLY, WIDGET_ID_ENEMY];
    if (!plateIDs.includes(this.props.selectedWidgetID)) {
      return null;
    }
    const isSimple = this.props.nameplateStyle === 'simple';

    return (
      <div className={PartySection} style={{ borderTopColor: factionData.borderColor }}>
        <div className={PartySectionButtonRow}>
          <div className={PartySectionLabel}>
            {getStringTableValue(StringIDHUDEditorTargetPlatesGroupName, this.props.stringTable) || 'Health Bars'}
          </div>
          <div className={ToolbarControls}>
            <FlatButton
              className={`${PartyLayoutButton}${!isSimple ? ` ${ModSelected}` : ''}`}
              onClick={() => {
                this.props.dispatch(setNameplateStyle('fancy'));
                clientAPI.setNameplateStyle('fancy');
              }}
            >
              {getStringTableValue(StringIDHUDEditorTargetPlatesFancy, this.props.stringTable) || 'Fancy'}
            </FlatButton>
            <FlatButton
              className={`${PartyLayoutButton}${isSimple ? ` ${ModSelected}` : ''}`}
              onClick={() => {
                this.props.dispatch(setNameplateStyle('simple'));
                clientAPI.setNameplateStyle('simple');
              }}
            >
              {getStringTableValue(StringIDHUDEditorTargetPlatesSimple, this.props.stringTable) || 'Simple'}
            </FlatButton>
          </div>
        </div>
      </div>
    );
  }

  private renderAbilityBarControls(factionData: FactionData): React.ReactNode {
    // Disabled for now: ability-bar group/slot editing (Bar Groups, Ability Slots) and bar deletion
    // aren't enabled features yet. Remove this early return to bring the controls back.
    return null;

    if (!this.props.selectedWidgetID?.startsWith('Bar: Abilities')) {
      return null;
    }

    const selectedLayoutId = +this.props.selectedWidgetID.slice(AbilitiesBarIDPrefixLength);
    const selectedLayout: ButtonLayout = this.props.layouts[selectedLayoutId];
    if (!selectedLayout) {
      return null;
    }
    const selectedGroup: AbilityGroup = this.props.groups[selectedLayout.groupID];
    if (!selectedGroup) {
      return null;
    }

    return (
      <div className={AbilityBarSection} style={{ borderTopColor: factionData.borderColor }}>
        <div className={AbilityBarSectionRow}>
          <div className={AbilityBarSectionLabel}>
            {getTokenizedStringTableValue(StringIDHUDEditorAbilityBarGroupsLabel, this.props.stringTable, {
              MIN: String(selectedLayout.groupCycle.length),
              MAX: String(MaxAbilityGroups)
            })}
          </div>
          <FlatButton
            className={PlusMinusButton}
            disabled={selectedLayout.groupCycle.length >= MaxAbilityGroups}
            onClick={this.onAddGroupClicked.bind(this, selectedLayout)}
          >
            {'+'}
          </FlatButton>
          <FlatButton
            className={PlusMinusButton}
            disabled={selectedLayout.groupCycle.length <= 1}
            onClick={this.onDeleteGroupClicked.bind(this, selectedLayout)}
          >
            {'-'}
          </FlatButton>
        </div>
        <div className={AbilityBarSectionRow}>
          <div className={AbilityBarSectionLabel}>
            {getTokenizedStringTableValue(StringIDHUDEditorAbilityBarSlotsLabel, this.props.stringTable, {
              MIN: String(selectedGroup.abilities.length),
              MAX: String(MaxAbilitySlots)
            })}
          </div>
          <FlatButton
            className={PlusMinusButton}
            disabled={selectedGroup.abilities.length >= MaxAbilitySlots}
            onClick={this.onAddSlotClicked.bind(this, selectedLayout)}
          >
            {'+'}
          </FlatButton>
          <FlatButton
            className={PlusMinusButton}
            disabled={selectedGroup.abilities.length <= 1}
            onClick={this.onDeleteSlotClicked.bind(this, selectedLayout)}
          >
            {'-'}
          </FlatButton>
        </div>
        {selectedLayout.canDelete === true && (
          <div className={AbilityBarSectionButtonRow}>
            <FlatButton onClick={this.onDeleteButtonLayoutClicked.bind(this, selectedLayout)}>
              {getStringTableValue(StringIDHUDEditorDeleteAbilityBar, this.props.stringTable)}
            </FlatButton>
          </div>
        )}
      </div>
    );
  }

  private onCloseClick(): void {
    onToggleUIEditMode(true, this.props.activeConditionalWidgetIDs, this.props.dispatch);
  }

  private async onAddGroupClicked(layout: ButtonLayout): Promise<void> {
    if (this.isApplyingChanges) {
      return;
    }
    this.isApplyingChanges = true;
    const newGroupId: number = await clientAPI.createAbilityGroup(`layout${layout.id}group${layout.groupCycle.length}`);
    if (newGroupId === 0) {
      this.props.dispatch(
        showModal({
          id: 'AbilityGroupCreateError',
          content: {
            title: getStringTableValue(StringIDHUDEditorCreateAbilityGroupErrorTitle, this.props.stringTable),
            message: getStringTableValue(StringIDHUDEditorCreateAbilityGroupErrorMessage, this.props.stringTable)
          },
          escapable: true
        })
      );
    } else {
      clientAPI.setVisibleAbilitySlots(newGroupId, this.props.groups[layout.groupID].abilities.length);
      const groupCycle: number[] = [...layout.groupCycle, newGroupId];
      clientAPI.selectAbilityLayoutGroupCycle(layout.id, groupCycle);
      clientAPI.selectAbilityLayoutGroup(layout.id, newGroupId);
    }
    this.isApplyingChanges = false;
  }

  private onDeleteGroupClicked(layout: ButtonLayout): void {
    if (this.isApplyingChanges) {
      return;
    }
    this.isApplyingChanges = true;

    let groupIndex: number = layout.groupCycle.indexOf(layout.groupID);
    const groupCycle: number[] = layout.groupCycle.filter((groupId) => groupId !== layout.groupID);
    clientAPI.selectAbilityLayoutGroupCycle(layout.id, groupCycle);
    if (groupIndex >= groupCycle.length) {
      groupIndex -= 1;
    }
    clientAPI.selectAbilityLayoutGroup(layout.id, groupCycle[groupIndex]);
    clientAPI.deleteAbilityGroup(layout.groupID);
    for (let i = groupIndex + 1; i < groupCycle.length; ++i) {
      clientAPI.renameAbilityGroup(groupCycle[i], `layout${layout.id}group${i}`);
    }
    this.isApplyingChanges = false;
  }

  private onAddSlotClicked(layout: ButtonLayout): void {
    if (this.isApplyingChanges) {
      return;
    }
    this.isApplyingChanges = true;
    layout.groupCycle.forEach((groupId) => {
      clientAPI.setVisibleAbilitySlots(groupId, this.props.groups[layout.groupID].abilities.length + 1);
    });
    this.isApplyingChanges = false;
  }

  private onDeleteSlotClicked(layout: ButtonLayout): void {
    if (this.isApplyingChanges) {
      return;
    }
    this.isApplyingChanges = true;
    const newSlotCount = this.props.groups[layout.groupID].abilities.length - 1;
    layout.groupCycle.forEach((groupId) => {
      // "setVisibleSlots" doesn't shrink the array — clear the last slot manually first.
      clientAPI.clearAbility(groupId, newSlotCount);
      clientAPI.setVisibleAbilitySlots(groupId, newSlotCount);
    });
    this.isApplyingChanges = false;
  }

  private onDeleteButtonLayoutClicked(layout: ButtonLayout): void {
    if (this.isApplyingChanges) {
      return;
    }
    this.isApplyingChanges = true;
    this.props.dispatch(
      showModal({
        id: 'ConfirmDeleteButtonLayout',
        content: {
          title: StringIDHUDEditorConfirmDeleteButtonLayoutTitle,
          message: getTokenizedStringTableValue(
            StringIDHUDEditorConfirmDeleteButtonLayoutMessage,
            this.props.stringTable,
            { LAYOUT_ID: String(layout.id) }
          ),
          buttons: [
            {
              text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
              onClick: () => {
                this.props.dispatch(hideModal());
                this.isApplyingChanges = false;
              }
            },
            {
              text: getStringTableValue(StringIDGeneralDelete, this.props.stringTable),
              onClick: () => {
                clientAPI.deleteAbilityLayout(layout.id);
                layout.groupCycle.forEach((groupId) => {
                  clientAPI.deleteAbilityGroup(groupId);
                });
                this.props.dispatch(unregisterWidget(`Bar: Abilities ${layout.id}`));
                this.props.dispatch(hideModal());
                this.props.dispatch(setSelectedWidget(''));
                this.isApplyingChanges = false;
              }
            }
          ]
        }
      })
    );
  }

  private renderWidgetControls(factionData: FactionData): JSX.Element {
    if ((this.props.selectedWidgetID?.length ?? 0) > 0) {
      const widget = this.props.widgets[this.props.selectedWidgetID];
      return (
        <>
          <div className={SelectedWidgetHeader}>
            <div className={SelectedWidgetName}>
              {getTokenizedStringTableValue(StringIDHUDEditorSelectedWidgetName, this.props.stringTable, {
                NAME: this.getWidgetName(widget.registration)
              })}
            </div>
          </div>
          <div className={SelectedWidgetDivider} style={{ backgroundColor: factionData.borderColor }} />
          <div className={OptionRow}>
            <div className={OptionLabel}>
              {getStringTableValue(StringIDHUDEditorSelectedWidgetOpacity, this.props.stringTable)}
            </div>
            <div className={SliderRow}>
              <input
                className={SliderInput}
                type='range'
                min={0}
                max={100}
                step={1}
                value={Math.round((widget.state.opacity ?? 1) * 100)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setOpacity(Number(e.target.value) / 100)}
              />
              <div className={ToolbarText}>
                {getTokenizedStringTableValue(StringIDGeneralPercent, this.props.stringTable, {
                  VALUE: String(Math.round((widget.state.opacity ?? 1) * 100))
                })}
              </div>
            </div>
          </div>
          <div className={OptionRow}>
            <div className={OptionLabel}>
              {getStringTableValue(StringIDHUDEditorSelectedWidgetSize, this.props.stringTable)}
            </div>
            <div className={SliderRow}>
              <input
                className={SliderInput}
                type='range'
                min={50}
                max={300}
                step={1}
                value={Math.round((widget.state.scale ?? 1) * 100)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setScale(Number(e.target.value) / 100)}
              />
              <div className={ToolbarText}>
                {getTokenizedStringTableValue(StringIDGeneralPercent, this.props.stringTable, {
                  VALUE: String(Math.round((widget.state.scale ?? 1) * 100))
                })}
              </div>
            </div>
          </div>
          <div className={SelectedWidgetDivider} style={{ backgroundColor: factionData.borderColor }} />
          <div className={ToolbarRow}>{this.renderSnapToggle(factionData)}</div>
          <div className={SelectedWidgetDivider} style={{ backgroundColor: factionData.borderColor }} />
          <div className={ToolbarRow}>
            {this.renderMovementControls()}
            {this.renderAnchorControls()}
          </div>
          <div className={SelectedWidgetDivider} style={{ backgroundColor: factionData.borderColor }} />
          <div className={ToolbarRow}>{this.renderLayerControls()}</div>
          {this.props.selectedWidgetID === WIDGET_ID_CHAT && (
            <>
              <div className={SelectedWidgetDivider} style={{ backgroundColor: factionData.borderColor }} />
              {this.renderChatFontSizeControls(factionData)}
            </>
          )}
          {[WIDGET_ID_QUEST_NOTIFICATIONS, WIDGET_ID_LEVEL_NOTIFICATIONS].includes(this.props.selectedWidgetID) && (
            <>
              <div className={SelectedWidgetDivider} style={{ backgroundColor: factionData.borderColor }} />
              {this.renderToastDurationControls()}
            </>
          )}
        </>
      );
    } else {
      return (
        <div className={SelectedWidgetName}>
          {getStringTableValue(StringIDHUDEditorSelectedWidgetNone, this.props.stringTable)}
        </div>
      );
    }
  }

  private renderMovementControls(): JSX.Element {
    return (
      <TooltipSource
        className={ToolbarItem}
        tooltipID='HUDEditor-MoveWidget'
        content={() => getStringTableValue(StringIDHUDEditorSelectedWidgetMoveWidget, this.props.stringTable)}
        positionType='mouse'
      >
        <div className={ControlHeaderText}>
          {getStringTableValue(StringIDHUDEditorSelectedWidgetPositionLabel, this.props.stringTable)}
        </div>
        <div className={MovementContainer}>
          <img
            className={MovementUp}
            src={ArrowUpURL}
            onMouseDown={this.onUpMouseDown.bind(this)}
            onMouseUp={this.onButtonMouseUp.bind(this)}
          />
          <img
            className={MovementDown}
            src={ArrowDownURL}
            onMouseDown={this.onDownMouseDown.bind(this)}
            onMouseUp={this.onButtonMouseUp.bind(this)}
          />
          <img
            className={MovementLeft}
            src={ArrowLeftURL}
            onMouseDown={this.onLeftMouseDown.bind(this)}
            onMouseUp={this.onButtonMouseUp.bind(this)}
          />
          <img
            className={MovementRight}
            src={ArrowRightURL}
            onMouseDown={this.onRightMouseDown.bind(this)}
            onMouseUp={this.onButtonMouseUp.bind(this)}
          />
        </div>
      </TooltipSource>
    );
  }

  private renderAnchorControls(): JSX.Element {
    const widget = this.props.widgets[this.props.selectedWidgetID];
    const t = widget.state.yAnchor === HUDVerticalAnchor.Top;
    const m = widget.state.yAnchor === HUDVerticalAnchor.Center;
    const b = widget.state.yAnchor === HUDVerticalAnchor.Bottom;
    const l = widget.state.xAnchor === HUDHorizontalAnchor.Left;
    const c = widget.state.xAnchor === HUDHorizontalAnchor.Center;
    const r = widget.state.xAnchor === HUDHorizontalAnchor.Right;
    return (
      <TooltipSource
        className={ToolbarItem}
        tooltipID='HUDEditor-ChangeAnchor'
        content={() => getStringTableValue(StringIDHUDEditorSelectedWidgetChangeAnchor, this.props.stringTable)}
        positionType='mouse'
      >
        <div className={ControlHeaderText}>
          {getStringTableValue(StringIDHUDEditorSelectedWidgetAnchorLabel, this.props.stringTable)}
        </div>
        <div className={AnchorContainer}>
          <img
            className={`${AnchorButton} corner top left`}
            src={t && l ? AnchorSelectedTopLeftURL : AnchorTopLeftURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Left, HUDVerticalAnchor.Top)}
          />
          <img
            className={AnchorButton}
            src={t && c ? AnchorSelectedTopURL : AnchorTopURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Center, HUDVerticalAnchor.Top)}
          />
          <img
            className={`${AnchorButton} corner top right`}
            src={t && r ? AnchorSelectedTopRightURL : AnchorTopRightURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Right, HUDVerticalAnchor.Top)}
          />
          <img
            className={AnchorButton}
            src={m && l ? AnchorSelectedLeftURL : AnchorLeftURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Left, HUDVerticalAnchor.Center)}
          />
          <img
            className={AnchorButton}
            src={m && c ? AnchorSelectedCenterURL : AnchorCenterURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Center, HUDVerticalAnchor.Center)}
          />
          <img
            className={AnchorButton}
            src={m && r ? AnchorSelectedRightURL : AnchorRightURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Right, HUDVerticalAnchor.Center)}
          />
          <img
            className={`${AnchorButton} corner bottom left`}
            src={b && l ? AnchorSelectedBottomLeftURL : AnchorBottomLeftURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Left, HUDVerticalAnchor.Bottom)}
          />
          <img
            className={AnchorButton}
            src={b && c ? AnchorSelectedBottomURL : AnchorBottomURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Center, HUDVerticalAnchor.Bottom)}
          />
          <img
            className={`${AnchorButton} corner bottom right`}
            src={b && r ? AnchorSelectedBottomRightURL : AnchorBottomRightURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Right, HUDVerticalAnchor.Bottom)}
          />
        </div>
      </TooltipSource>
    );
  }

  private renderLayerControls(): JSX.Element {
    const widget = this.props.widgets[this.props.selectedWidgetID];

    return (
      <TooltipSource
        className={OptionRow}
        tooltipID='HUDEditor-DisplayPriority'
        content={() => getStringTableValue(StringIDHUDEditorDisplayPriorityExplanation, this.props.stringTable)}
        positionType='mouse'
      >
        <div className={OptionLabel}>
          {getStringTableValue(StringIDHUDEditorDisplayPriority, this.props.stringTable)}
        </div>
        <FactionNumberSelector
          className={DisplayPrioritySelector}
          value={widget.state.layerOffset ?? 0}
          onValueChanged={(newValue: number) => {
            // Copy the original state.
            const state = { ...this.props.widgets[this.props.selectedWidgetID].state };

            // Update the value.
            state.layerOffset = newValue;

            // Save to HUDLocalStore.
            clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
            // Save to Redux.
            const delta: Record<string, HUDWidgetState> = {};
            delta[this.props.selectedWidgetID] = state;
            this.props.dispatch(updateWidgetStates(delta));
          }}
        />
      </TooltipSource>
    );
  }

  private renderSnapToggle(factionData: FactionData): JSX.Element {
    return (
      <div className={SnapToggleContainer}>
        <div className={SnapToggleRow}>
          <FactionCheckbox
            isChecked={this.props.snapEnabled}
            onCheckedChanged={() => this.props.dispatch(setSnapEnabled(!this.props.snapEnabled))}
            heightOverrideVmin={1.8}
          />
          <div className={OptionLabel}>
            {getStringTableValue(StringIDHUDEditorToggleGridSnapping, this.props.stringTable)}
          </div>
          <div className={SnapToggleDivider} style={{ backgroundColor: factionData.borderColor }} />
          <FactionCheckbox
            isChecked={this.props.guidesEnabled}
            onCheckedChanged={() => this.props.dispatch(setGuidesEnabled(!this.props.guidesEnabled))}
            heightOverrideVmin={1.8}
          />
          <div className={OptionLabel}>
            {getStringTableValue(StringIDHUDEditorToggleGuides, this.props.stringTable)}
          </div>
        </div>
      </div>
    );
  }

  private renderChatFontSizeControls(factionData: FactionData): JSX.Element {
    const widget = this.props.widgets[this.props.selectedWidgetID];
    const value = widget.state.chatFontSize ?? ChatFontSizeDefault;
    return (
      <div className={OptionRow}>
        <div className={OptionLabel}>{getStringTableValue(StringIDHUDEditorChatFontSize, this.props.stringTable)}</div>
        <div className={SliderRow}>
          <input
            className={SliderInput}
            type='range'
            min={ChatFontSizeMin}
            max={ChatFontSizeMax}
            step={1}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setChatFontSize(Number(e.target.value))}
          />
          <div className={ToolbarText}>
            {getTokenizedStringTableValue(StringIDGeneralPercent, this.props.stringTable, {
              VALUE: String(value)
            })}
          </div>
        </div>
      </div>
    );
  }

  private renderToastDurationControls(): JSX.Element {
    const widget = this.props.widgets[this.props.selectedWidgetID];
    const value = widget.state.toastDurationSeconds ?? ToastDurationSecondsDefault;
    return (
      <div className={OptionRow}>
        <div className={OptionLabel}>{getStringTableValue(StringIDHUDEditorToastDuration, this.props.stringTable)}</div>
        <div className={SliderRow}>
          <input
            className={SliderInput}
            type='range'
            min={ToastDurationSecondsMin}
            max={ToastDurationSecondsMax}
            step={0.5}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setToastDuration(Number(e.target.value))}
          />
          <div className={ToolbarText}>{`${value.toFixed(1)}s`}</div>
        </div>
      </div>
    );
  }

  private setToastDuration(value: number): void {
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };
    state.toastDurationSeconds = Math.max(ToastDurationSecondsMin, Math.min(value, ToastDurationSecondsMax));
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    const update: Record<string, HUDWidgetState> = {};
    update[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(update));
  }

  /*
  private async onAddNewLayoutClicked(): Promise<void> {
    const newLayoutId = await clientAPI.createAbilityLayout();
    if (newLayoutId === 0) {
      this.showAbilityBarCreateErrorModal();
      return;
    }

    const newGroupId: number = await clientAPI.createAbilityGroup(`layout${newLayoutId}group1`);
    if (newGroupId === 0) {
      this.showAbilityBarCreateErrorModal();
      await clientAPI.deleteAbilityLayout(newLayoutId);
      return;
    } else {
      clientAPI.setVisibleAbilitySlots(newGroupId, 1);
      const groupCycle: number[] = [newGroupId];
      clientAPI.selectAbilityLayoutGroupCycle(newLayoutId, groupCycle);
      clientAPI.selectAbilityLayoutGroup(newLayoutId, newGroupId);
      // Wait a frame so the new ButtonLayout's update event arrives before selecting it.
      requestAnimationFrame(() => {
        this.onWidgetSelected(`Bar: Abilities ${newLayoutId}`);
      });
    }
  }

  private showAbilityBarCreateErrorModal(): void {
    this.props.dispatch(
      showModal({
        id: 'ButtonLayoutCreateError',
        content: {
          title: getStringTableValue(StringIDHUDEditorCreateAbilityBarErrorTitle, this.props.stringTable),
          message: getStringTableValue(StringIDHUDEditorCreateAbilityBarErrorMessage, this.props.stringTable)
        },
        escapable: true
      })
    );
  }
  */

  private handleDragEnded(_data: unknown, { dragDelta }: DropHandlerDraggableData): void {
    // Save the widget's overridden location.
    // We want it in vmin to reduce the chance of getting lost offscreen.
    const pxToVmin = Math.min(this.props.hudHeight, this.props.hudWidth) / 100;
    // Append the delta, since the old value was the delta that got it to its current position.
    const vminOffset: [number, number] = [
      this.state.offset[0] + dragDelta[0] / pxToVmin,
      this.state.offset[1] + dragDelta[1] / pxToVmin
    ];
    clientAPI.setHUDEditorOffset(vminOffset);
    this.setState({ offset: vminOffset });
  }

  componentWillUnmount(): void {
    if (this.buttonHeldHandle) {
      clearInterval(this.buttonHeldHandle);
      this.buttonHeldHandle = 0;
    }
  }

  private performRepeatableButtonAction(action: () => void): void {
    // Perform the action once right away.
    action();

    // Then delay a bit before starting to rapid-fire the event, so the user can still
    // get single-click events as expected.
    this.buttonHeldHandle = window.setInterval(() => {
      clearInterval(this.buttonHeldHandle);
      // And if the button is still held after the initial delay, start rapid-firing.
      this.buttonHeldHandle = window.setInterval(() => {
        action();
      }, ButtonRepeatTimeoutMS);
    }, FirstButtonRepeatTimeoutMS);
  }

  private setUIScaleAbsolute(value: number): void {
    const next = Math.max(MIN_UI_SCALE, Math.min(value, MAX_UI_SCALE));
    if (next !== this.props.uiScale) {
      clientAPI.setUIScale(next);
    }
  }

  private setChatFontSize(value: number): void {
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };
    state.chatFontSize = Math.max(ChatFontSizeMin, Math.min(value, ChatFontSizeMax));
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    const update: Record<string, HUDWidgetState> = {};
    update[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(update));
  }

  private getHorizontalMove(delta: number): [number, number] {
    const state = this.props.widgets[this.props.selectedWidgetID].state;
    if (state.xAnchor === HUDHorizontalAnchor.Right) {
      return [-delta, 0];
    } else {
      return [delta, 0];
    }
  }

  private getVerticalMove(delta: number): [number, number] {
    const state = this.props.widgets[this.props.selectedWidgetID].state;
    if (state.yAnchor === HUDVerticalAnchor.Bottom) {
      return [0, -delta];
    } else {
      return [0, delta];
    }
  }

  private onLeftMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changePosition(this.getHorizontalMove(-0.1));
    });
  }

  private onRightMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changePosition(this.getHorizontalMove(0.1));
    });
  }

  private onUpMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changePosition(this.getVerticalMove(-0.1));
    });
  }

  private onDownMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changePosition(this.getVerticalMove(0.1));
    });
  }

  private onButtonMouseUp(): void {
    clearInterval(this.buttonHeldHandle);
    this.buttonHeldHandle = 0;
  }

  private setOpacity(opacity: number): void {
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };
    state.opacity = Math.max(0, Math.min(opacity, 1));
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    const delta: Dictionary<HUDWidgetState> = {};
    delta[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(delta));
  }

  private setScale(scale: number): void {
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };
    state.scale = Math.max(MinWidgetScale, Math.min(scale, MaxWidgetScale));
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    const delta: Dictionary<HUDWidgetState> = {};
    delta[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(delta));
  }

  private changePosition(pDelta: [number, number]): void {
    // Copy the original state.
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };
    // Modify the state.
    state.xOffset = Math.round(((state.xOffset ?? 0) + pDelta[0]) * 100) / 100;
    state.yOffset = Math.round(((state.yOffset ?? 0) + pDelta[1]) * 100) / 100;
    // Save to HUDLocalStore.
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    // Save to Redux.
    const delta: Dictionary<HUDWidgetState> = {};
    delta[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(delta));
  }

  private changeAnchors(xAnchor: HUDHorizontalAnchor, yAnchor: HUDVerticalAnchor): void {
    // Copy the original state.
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };

    const pxToVmin = Math.min(this.props.hudHeight, this.props.hudWidth) / 100;

    // Modify the state.
    // Recalculate the offsets so the widget doesn't actually move when you change anchors.
    if (xAnchor !== state.xAnchor) {
      if (xAnchor === HUDHorizontalAnchor.Left) {
        state.xOffset = this.props.selectedWidgetBounds.x / pxToVmin;
      } else if (xAnchor === HUDHorizontalAnchor.Center) {
        const hudCenter = this.props.hudWidth / 2;
        const widgetCenter = this.props.selectedWidgetBounds.x + this.props.selectedWidgetBounds.width / 2;
        state.xOffset = (widgetCenter - hudCenter) / pxToVmin;
      } else {
        state.xOffset = (this.props.hudWidth - this.props.selectedWidgetBounds.right) / pxToVmin;
      }
      state.xOffset = Math.round(state.xOffset * 100) / 100;
    }
    if (yAnchor !== state.yAnchor) {
      if (yAnchor === HUDVerticalAnchor.Top) {
        state.yOffset = this.props.selectedWidgetBounds.y / pxToVmin;
      } else if (yAnchor === HUDVerticalAnchor.Center) {
        const hudCenter = this.props.hudHeight / 2;
        const widgetCenter = this.props.selectedWidgetBounds.y + this.props.selectedWidgetBounds.height / 2;
        state.yOffset = (widgetCenter - hudCenter) / pxToVmin;
      } else {
        state.yOffset = (this.props.hudHeight - this.props.selectedWidgetBounds.bottom) / pxToVmin;
        state.yOffset = Math.round(state.yOffset * 100) / 100;
      }
    }
    state.xAnchor = xAnchor;
    state.yAnchor = yAnchor;
    // Save to HUDLocalStore.
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    // Save to Redux.
    const delta: Record<string, HUDWidgetState> = {};
    delta[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(delta));
  }

  private onResetWidgetClicked(): void {
    // Clear in HUDLocalStore.
    clientAPI.clearWidgetState(this.props.selectedWidgetID);
    // Clear in Redux.
    this.props.dispatch(resetWidget(this.props.selectedWidgetID));
  }

  private onResetAllClicked(): void {
    // And reset ourself for good measure.
    clientAPI.setHUDEditorOffset([0, 0]);
    this.setState({ offset: [0, 0] });
    // Clear in HUDLocalStore.
    clientAPI.clearAllWidgetStates();
    // Clear in Redux.
    this.props.dispatch(resetAllWidgets());
  }

  private onReloadUIClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);
    clientAPI.reloadUI();
  }

  private onWidgetSelected(widgetID: string): void {
    this.props.dispatch(setSelectedWidget(widgetID));
  }

  private getWidgetName(registration: HUDWidgetRegistration | null): string {
    if (!registration) return '';

    if (registration.nameStringTokens) {
      return getTokenizedStringTableValue(
        registration.nameStringID,
        this.props.stringTable,
        registration.nameStringTokens
      );
    }
    return getStringTableValue(registration.nameStringID, this.props.stringTable);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): ReactProps & InjectedProps {
  const { hudWidth, hudHeight, widgets, activeConditionalWidgetIDs, uiFactionID, nameplateStyle, uiScale } = state.hud;
  const { selectedWidgetID, selectedGroupKey, selectedWidgetBounds, snapEnabled, guidesEnabled } = state.hud.editor;
  const { editStatus, layouts, groups } = state.abilities;
  return {
    ...ownProps,
    hudWidth,
    hudHeight,
    widgets,
    selectedWidgetID,
    selectedGroupKey,
    selectedWidgetBounds,
    editStatus,
    layouts,
    groups,
    activeConditionalWidgetIDs,
    stringTable: state.stringTable.stringTable,
    uiFactionID,
    isPartyHorizontal: state.party.isHorizontal,
    nameplateStyle,
    uiScale,
    snapEnabled,
    guidesEnabled
  };
}

export const HUDEditor = connect(mapStateToProps)(AHUDEditor);
