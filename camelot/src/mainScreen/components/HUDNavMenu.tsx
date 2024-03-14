/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidget, HUDWidgetRegistration, toggleBuildingMode, toggleMenuWidget } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import HUDNavMenuButton from './HUDNavMenuButton';
import { KeyActionsState } from '../redux/keyActionsSlice';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { WIDGET_NAME_ABILITY_BOOK } from './abilityBook/AbilityBook';
import { WIDGET_NAME_ABILITY_BUILDER } from './abilityBuilder/AbilityBuilder';
import { WIDGET_NAME_EQUIPPED } from './equipped/Equipped';
import { WIDGET_NAME_GAME_INFO } from './GameInfo';
import { WIDGET_NAME_GAME_MENU } from './GameMenu';
import { WIDGET_NAME_INVENTORY } from './inventory/Inventory';
import { WIDGET_NAME_JOIN_SCENARIO } from './joinScenario/JoinScenario';
import { InitTopic } from '../redux/initializationSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { MyScenarioQueue } from '@csegames/library/dist/camelotunchained/graphql/schema';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import IconAbilityBookURL from '../../images/hudnav/hudnavicon_book.png';
import IconAbilityBuilderURL from '../../images/hudnav/hudnavicon_toolbox.png';
import IconCogURL from '../../images/hudnav/hudnavicon_cog.png';
import IconCollapseURL from '../../images/hudnav/hudnavicon_collapse.png';
import IconCubeURL from '../../images/hudnav/hudnavicon_cube.png';
import IconEquippedURL from '../../images/hudnav/hudnavicon_equipped.png';
import IconExpandURL from '../../images/hudnav/hudnavicon_expand.png';
import IconInfoURL from '../../images/hudnav/hudnavicon_info.png';
import IconInventoryURL from '../../images/hudnav/hudnavicon_briefcase.png';
import IconJoinScenarioURL from '../../images/hudnav/hudnavicon_joinscenario.png';
import IconNearbyPlotURL from '../../images/hudnav/hudnavicon_nearbyplot.png';
import IconOwnedPlotURL from '../../images/hudnav/hudnavicon_ownedplot.png';
import IconProgressionURL from '../../images/hudnav/hudnavicon_progression.png';
import IconReloadUIURL from '../../images/hudnav/hudnavicon_reloadui.png';
import IconScenarioManagementURL from '../../images/hudnav/hudnavicon_scenariomanagement.png';
import IconToggleUIEditModeURL from '../../images/hudnav/hudnavicon_toggleuieditmode.png';
import IconWarningURL from '../../images/hudnav/hudnavicon_warning.png';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { isScenarioMatchAvailable } from './joinScenario/joinScenarioUtils';

// Styles.
const Root = 'HUD-NavMenu-Root';

interface State {
  collapsed: boolean;
}

interface ReactProps {}

