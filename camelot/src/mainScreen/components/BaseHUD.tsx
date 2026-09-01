/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AnyEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import {
  EscapableParams,
  HUDLayer,
  HUDWidget,
  addConditionalWidgetExiting,
  initializeWidget,
  showConditionalWidget,
  toggleConditionalWidget,
  updateHUDSize,
  hideHUDEditor
} from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { onToggleUIEditMode } from '../helpers/hudEditModeHelpers';
import BaseHUDWidget from './BaseHUDWidget';
import ContextMenuPane from './ContextMenuPane';
import DragAndDropPane from './DragAndDropPane';
import { HUDEditor } from './HUDEditor';
import { SelectedWidgetGuide } from './SelectedWidgetGuide';
import { HUDEditorStatusDisplay } from './HUDEditorStatusDisplay';
import ModalPane from './ModalPane';
import { ServerOfflineModal } from './ServerOfflineModal';
import ToasterPane from './ToasterPane';
import TooltipPane from './TooltipPane';
import { WIDGET_ID_GAME_MENU } from './GameMenu';
import { WIDGET_ID_RESPAWN } from './Respawn';
import { WIDGET_ID_ABILITY_BOOK } from './abilityBook/AbilityBook';
import { ErrorNotice } from './ErrorNotice';
import { ErrorNotice as IErrorNotice, removeErrorNotice } from '../redux/errorNoticesSlice';
import { PopUpAnnouncement } from './PopUpAnnouncement';
import { PopUpAnnouncement as IPopUpAnnouncement, removePopUpAnnouncement } from '../redux/popUpAnnouncementsSlice';
import { CSETransition } from '../../shared/components/CSETransition';
import { LoadingTopic, ZONE_ID_NONE } from '../redux/loadingSlice';
import { ConnectionStatus } from '@csegames/library/dist/_baseGame/types/ConnectionStatus';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { CharacterManagement } from './characterManagement/CharacterManagement';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ItemActionTargetingData, updateItemActionTargeting } from '../redux/inventorySlice';

// Styles
const Root = 'MainScreen-Root';
const Filter = 'MainScreen-Filter';
const ErrorNotices = 'MainScreen-ErrorNotices';
const PopUpAnnouncements = 'MainScreen-PopUpAnnouncements';

interface ReactProps {}

interface InjectedProps {
  showMockData: boolean;
  widgets: Dictionary<HUDWidget>;
  activeConditionalWidgetIDs: string[];
  exitingConditionalWidgetIDs: string[];
  escapables: EscapableParams[];
  selectedWidgetID: string | null;
  selectedGroupMemberIDs: string[];
  initCompleted: boolean;
  friendlyTarget: AnyEntityStateModel | null;
  enemyTarget: AnyEntityStateModel | null;
  isBindingKey: boolean;
  isEditingHUD: boolean;
  isAlive: boolean;
  selfID: string | null;
  errorNotices: IErrorNotice[];
  popUpAnnouncements: IPopUpAnnouncement[];
  uninitializedTopics: LoadingTopic[];
  gameDefsLoaded: boolean;
  isMouseUpNeeded: boolean;
  connectionStatus: ConnectionStatus;
  zoneID: string;
  itemActionTargetingData: ItemActionTargetingData | null;
}

type Props = ReactProps & InjectedProps;

export class ABaseHUD extends React.Component<Props & DispatchProp> {
  private listeners: ListenerHandle[] = [];

  public render(): React.ReactNode {
    this.reportCurrentSize();
    const popUpAnnouncement = this.props.popUpAnnouncements[this.props.popUpAnnouncements.length - 1];
    return (
      this.props.initCompleted && (
        <div className={`${Root} ${this.props.isMouseUpNeeded ? 'mouseUpNeeded' : ''}`}>
          <HUDEditorStatusDisplay />
          <SelectedWidgetGuide />
          <div className={Filter} />
          {this.renderWidgetsForLayer(HUDLayer.Bottom)}
          {this.renderWidgetsForLayer(HUDLayer.HUD)}
          {this.renderWidgetsForLayer(HUDLayer.Menus)}
          {this.renderSelectedWidget()}

          {this.props.isEditingHUD && <HUDEditor />}

          {this.props.zoneID === ZONE_ID_NONE &&
            this.props.connectionStatus !== ConnectionStatus.Connected &&
            this.props.connectionStatus !== ConnectionStatus.Offline && <CharacterManagement />}

          {this.renderWidgetsForLayer(HUDLayer.Top)}

          <ToasterPane />
          <ModalPane />
          <ServerOfflineModal />
          <DragAndDropPane />
          <TooltipPane />
          <ContextMenuPane />

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
        </div>
      )
    );
  }

