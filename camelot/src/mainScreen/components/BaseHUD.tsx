/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AnyEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  EscapableParams,
  HUDLayer,
  HUDWidget,
  HUDWidgetRegistration,
  addMenuWidgetExiting,
  initializeWidget,
  toggleMenuWidget,
  updateHUDSize,
  updateMousePosition
} from '../redux/hudSlice';
import { RootState } from '../redux/store';
import BaseHUDWidget from './BaseHUDWidget';
import ContextMenuPane from './ContextMenuPane';
import DragAndDropPane from './DragAndDropPane';
import HUDEditor from './HUDEditor';
import { HUDEditorStatusDisplay } from './HUDEditorStatusDisplay';
import ModalPane from './ModalPane';
import ToasterPane from './ToasterPane';
import TooltipPane from './TooltipPane';
import { WIDGET_NAME_GAME_MENU } from './GameMenu';
import { WIDGET_NAME_RESPAWN } from './Respawn';
import { WIDGET_NAME_ABILITY_BOOK } from './abilityBook/AbilityBook';
import { WIDGET_NAME_ABILITY_BUILDER } from './abilityBuilder/AbilityBuilder';
import { WIDGET_NAME_INVENTORY } from './inventory/Inventory';
import { InteractiveAlert } from './InteractiveAlert';
import { InteractiveAlert as IInteractiveAlert, removeInteractiveAlert } from '../redux/alertsSlice';
import { ErrorNotice } from './ErrorNotice';
import { ErrorNotice as IErrorNotice, removeErrorNotice } from '../redux/errorNoticesSlice';
import { PopUpAnnouncement } from './PopUpAnnouncement';
import { PopUpAnnouncement as IPopUpAnnouncement, removePopUpAnnouncement } from '../redux/popUpAnnouncementsSlice';
import { CSETransition } from '../../shared/components/CSETransition';
import { WIDGET_NAME_EQUIPPED } from './equipped/Equipped';
import { InitTopic } from '../redux/initializationSlice';

// Styles
const Root = 'MainScreen-Root';
const Filter = 'MainScreen-Filter';
const ErrorNotices = 'MainScreen-ErrorNotices';
const PopUpAnnouncements = 'MainScreen-PopUpAnnouncements';
const BetaWatermark = 'MainScreen-BetaWatermark';

interface ReactProps {}

