/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import IconWarningURL from '../../images/hudnav/hudnavicon_warning.png';

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { HUDLayer, HUDWidget, HUDWidgetRegistration, toggleConditionalWidget } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import HUDNavMenuButton from './HUDNavMenuButton';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { WIDGET_ID_ABILITY_BOOK } from './abilityBook/AbilityBook';
import { WIDGET_ID_EQUIPPED } from './Equipped';
import { WIDGET_ID_GAME_INFO } from './GameInfo';
import { WIDGET_ID_GAME_MENU } from './GameMenu';
import { WIDGET_ID_INVENTORY } from './inventory/Inventory';
import { WIDGET_ID_WORLD_MAP } from './WorldMap';
import { LoadingTopic } from '../redux/loadingSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { getFactionData } from '../gameData/factionData';
import { FactionBorder, BorderType } from './FactionBorder';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { ResizeDetector } from '../../shared/components/ResizeDetector';
import { WIDGET_ID_MAIL } from './mail/Mail';
import { WIDGET_ID_GUILD } from './guild/Guild';
import { WIDGET_ID_QUESTLOG } from './quests/QuestLog';
import { getAvailableAbilityPoints } from '../helpers/abilityBookHelpers';

// CSS classes
const Root = 'HUD-NavMenu-Root';
const Collapser = 'HUD-NavMenu-Collapser';
const End = 'HUD-NavMenu-End';
const Icons = 'HUD-NavMenu-Icons';

// String IDs
const StringIDHUDEditorWidgetNameGameMenu = 'HUDEditorWidgetNameGameMenu';
const StringIDHUDEditorWidgetNameWorldMap = 'HUDEditorWidgetNameWorldMap';
const StringIDHUDEditorWidgetNameEquipped = 'HUDEditorWidgetNameEquipped';
const StringIDHUDEditorWidgetNameInventory = 'HUDEditorWidgetNameInventory';
const StringIDHUDEditorWidgetNameGameInfo = 'HUDEditorWidgetNameGameInfo';
const StringIDHUDEditorWidgetNameAbilityBook = 'HUDEditorWidgetNameAbilityBook';
const StringIDHUDEditorWidgetNameMail = 'HUDEditorWidgetNameMail';
const StringIDHUDEditorWidgetNameGuild = 'HUDEditorWidgetNameGuild';
const StringIDHUDEditorWidgetNameQuestLog = 'HUDEditorWidgetNameQuestLog';

// Keybind IDs - must match values from Input.h in the client repo.
const KeybindIDGameMenu = 33; // UIMenu
const KeybindIDInventory = 35; // UIInventoryWindow
const KeybindIDEquipped = 36; // UIEquippedGearWindow
const KeybindIDMap = 37; // UIMapWindow
const KeybindIDAbilityBook = 40; // UIAbilityBookWindow

interface State {
  collapsed: boolean;
  originalBarWidth: number;
  originalBarHeight: number;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  activeConditionalWidgetIDs: string[];
  isBuildingModeActive: boolean;
  uninitializedTopics: LoadingTopic[];
  widgets: Dictionary<HUDWidget>;
  isEditingHUD: boolean;
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  keybinds: Record<string, Keybind>;
  hasAvailableAbilityPoints: boolean;
}

type Props = ReactProps & InjectedProps;

class AHUDNavMenu extends React.Component<Props & DispatchProp, State> {
  constructor(props: Props & DispatchProp) {
    super(props);

    this.state = {
      collapsed: false,
      originalBarWidth: 0,
      originalBarHeight: 0
    };
  }