  private renderWidgetsForLayer(layer: HUDLayer): React.ReactNode {
    const layerWidgets = Object.values(this.props.widgets).filter((w: HUDWidget) => {
      if (!w.registration) {
        return false;
      }
      const isCorrectLayer = w.registration.layer === layer;
      const isSelectedWidget = w.registration.id === this.props.selectedWidgetID;
      const showConditionally =
        !w.registration.isConditional || this.props.activeConditionalWidgetIDs.includes(w.registration.id);

      // Selected widget gets rendered separately so we can always see it when in Edit Mode.
      return isCorrectLayer && showConditionally && !isSelectedWidget;
    });

    layerWidgets.sort((a, b) => {
      // Non-conditional widgets are sorted by layerOffset, with higher values rendered later (thus visible on top of lower values).
      let aScore = a.state.layerOffset ?? 0;
      let bScore = b.state.layerOffset ?? 0;

      if (a.registration && b.registration) {
        // Conditional widgets are rendered on top of non-conditional widgets, in the order they were shown.
        if (a.registration.isConditional !== b.registration.isConditional) {
          return a.registration.isConditional ? 1 : -1;
        }
        if (a.registration.isConditional) {
          aScore = this.props.activeConditionalWidgetIDs.indexOf(a.registration.id);
          if (this.props.exitingConditionalWidgetIDs.includes(a.registration.id)) {
            aScore = 100;
          }
          bScore = this.props.activeConditionalWidgetIDs.indexOf(b.registration.id);
          if (this.props.exitingConditionalWidgetIDs.includes(b.registration.id)) {
            bScore = 100;
          }
        }
      }
      return aScore - bScore;
    });

    return <>{layerWidgets.map(this.renderWidget.bind(this))}</>;
  }

  private renderWidget(widget: HUDWidget | undefined): React.ReactNode {
    if (!widget || !widget.registration) {
      return null;
    }
    if (widget.registration.requiresGameDefsLoaded && !this.props.gameDefsLoaded) {
      return null;
    }
    const widgetID = widget.registration.id;
    // Members of the actively-selected group are force-rendered while editing, even if hidden, so the
    // user can see and arrange every widget in the group.
    const isEditableGroupMember = this.props.isEditingHUD && this.props.selectedGroupMemberIDs.includes(widgetID);
    if (!widget.state.visible && !isEditableGroupMember) {
      return null;
    }
    return <BaseHUDWidget key={`HUDWidget.${widgetID}`} widgetID={widgetID}></BaseHUDWidget>;
  }

  private renderSelectedWidget(): React.ReactNode {
    const widget = this.props.widgets[this.props.selectedWidgetID ?? ''];

    return this.renderWidget(widget);
  }

  public componentDidMount(): void {
    // BaseHUD should never unmount, but we have seen some cases where it happens and thus things were
    // getting bound twice, so lets clear out any remnants.
    this.listeners.forEach((l) => l.close());
    this.listeners = [];

    // React doesn't inherently detect resizes in a way that triggers all of the updates we need,
    // so we listen at the window level, and anyone who cares can watch the size via Redux.
    const sizeFunc = this.reportCurrentSize.bind(this);
    window.addEventListener('resize', sizeFunc);
    this.listeners.push({ close: () => window.removeEventListener('resize', sizeFunc) });

    this.listeners.push(clientAPI.bindShowWidgetListener(this.onShowWidget.bind(this)));
    this.listeners.push(clientAPI.bindHideWidgetListener(this.onHideWidget.bind(this)));
    this.listeners.push(clientAPI.bindToggleWidgetListener(this.onToggleWidget.bind(this)));
    this.listeners.push(clientAPI.bindToggleHUDEditorListener(this.onToggleHUDEditor.bind(this)));
  }