interface InjectedProps {
  keyActions: KeyActionsState;
  isHUDEditingEnabled: boolean;
  activeMenuIds: string[];
  isBuildingModeActive: boolean;
  uninitializedTopics: InitTopic[];
  widgets: Dictionary<HUDWidget>;
  scenarioQueue: MyScenarioQueue | null;
  faction: Faction;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AHUDNavMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      collapsed: false
    };
  }

  render(): JSX.Element {
    let scenarioCount: number | undefined;
    if (this.props.scenarioQueue?.availableMatches) {
      const scenarioAmount: number = this.props.scenarioQueue.availableMatches.filter(
        (match) => match && isScenarioMatchAvailable(match, this.props.faction)
      ).length;
      if (scenarioAmount > 0) {
        scenarioCount = scenarioAmount;
      }
    }
    return (
      <div className={Root}>
        {this.state.collapsed ? (
          <>
            <HUDNavMenuButton
              tooltipContent={'Show Quick Menu'}
              tooltipID={'HUDNav-ShowQuickMenu'}
              icon={IconExpandURL}
              onClick={this.onExpandClicked.bind(this)}
            />
          </>
        ) : (
          <>
            {this.props.uninitializedTopics.length > 0 && (
              <HUDNavMenuButton
                tooltipContent={this.getWarningTooltipContent.bind(this)}
                tooltipID={'HUDNav-Warning'}
                icon={IconWarningURL}
              />
            )}
            {/* TODO: Console */}
            <HUDNavMenuButton
              tooltipContent={'Game Menu'}
              tooltipID={'HUDNav-GameMenu'}
              icon={IconCogURL}
              onClick={this.onGameMenuClicked.bind(this)}
            />
            <HUDNavMenuButton
              tooltipContent={'Toggle Building Mode'}
              tooltipID={'HUDNav-ToggleBuildingMode'}
              icon={IconCubeURL}
              onClick={this.onToggleBuildingModeClicked.bind(this)}
            />
            {/* TODO: Character */}
            <HUDNavMenuButton
              tooltipContent={'Equipped Items'}
              tooltipID={'HUDNav-Equipped'}
              icon={IconEquippedURL}
              onClick={this.onEquippedClicked.bind(this)}
            />
            <HUDNavMenuButton
              tooltipContent={'Inventory'}
              tooltipID={'HUDNav-Inventory'}
              icon={IconInventoryURL}
              onClick={this.onInventoryClicked.bind(this)}
            />
            {/* TODO: Crafting */}
            <HUDNavMenuButton
              tooltipContent={'Nearby Plot'}
              tooltipID={'HUDNav-NearbyPlot'}
              icon={IconNearbyPlotURL}
              onClick={this.onNearbyPlotClicked.bind(this)}
            />
            <HUDNavMenuButton
              tooltipContent={'Game Info'}
              tooltipID={'HUDNav-GameInfo'}
              icon={IconInfoURL}
              onClick={this.onGameInfoClicked.bind(this)}
            />
            <HUDNavMenuButton
              tooltipContent={'Owned Plot'}
              tooltipID={'HUDNav-OwnedPlot'}
              icon={IconOwnedPlotURL}
              onClick={this.onOwnedPlotClicked.bind(this)}
            />
            {/* TODO: World Map */}
            <HUDNavMenuButton
              tooltipContent={'Join Scenario'}
              tooltipID={'HUDNav-JoinScenario'}
              icon={IconJoinScenarioURL}
              count={scenarioCount}
              onClick={this.onJoinScenarioClicked.bind(this)}
            />
            <HUDNavMenuButton
              tooltipContent={'Scenario Management'}
              tooltipID={'HUDNav-ScenarioManagement'}
              icon={IconScenarioManagementURL}
              onClick={this.onScenarioManagementClicked.bind(this)}
            />
            {/* TODO: Scenario Results */}
            {/* TODO: Progression */}
            <HUDNavMenuButton
              tooltipContent={'Ability Builder'}
              tooltipID={'HUDNav-AbilityBuilder'}
              icon={IconAbilityBuilderURL}
              onClick={this.onAbilityBuilderClicked.bind(this)}
            />
            <HUDNavMenuButton
              tooltipContent={'Ability Book'}
              tooltipID={'HUDNav-AbilityBook'}
              icon={IconAbilityBookURL}
              onClick={this.onAbilityBookClicked.bind(this)}
            />
            <HUDNavMenuButton
              tooltipContent={'Progression'}
              tooltipID={'HUDNav-Progression'}
              icon={IconProgressionURL}
              onClick={this.onProgressionClicked.bind(this)}
            />
            <HUDNavMenuButton
              tooltipContent={'Toggle UI Edit Mode'}
              tooltipID={'HUDNav-ToggleUIEditMode'}
              icon={IconToggleUIEditModeURL}
              onClick={this.onToggleUIEditMode.bind(this)}
            />
            <HUDNavMenuButton
              tooltipContent={'Reload UI'}
              tooltipID={'HUDNav-ReloadUI'}
              icon={IconReloadUIURL}
              onClick={this.onReloadUIClicked.bind(this)}
            />
            <HUDNavMenuButton
              tooltipContent={'Collapse Quick Menu'}
              tooltipID={'HUDNav-CollapseQuickMenu'}
              icon={IconCollapseURL}
              onClick={this.onCollapseClicked.bind(this)}
            />
          </>
        )}
      </div>
    );
  }

  private onExpandClicked(): void {
    this.setState({ collapsed: false });
  }

  private onCollapseClicked(): void {
    this.setState({ collapsed: true });
  }

  private getWarningTooltipContent(): React.ReactNode {
    const widgetNames: string[] = [];
    for (const widgetID of Object.keys(this.props.widgets)) {
      if (!this.props.widgets[widgetID].state.initialized && this.props.widgets[widgetID].registration) {
        widgetNames.push(this.props.widgets[widgetID].registration.name);
      }
    }
    return (
      <>
        <span>Some requests failed during initialization.</span>
        {widgetNames.length > 0 && (
          <>
            <br />
            <span>Impacted widgets: {widgetNames.join(', ')}</span>
          </>
        )}
      </>
    );
  }

  private onGameMenuClicked(): void {
    this.props.dispatch(toggleMenuWidget({ widgetId: WIDGET_NAME_GAME_MENU, escapableId: WIDGET_NAME_GAME_MENU }));
  }

  private onToggleBuildingModeClicked(): void {
    // Send the KeyAction to the Client.  This will update the ActionBar SystemAnchor for building mode.
    game.triggerKeyAction(this.props.keyActions.UIToggleBuildingMode);
    this.props.dispatch(toggleBuildingMode());
  }

  private onEquippedClicked(): void {
    this.props.dispatch(toggleMenuWidget({ widgetId: WIDGET_NAME_EQUIPPED, escapableId: WIDGET_NAME_EQUIPPED }));
  }

  private onInventoryClicked(): void {
    this.props.dispatch(toggleMenuWidget({ widgetId: WIDGET_NAME_INVENTORY, escapableId: WIDGET_NAME_INVENTORY }));
  }

  private onNearbyPlotClicked(): void {
    game.sendSlashCommand('plot showui --nearby');
  }

  private onGameInfoClicked(): void {
    this.props.dispatch(toggleMenuWidget({ widgetId: WIDGET_NAME_GAME_INFO, escapableId: WIDGET_NAME_GAME_INFO }));
  }

  private onOwnedPlotClicked(): void {
    game.sendSlashCommand('plot showui --owned');
  }

  private onJoinScenarioClicked(): void {
    this.props.dispatch(
      toggleMenuWidget({ widgetId: WIDGET_NAME_JOIN_SCENARIO, escapableId: WIDGET_NAME_JOIN_SCENARIO })
    );
  }

  private onScenarioManagementClicked(): void {
    game.sendSlashCommand('scenario showdevui');
  }

  private onAbilityBuilderClicked(): void {
    this.props.dispatch(
      toggleMenuWidget({ widgetId: WIDGET_NAME_ABILITY_BUILDER, escapableId: WIDGET_NAME_ABILITY_BUILDER })
    );
  }

  private onAbilityBookClicked(): void {
    this.props.dispatch(
      toggleMenuWidget({ widgetId: WIDGET_NAME_ABILITY_BOOK, escapableId: WIDGET_NAME_ABILITY_BOOK })
    );
  }

  private onProgressionClicked(): void {
    game.sendSlashCommand('progressiondevui show');
  }

  private onToggleUIEditMode(): void {
    clientAPI.requestEditMode(!this.props.isHUDEditingEnabled);
  }

  private onReloadUIClicked(): void {
    game.reloadUI();
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { keyActions } = state;
  const isHUDEditingEnabled = state.abilities.editStatus.canEdit;
  return {
    ...ownProps,
    keyActions,
    isHUDEditingEnabled,
    activeMenuIds: state.hud.activeMenuIds,
    isBuildingModeActive: state.hud.isBuildingModeActive,
    uninitializedTopics: state.initialization.uninitializedTopics,
    widgets: state.hud.widgets,
    scenarioQueue: state.scenario.queue,
    faction: state.player.faction
  };
}

const HUDNavMenu = connect(mapStateToProps)(AHUDNavMenu);

const WIDGET_NAME = 'Nav Menu';
export const hudNavMenuRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME,
  defaults: {},
  layer: HUDLayer.HUD,
  render: () => {
    return <HUDNavMenu />;
  }
};