  render(): JSX.Element {
    let preferredWidth = this.state.collapsed ? 0 : this.state.originalBarWidth;

    const isMailAllowed = true;

    const factionData = getFactionData(this.props.uiFactionID);
    return (
      <div className={Root}>
        <img className={End} src={factionData.hudnavEndImage} onClick={this.onToggleCollapse.bind(this)} />
        <div
          className={Collapser}
          style={{
            width: this.state.originalBarWidth > 0 ? `${preferredWidth}px` : undefined,
            height: this.state.originalBarHeight > 0 ? `${this.state.originalBarHeight}px` : undefined
          }}
        >
          <FactionBorder
            style={{ backgroundImage: `url(${factionData.windowBackgroundImage})` }}
            className={Icons}
            type={BorderType.Primary}
            includeRight={false}
          >
            <>
              <ResizeDetector onResize={this.onBarLayout.bind(this)} />
              {this.props.uninitializedTopics.length > 0 && (
                <HUDNavMenuButton
                  tooltipContent={this.getWarningTooltipContent.bind(this)}
                  tooltipID={'HUDNav-Warning'}
                  icon={IconWarningURL}
                />
              )}
              <HUDNavMenuButton
                tooltipContent={this.buildTooltipText(StringIDHUDEditorWidgetNameWorldMap, KeybindIDMap)}
                tooltipID={'HUDNav-Map'}
                icon={factionData.hudnavIconWorldMapImage}
                onClick={this.onMapClicked.bind(this)}
              />
              <HUDNavMenuButton
                tooltipContent={this.buildTooltipText(StringIDHUDEditorWidgetNameInventory, KeybindIDInventory)}
                tooltipID={'HUDNav-Inventory'}
                icon={factionData.hudnavIconInventoryImage}
                onClick={this.onInventoryClicked.bind(this)}
              />
              <HUDNavMenuButton
                tooltipContent={this.buildTooltipText(StringIDHUDEditorWidgetNameEquipped, KeybindIDEquipped)}
                tooltipID={'HUDNav-Equipped'}
                icon={factionData.hudnavIconEquippedImage}
                onClick={this.onEquippedClicked.bind(this)}
              />
              <HUDNavMenuButton
                tooltipContent={this.buildTooltipText(StringIDHUDEditorWidgetNameAbilityBook, KeybindIDAbilityBook)}
                tooltipID={'HUDNav-AbilityBook'}
                icon={factionData.hudnavIconAbilityBookImage}
                glow={this.props.hasAvailableAbilityPoints}
                onClick={this.onAbilityBookClicked.bind(this)}
              />
              {isMailAllowed && (
                <HUDNavMenuButton
                  tooltipContent={getStringTableValue(StringIDHUDEditorWidgetNameMail, this.props.stringTable)}
                  tooltipID={'HUDNav-Mail'}
                  icon={factionData.hudnavIconMailImage}
                  onClick={this.onMailClicked.bind(this)}
                />
              )}
              <HUDNavMenuButton
                tooltipContent={getStringTableValue(StringIDHUDEditorWidgetNameQuestLog, this.props.stringTable)}
                tooltipID={'HUDNav-QuestLog'}
                icon={factionData.hudnavIconQuestLogImage}
                onClick={this.onQuestLogClicked.bind(this)}
              />
              <HUDNavMenuButton
                tooltipContent={getStringTableValue(StringIDHUDEditorWidgetNameGuild, this.props.stringTable)}
                tooltipID={'HUDNav-Guild'}
                icon={factionData.hudnavIconGuildImage}
                onClick={this.onGuildClicked.bind(this)}
              />
              <HUDNavMenuButton
                tooltipContent={getStringTableValue(StringIDHUDEditorWidgetNameGameInfo, this.props.stringTable)}
                tooltipID={'HUDNav-GameInfo'}
                icon={factionData.hudnavIconGameInfoImage}
                onClick={this.onGameInfoClicked.bind(this)}
              />
              <HUDNavMenuButton
                tooltipContent={this.buildTooltipText(StringIDHUDEditorWidgetNameGameMenu, KeybindIDGameMenu)}
                tooltipID={'HUDNav-GameMenu'}
                icon={factionData.hudnavIconGameMenuImage}
                onClick={this.onGameMenuClicked.bind(this)}
              />
            </>
          </FactionBorder>
        </div>
      </div>
    );
  }