  componentWillUnmount(): void {
    this.listeners.forEach((l) => l.close());
    this.listeners = [];
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    // Initialize widgets
    for (const widgetID of Object.keys(this.props.widgets)) {
      const widget = this.props.widgets[widgetID];
      if (
        widget.registration &&
        !widget.state.initialized &&
        (!widget.registration.requiresGameDefsLoaded || this.props.gameDefsLoaded) &&
        (!widget.registration.initTopics ||
          widget.registration.initTopics.every((topic) => !this.props.uninitializedTopics.includes(topic)))
      ) {
        this.props.dispatch(initializeWidget(widgetID));
      }
    }

    // Show respawn menu if the player died or logged in dead
    if (
      !this.props.isAlive &&
      this.props.selfID &&
      (prevProps.isAlive || !prevProps.selfID) &&
      !this.props.activeConditionalWidgetIDs.includes(WIDGET_ID_RESPAWN)
    ) {
      this.props.dispatch(toggleConditionalWidget(WIDGET_ID_RESPAWN));
    }
    // Hide respawn menu if the player became alive
    else if (
      this.props.isAlive &&
      this.props.selfID &&
      !prevProps.isAlive &&
      this.props.activeConditionalWidgetIDs.includes(WIDGET_ID_RESPAWN)
    ) {
      this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_RESPAWN));
    }
  }

  private reportCurrentSize(): void {
    if (window.innerWidth > 0) {
      this.props.dispatch(updateHUDSize([window.innerWidth, window.innerHeight]));
    }
  }

  private onEscapePressed(): void {
    if (!this.props.isBindingKey) {
      // If we are in HUD edit mode, escape should be prioritized to closing edit mode, as
      // the show/hide of individual widgets is under the HUDEditor's control at that time.
      if (this.props.isEditingHUD) {
        this.props.dispatch(hideHUDEditor());
        if (!this.props.activeConditionalWidgetIDs.includes(WIDGET_ID_ABILITY_BOOK)) {
          clientAPI.requestEditMode(false);
        }
      }
      // If we were in the middle of an item targeting action, cancel it.
      else if (this.props.itemActionTargetingData) {
        this.props.itemActionTargetingData.onTargetingCanceled?.();
        this.props.dispatch(updateItemActionTargeting(null));
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
        clientAPI.requestEnemyTarget('');
        clientAPI.requestFriendlyTarget('');
      } else if (!this.props.activeConditionalWidgetIDs.includes(WIDGET_ID_GAME_MENU)) {
        this.props.dispatch(toggleConditionalWidget(WIDGET_ID_GAME_MENU));
      }
    }
  }

  private onShowWidget(name: string): void {
    const widgetID = this.getWidgetIDForNativeID(name);
    if (!widgetID) {
      console.warn(`Received widget.show event for unknown widget '${name}'`);
      return;
    }
    if (!this.props.activeConditionalWidgetIDs.includes(widgetID)) {
      this.applyWidgetOpeningSideEffects(widgetID);
    }
    this.props.dispatch(showConditionalWidget(widgetID));
  }

  private onHideWidget(name: string): void {
    const widgetID = this.getWidgetIDForNativeID(name);
    if (!widgetID) {
      console.warn(`Received widget.hide event for unknown widget '${name}'`);
      return;
    }
    if (
      this.props.activeConditionalWidgetIDs.includes(widgetID) &&
      !this.props.exitingConditionalWidgetIDs.includes(widgetID)
    ) {
      this.applyWidgetClosingSideEffects(widgetID);
      this.props.dispatch(addConditionalWidgetExiting(widgetID));
    }
  }

  private onToggleWidget(name: string): void {
    const widgetID = this.getWidgetIDForNativeID(name);
    if (!widgetID) {
      console.warn(`Received widget.toggle event for unknown widget '${name}'`);
      return;
    }
    // The game menu toggle doubles as the Escape key, which prioritizes closing other UI first.
    if (widgetID === WIDGET_ID_GAME_MENU) {
      this.onEscapePressed();
      return;
    }
    if (this.props.activeConditionalWidgetIDs.includes(widgetID)) {
      this.applyWidgetClosingSideEffects(widgetID);
    } else {
      this.applyWidgetOpeningSideEffects(widgetID);
    }
    this.props.dispatch(toggleConditionalWidget(widgetID));
  }

  private getWidgetIDForNativeID(name: string): string | null {
    const widget = Object.values(this.props.widgets).find((w) => w.registration?.nativeWidgetID === name);
    return widget?.registration.id ?? null;
  }

  private applyWidgetOpeningSideEffects(widgetID: string): void {
    if (widgetID === WIDGET_ID_ABILITY_BOOK) {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_WINDOW_CLOSED);
      clientAPI.requestEditMode(true);
    }
  }

  private applyWidgetClosingSideEffects(widgetID: string): void {
    if (widgetID === WIDGET_ID_ABILITY_BOOK) {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_WINDOW_OPEN);
      if (!this.props.isEditingHUD) {
        clientAPI.requestEditMode(false);
      }
    }
  }

  private onToggleHUDEditor(): void {
    onToggleUIEditMode(this.props.isEditingHUD, this.props.activeConditionalWidgetIDs, this.props.dispatch);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { showMockData, widgets, escapables, isMouseUpNeeded } = state.hud;
  const { selectedWidgetID, selectedGroupMemberIDs } = state.hud.editor;
  const initCompleted = state.loading.initCompleted;
  const { friendlyTarget, enemyTarget, selfID } = state.entities;
  const { activeConditionalWidgetIDs, exitingConditionalWidgetIDs, isBindingKey } = state.hud;
  const { isAlive } = state.entities.self;
  const isEditingHUD = state.hud.isEditingHUD;
  const { errorNotices } = state.errorNotices;
  const { popUpAnnouncements } = state.popUpAnnouncements;
  const { connectionStatus, gameDefsLoaded, uninitializedTopics, zoneID } = state.loading;
  return {
    ...ownProps,
    showMockData,
    widgets,
    escapables,
    selectedWidgetID,
    selectedGroupMemberIDs,
    initCompleted,
    friendlyTarget,
    enemyTarget,
    activeConditionalWidgetIDs,
    exitingConditionalWidgetIDs,
    isBindingKey,
    isEditingHUD,
    isAlive,
    selfID,
    errorNotices,
    popUpAnnouncements,
    uninitializedTopics,
    gameDefsLoaded,
    isMouseUpNeeded,
    connectionStatus,
    zoneID,
    itemActionTargetingData: state.inventory.itemActionTargetingData
  };
}

export const BaseHUD = connect(mapStateToProps)(ABaseHUD);