interface InjectedProps {
  showMockData: boolean;
  widgets: Dictionary<HUDWidget>;
  activeMenuIds: string[];
  escapables: EscapableParams[];
  selectedWidgetID: string;
  initCompleted: boolean;
  friendlyTarget: AnyEntityStateModel;
  enemyTarget: AnyEntityStateModel;
  isBindingKey: boolean;
  isHUDEditingEnabled: boolean;
  requestEnemyTarget: (id: string) => void;
  requestFriendlyTarget: (id: string) => void;
  isAlive: boolean;
  interactiveAlerts: IInteractiveAlert[];
  errorNotices: IErrorNotice[];
  popUpAnnouncements: IPopUpAnnouncement[];
  uninitializedTopics: InitTopic[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

export class BaseHUD extends React.Component<Props> {
  public render(): React.ReactNode {
    this.reportCurrentSize();
    const popUpAnnouncement = this.props.popUpAnnouncements[this.props.popUpAnnouncements.length - 1];
    return (
      this.props.initCompleted && (
        <div className={Root}>
          <HUDEditorStatusDisplay />
          <div className={Filter} />
          {this.getSortedWidgetsToRender().map((widget) => {
            if (widget.state.visible && widget.registration) {
              const widgetID = widget.registration.name;
              return <BaseHUDWidget key={`HUDWidget.${widgetID}`} widgetID={widgetID}></BaseHUDWidget>;
            } else {
              return null;
            }
          })}

          {this.props.isHUDEditingEnabled && <HUDEditor />}

          <DragAndDropPane />
          <TooltipPane />
          <ContextMenuPane />
          <ToasterPane />
          <ModalPane />

          {this.props.interactiveAlerts.map((interactiveAlert) => (
            <CSETransition
              show={!interactiveAlert.isHidden}
              onExitComplete={() => {
                this.props.dispatch(removeInteractiveAlert(interactiveAlert.id));
              }}
              key={interactiveAlert.id}
            >
              <InteractiveAlert interactiveAlert={interactiveAlert} />
            </CSETransition>
          ))}

          <div className={ErrorNotices}>
            {[...this.props.errorNotices].reverse().map((errorNotice) => (
              <CSETransition
                show={!errorNotice.isHidden}
                onExitComplete={() => {
                  this.props.dispatch(removeErrorNotice(errorNotice.id));
                }}
                key={errorNotice.id}
              >
                <ErrorNotice errorNotice={errorNotice} />
              </CSETransition>
            ))}
          </div>

          <div className={PopUpAnnouncements}>
            {popUpAnnouncement && (
              <CSETransition
                show={!popUpAnnouncement.isHidden}
                onExitComplete={() => {
                  this.props.dispatch(removePopUpAnnouncement(popUpAnnouncement.id));
                }}
                key={popUpAnnouncement.id}
              >
                <PopUpAnnouncement popUpAnnouncement={popUpAnnouncement} />
              </CSETransition>
            )}
          </div>

          <div className={BetaWatermark}>{'Beta 1 - Do not stream or distribute.'}</div>
        </div>
      )
    );
  }

  private getSortedWidgetsToRender(): HUDWidget[] {
    // Non-menu items first.
    // Exclude the selected widget so we can put it on top later.
    const widgets: HUDWidget[] = Object.values(this.props.widgets)
      .filter((widget) => {
        return (
          widget.registration &&
          widget.registration.layer !== HUDLayer.Menus &&
          widget.registration.name !== this.props.selectedWidgetID
        );
      })
      .sort(this.compareWidgets.bind(this));

    // Menu items next, as ordered by the explicit stack.
    this.props.activeMenuIds.forEach((menuId) => {
      // Selected widget is left out until the end.
      if (this.props.selectedWidgetID !== menuId) {
        widgets.push(this.props.widgets[menuId]);
      }
    });

    // Selected widget (if any) last, so it shows on top of everything else.
    if (this.props.selectedWidgetID?.length > 0) {
      widgets.push(this.props.widgets[this.props.selectedWidgetID]);
    }

    return widgets;
  }

  private compareWidgets(a: HUDWidgetRegistration, b: HUDWidgetRegistration): number {
    // After that, sort by Layer.
    const aVal = a.layer + (a.layerOffset ?? 0);
    const bVal = b.layer + (b.layerOffset ?? 0);

    return aVal - bVal;
  }

  public componentDidMount(): void {
    // React doesn't inherently detect resizes in a way that triggers all of the updates we need,
    // so we listen at the window level, and anyone who cares can watch the size via Redux.
    window.addEventListener('resize', this.reportCurrentSize.bind(this));
    window.addEventListener('mousemove', this.reportMousePosition.bind(this));

    clientAPI.bindToggleHUDEditorListener(this.onToggleHUDEditor.bind(this));
    clientAPI.bindNavigateListener(this.onEscapePressed.bind(this), 'gamemenu');
    clientAPI.bindNavigateListener(this.onToggleAbilityBook.bind(this), 'ability-book');
    clientAPI.bindNavigateListener(this.onToggleAbilityBuilder.bind(this), 'ability-builder');
    clientAPI.bindNavigateListener(this.onToggleInventory.bind(this), 'inventory');
    clientAPI.bindNavigateListener(this.onToggleEquipped.bind(this), 'equippedgear');
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    // Initialize widgets
    for (const widgetID of Object.keys(this.props.widgets)) {
      const widget = this.props.widgets[widgetID];
      if (
        widget.registration &&
        !widget.state.initialized &&
        (!widget.registration.initTopics ||
          widget.registration.initTopics.every((topic) => !this.props.uninitializedTopics.includes(topic)))
      ) {
        this.props.dispatch(initializeWidget(widgetID));
      }
    }

    // Show respawn menu if the player died
    if (!this.props.isAlive && prevProps.isAlive && !this.props.activeMenuIds.includes(WIDGET_NAME_RESPAWN)) {
      this.props.dispatch(
        toggleMenuWidget({
          widgetId: WIDGET_NAME_RESPAWN,
          escapableId: WIDGET_NAME_RESPAWN
        })
      );
    }
    // Hide respawn menu if the player is alive
    if (this.props.isAlive && this.props.activeMenuIds.includes(WIDGET_NAME_RESPAWN)) {
      this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_RESPAWN));
    }
  }