  private buildTooltipText(nameStringID: string, keybindID?: number): string {
    const name = getStringTableValue(nameStringID, this.props.stringTable);
    const keybind = this.props.keybinds[keybindID ?? -1]?.binds[0]?.name;
    if (!keybind) {
      return name;
    }

    return `${name} (${keybind})`;
  }

  private getWarningTooltipContent(): React.ReactNode {
    const widgetIDs: string[] = [];
    for (const widgetID of Object.keys(this.props.widgets)) {
      if (!this.props.widgets[widgetID].state.initialized && this.props.widgets[widgetID].registration) {
        widgetIDs.push(this.props.widgets[widgetID].registration.id);
      }
    }
    return (
      <>
        <span>{'Some requests failed during initialization.'}</span>
        {widgetIDs.length > 0 && (
          <>
            <br />
            <span>{`Impacted widgets: ${widgetIDs.join(', ')}`}</span>
          </>
        )}
      </>
    );
  }

  private onGameMenuClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);
    this.props.dispatch(toggleConditionalWidget(WIDGET_ID_GAME_MENU));
  }

  private onMapClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);
    this.props.dispatch(toggleConditionalWidget(WIDGET_ID_WORLD_MAP));
  }

  private onEquippedClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);
    this.props.dispatch(toggleConditionalWidget(WIDGET_ID_EQUIPPED));
  }

  private onInventoryClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);
    this.props.dispatch(toggleConditionalWidget(WIDGET_ID_INVENTORY));
  }

  private onGameInfoClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);
    this.props.dispatch(toggleConditionalWidget(WIDGET_ID_GAME_INFO));
  }

  private onAbilityBookClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);
    if (this.props.activeConditionalWidgetIDs.includes(WIDGET_ID_ABILITY_BOOK)) {
      if (!this.props.isEditingHUD) {
        clientAPI.requestEditMode(false);
      }
    } else {
      clientAPI.requestEditMode(true);
    }
    this.props.dispatch(toggleConditionalWidget(WIDGET_ID_ABILITY_BOOK));
  }

  private onMailClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);

    this.props.dispatch(toggleConditionalWidget(WIDGET_ID_MAIL));
  }

  private onQuestLogClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);

    this.props.dispatch(toggleConditionalWidget(WIDGET_ID_QUESTLOG));
  }

  private onGuildClicked(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_QUICK_MENU_SELECT);
    this.props.dispatch(toggleConditionalWidget(WIDGET_ID_GUILD));
  }

  private onBarLayout(newWidth: number, newHeight: number, oldWidth: number, oldHeight: number): void {
    if (newWidth > 0 && newHeight > 0) {
      this.setState({ originalBarWidth: newWidth, originalBarHeight: newHeight });
    }
  }

  private onToggleCollapse(): void {
    this.setState({ collapsed: !this.state.collapsed });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const myClass = state.gameDefs.classesByNumericID[state.entities.self?.classID];
  return {
    ...ownProps,
    activeConditionalWidgetIDs: state.hud.activeConditionalWidgetIDs,
    isBuildingModeActive: state.hud.isBuildingModeActive,
    uninitializedTopics: state.loading.uninitializedTopics,
    widgets: state.hud.widgets,
    isEditingHUD: state.hud.isEditingHUD,
    uiFactionID: state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable,
    keybinds: state.keybinds,
    hasAvailableAbilityPoints: getAvailableAbilityPoints(myClass, state.gameDefs, state.entities.self) > 0
  };
}

const HUDNavMenu = connect(mapStateToProps)(AHUDNavMenu);

export const WIDGET_ID_NAV_MENU = 'Nav Menu';
export const hudNavMenuRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_NAV_MENU,
  nameStringID: 'HUDEditorWidgetNameQuickAccessMenu',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Bottom,
    yOffset: 1
  },
  layer: HUDLayer.HUD,
  requiresGameDefsLoaded: true,
  render: (isDragCopy: boolean) => {
    return <HUDNavMenu isDragCopy={isDragCopy} />;
  }
};