  private reportCurrentSize(): void {
    if (window.innerWidth > 0) {
      this.props.dispatch(updateHUDSize([window.innerWidth, window.innerHeight]));
    }
  }

  private reportMousePosition(event: MouseEvent): void {
    this.props.dispatch(updateMousePosition([event.clientX, event.clientY]));
  }

  private onToggleHUDEditor(): void {
    clientAPI.requestEditMode(!this.props.isHUDEditingEnabled);
  }

  private onEscapePressed(): void {
    if (!this.props.isBindingKey) {
      // If we are in HUD edit mode, escape should be prioritized to closing edit mode, as
      // the show/hide of individual widgets is under the HUDEditor's control at that time.
      if (this.props.isHUDEditingEnabled) {
        clientAPI.requestEditMode(false);
      }
      // Trigger the top escape-able UI, if any.
      else if (this.props.escapables.length > 0) {
        // Note that this doesn't directly remove the escapable from the list.
        // If the onEscape callback does dismiss a view, then its <Escapeable/> component
        // will de-register itself when it is removed from the view hierarchy.  This allows
        // us to support situations like the Settings screen, which may prompt you to save
        // pending changes when you hit Escape to close.
        this.props.escapables[this.props.escapables.length - 1].onEscape(this.props.dispatch);
      } else if (this.props.friendlyTarget || this.props.enemyTarget) {
        // De-select current target(s), if any.
        this.props.requestEnemyTarget('');
        this.props.requestFriendlyTarget('');
      } else if (!this.props.activeMenuIds.includes(WIDGET_NAME_GAME_MENU)) {
        this.props.dispatch(toggleMenuWidget({ widgetId: WIDGET_NAME_GAME_MENU, escapableId: WIDGET_NAME_GAME_MENU }));
      }
    }
  }

  private onToggleAbilityBook(): void {
    this.props.dispatch(
      toggleMenuWidget({ widgetId: WIDGET_NAME_ABILITY_BOOK, escapableId: WIDGET_NAME_ABILITY_BOOK })
    );
  }

  private onToggleAbilityBuilder(): void {
    this.props.dispatch(
      toggleMenuWidget({ widgetId: WIDGET_NAME_ABILITY_BUILDER, escapableId: WIDGET_NAME_ABILITY_BUILDER })
    );
  }

  private onToggleInventory(): void {
    this.props.dispatch(toggleMenuWidget({ widgetId: WIDGET_NAME_INVENTORY, escapableId: WIDGET_NAME_INVENTORY }));
  }

  private onToggleEquipped(): void {
    this.props.dispatch(toggleMenuWidget({ widgetId: WIDGET_NAME_EQUIPPED, escapableId: WIDGET_NAME_EQUIPPED }));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { showMockData, widgets, escapables } = state.hud;
  const { selectedWidgetId: selectedWidgetID } = state.hud.editor;
  const initCompleted = state.initialization.completed;
  const { friendlyTarget, enemyTarget } = state.entities;
  const { activeMenuIds, isBindingKey } = state.hud;
  const { requestEnemyTarget, requestFriendlyTarget, isAlive } = state.player;
  const isHUDEditingEnabled = state.abilities.editStatus.canEdit;
  const { interactiveAlerts } = state.alerts;
  const { errorNotices } = state.errorNotices;
  const { popUpAnnouncements } = state.popUpAnnouncements;
  const { uninitializedTopics } = state.initialization;
  return {
    ...ownProps,
    showMockData,
    widgets,
    escapables,
    selectedWidgetID,
    initCompleted,
    friendlyTarget,
    enemyTarget,
    activeMenuIds,
    isBindingKey,
    isHUDEditingEnabled,
    requestEnemyTarget,
    requestFriendlyTarget,
    isAlive,
    interactiveAlerts,
    errorNotices,
    popUpAnnouncements,
    uninitializedTopics
  };
}

export default connect(mapStateToProps)(BaseHUD);
