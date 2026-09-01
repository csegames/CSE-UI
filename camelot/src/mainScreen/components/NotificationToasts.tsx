/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../redux/store';
import { hideToaster, ToasterModel, ToasterParams } from '../redux/toastersSlice';
import { BorderBackground, BorderType, FactionBorder } from './FactionBorder';
import { FactionTitle } from './FactionTitle';
import { getFactionData } from '../gameData/factionData';
import { MoneyDisplay } from '../../shared/components/MoneyDisplay';
import { getStringTableValue, StringIDGeneralPlus } from '../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { HUDLayer, HUDWidgetRegistration } from '../redux/hudSlice';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';

const TOAST_EXIT_DURATION_MILLIS = 500;
const NOTIFICATION_TOAST_DEFAULT_DURATION_MILLIS = 5000;
// Gap after one toast has fully disappeared before the next queued toast begins its entrance.
const TOAST_PAUSE_DURATION_MILLIS = 1000;
// Also determines the banner's min-width (2.4x height, from FactionTitle). This height keeps that
// at 18vmin, matching the toast frame's min-width, so the banner never overflows and off-centers.
const EYEBROW_BANNER_HEIGHT_VMIN = 7.5;

// CSS classes
const Root = 'HUD-NotificationToasts-Root';
const ToastWrapper = 'HUD-NotificationToasts-ToastWrapper';
const ToastRoot = 'HUD-NotificationToasts-ToastRoot';
const IconWrapper = 'HUD-NotificationToasts-IconWrapper';
const Icon = 'HUD-NotificationToasts-Icon';
const Details = 'HUD-NotificationToasts-Details';
const Banner = 'HUD-NotificationToasts-Banner';
const Category = 'HUD-NotificationToasts-Category';
const TitleRow = 'HUD-NotificationToasts-TitleRow';
const TitleIconContainer = 'HUD-NotificationToasts-TitleIconContainer';
const TitleIcon = 'HUD-NotificationToasts-TitleIcon';
const Title = 'HUD-NotificationToasts-Title';
const Message = 'HUD-NotificationToasts-Message';
const RewardRow = 'HUD-NotificationToasts-RewardRow';
const RewardPlus = 'HUD-NotificationToasts-RewardPlus';
const RewardGold = 'HUD-NotificationToasts-RewardGold';
const RewardIconContainer = 'HUD-NotificationToasts-RewardIconContainer';
const RewardIcon = 'HUD-NotificationToasts-RewardIcon';
const RewardName = 'HUD-NotificationToasts-RewardName';

enum ToasterAnimStep {
  Show,
  Exit,
  Shrink
}

interface ToasterDisplayState {
  params: ToasterParams;
  animStep: ToasterAnimStep;
  height: number;
}

interface State {
  // These need to be pushed into the display queue one-by-one.
  pendingToasters: ToasterParams[];
  displayedToasters: ToasterDisplayState[];
}

type NotificationToastsVariant = 'quest' | 'level';

interface ReactProps {
  isDragCopy: boolean;
  variant: NotificationToastsVariant;
}

interface InjectedProps {
  queuedToasters: ToasterParams[];
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  isSelectedWidget: boolean;
  // Player-configured display duration from the HUD Editor; undefined means the default.
  toastDurationSeconds?: number;
}

type Props = ReactProps & InjectedProps;

class ANotificationToasts extends React.Component<Props & DispatchProp, State> {
  // Only one toast may be displayed (or animating out) at a time; blocks tryShowNextToast while
  // a toast is up, exiting, shrinking, or paused before the next one is allowed to appear.
  private isBusy: boolean = false;

  constructor(props: Props & DispatchProp) {
    super(props);

    this.state = {
      pendingToasters: [],
      displayedToasters: []
    };
  }

  public render(): React.ReactNode {
    // The stack is usually empty, so the HUD Editor gets a static sample toast to select and drag.
    const showPlaceholder =
      this.state.displayedToasters.length === 0 && (this.props.isDragCopy || this.props.isSelectedWidget);
    return (
      <div className={Root}>
        {this.state.displayedToasters.map(this.renderToast.bind(this))}
        {showPlaceholder && this.renderToast(this.getPlaceholderToast())}
      </div>
    );
  }

  private getPlaceholderToast(): ToasterDisplayState {
    const content: ToasterModel =
      this.props.variant === 'quest'
        ? {
            eyebrow: 'Quest Completed',
            category: 'Basic Training',
            titleIconURL: getFactionData(this.props.uiFactionID).iconTutorialImage,
            title: 'Kill 3 Enemies',
            rewards: [{ name: 'Gold', amount: 30, isGold: true }],
            isSmall: true
          }
        : {
            eyebrow: 'Level Up',
            titleIconURL: getFactionData(this.props.uiFactionID).iconTutorialImage,
            title: 'One-Handed Swords',
            message: 'Level 3',
            isSmall: true
          };
    return {
      params: {
        id: `NotificationToastsPlaceholder-${this.props.variant}`,
        content
      },
      animStep: ToasterAnimStep.Show,
      height: -1
    };
  }

  private renderToast(data: ToasterDisplayState): React.ReactNode {
    // Kept through the Shrink step, or CSS replays the entry fade.
    const exitingClass = data.animStep !== ToasterAnimStep.Show ? ' exiting' : '';
    const shrinkStyle: React.CSSProperties =
      data.animStep === ToasterAnimStep.Shrink
        ? // If we're shrinking, animate the height from full to zero.  Should already be faded out, so zero opacity for good measure.
          { height: '0px', opacity: '0' }
        : // Otherwise, either don't set the height (so we can calculate native height), or use the native height explicitly.
          { height: data.height > 0 ? `${data.height}px` : undefined };

    if (typeof data.params.content === 'function') {
      return (
        <div className={`${ToastWrapper}${exitingClass}`} key={data.params.id} style={shrinkStyle}>
          {data.params.content()}
        </div>
      );
    } else {
      const smallClass = data.params.content.isSmall ? ' small' : '';
      const factionData = getFactionData(this.props.uiFactionID);
      // The eyebrow is displayed in a faction header banner straddling the toast's top edge.
      const hasHeader = (data.params.content.eyebrow?.length ?? 0) > 0;
      const headerClass = hasHeader ? ' withHeader' : '';
      return (
        <div
          className={`${ToastWrapper}${exitingClass}${headerClass}`}
          key={data.params.id}
          ref={this.recordToastHeight.bind(this, data)}
          style={shrinkStyle}
        >
          <FactionBorder
            className={`${ToastRoot}${headerClass}`}
            type={BorderType.Secondary}
            background={BorderBackground.PatternSmall}
          >
            {hasHeader && (
              <FactionTitle
                className={Banner}
                heightOverrideVmin={EYEBROW_BANNER_HEIGHT_VMIN}
                fontSizeOverrideRem={0.85}
              >
                {data.params.content.eyebrow}
              </FactionTitle>
            )}
            <div className={Details}>
              {(data.params.content.category?.length ?? 0) > 0 && (
                <div
                  className={`${Category}${smallClass}`}
                  style={{ color: factionData.mailSenderColor }}
                >
                  {data.params.content.category}
                </div>
              )}
              {(data.params.content.title?.length ?? 0) > 0 && (
                <div className={TitleRow}>
                  {(data.params.content.titleIconURL?.length ?? 0) > 0 && (
                    <FactionBorder
                      className={TitleIconContainer}
                      type={BorderType.Secondary}
                      background={BorderBackground.PatternSmall}
                    >
                      <img className={TitleIcon} src={data.params.content.titleIconURL} />
                    </FactionBorder>
                  )}
                  <div className={`${Title}${smallClass}`}>{data.params.content.title}</div>
                </div>
              )}
              {(data.params.content.message?.length ?? 0) > 0 && (
                <div className={`${Message}${smallClass}`}>{data.params.content.message}</div>
              )}
              {data.params.content.rewards?.map((reward, index) => (
                <div className={RewardRow} key={index}>
                  <div
                    className={RewardPlus}
                    style={{ color: factionData.mailSenderColor }}
                  >
                    {getStringTableValue(StringIDGeneralPlus, this.props.stringTable)}
                  </div>
                  {reward.isGold ? (
                    <MoneyDisplay className={RewardGold} amount={reward.amount} sizeOverrideVmin={1.5} />
                  ) : (
                    <>
                      {(reward.iconUrl?.length ?? 0) > 0 && (
                        <FactionBorder
                          className={RewardIconContainer}
                          type={BorderType.Secondary}
                          background={BorderBackground.PatternSmall}
                        >
                          <img className={RewardIcon} src={reward.iconUrl} />
                        </FactionBorder>
                      )}
                      <div className={RewardName}>
                        {`${reward.amount > 1 ? `${reward.amount}x ` : ''}${reward.name}`}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {(data.params.content.iconURL?.length ?? 0) > 0 && (
              <FactionBorder
                className={`${IconWrapper}${smallClass}`}
                type={data.params.content.isSmall ? BorderType.Secondary : BorderType.Primary}
                background={BorderBackground.PatternSmall}
              >
                <img className={Icon} src={data.params.content.iconURL} />
              </FactionBorder>
            )}
          </FactionBorder>
        </div>
      );
    }
  }

  private recordToastHeight(data: ToasterDisplayState, r: HTMLDivElement): void {
    if (r && r.offsetHeight > 0 && data.height < 0) {
      const updatedToasters = [...this.state.displayedToasters];
      const entry = updatedToasters.find((d) => d.params.id === data.params.id);
      // The editor's placeholder toast is not part of the display queue, so it has no entry to record.
      if (!entry) {
        return;
      }
      entry.height = r.offsetHeight;
      this.setState({ displayedToasters: updatedToasters });
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // If the list of toasters changes, we will need to add or remove some from state.
    if (this.props.queuedToasters !== prevProps.queuedToasters) {
      // Any new toasters detected go directly into Pending.
      let newToasters = this.props.queuedToasters.filter((params) => {
        return (
          !this.state.pendingToasters.find((p) => p.id === params.id) &&
          !this.state.displayedToasters.find((data) => data.params.id === params.id)
        );
      });
      if (newToasters.length > 0) {
        this.setState({ pendingToasters: [...this.state.pendingToasters, ...newToasters] }, () => {
          this.tryShowNextToast();
        });
      }
    }
  }

  // Pulls the next pending toast onto screen, then chains through its Show -> Exit -> Shrink ->
  // removed lifecycle, and pauses before allowing the following toast to start.
  private tryShowNextToast(): void {
    if (this.isBusy || this.state.pendingToasters.length === 0) {
      return;
    }
    this.isBusy = true;

    // Toasts with an explicit duration (e.g. dev test commands) bypass the player's configured
    // duration; a configured duration of 0 suppresses toasts entirely.
    const nextToast = this.state.pendingToasters[0];
    const configuredDurationMillis =
      (this.props.toastDurationSeconds ?? NOTIFICATION_TOAST_DEFAULT_DURATION_MILLIS / 1000) * 1000;
    const durationMillis = nextToast.duration ?? configuredDurationMillis;

    this.setState({ pendingToasters: this.state.pendingToasters.slice(1) });

    if (durationMillis <= 0) {
      this.props.dispatch(hideToaster(nextToast.id));
      this.isBusy = false;
      this.tryShowNextToast();
      return;
    }

    const toastToDisplay: ToasterDisplayState = {
      params: nextToast,
      animStep: ToasterAnimStep.Show,
      height: -1
    };
    this.setState({ displayedToasters: [toastToDisplay] });

    // If this toast has a registered SoundEvent, fire it.
    if (toastToDisplay.params.soundEvent) {
      clientAPI.playGameSound(toastToDisplay.params.soundEvent);
    }

    // Set a timeout to animate the toast away.
    window.setTimeout(() => {
      // Set this specific toast to Exiting.
      const updatedToasters = [...this.state.displayedToasters];
      updatedToasters.find((data) => data.params.id === toastToDisplay.params.id).animStep = ToasterAnimStep.Exit;
      this.setState({
        displayedToasters: updatedToasters
      });
      window.setTimeout(() => {
        // After the exit animation completes, shrink its vertical space away.
        const updatedToasters = [...this.state.displayedToasters];
        updatedToasters.find((data) => data.params.id === toastToDisplay.params.id).animStep =
          ToasterAnimStep.Shrink;
        this.setState({
          displayedToasters: updatedToasters
        });
        window.setTimeout(() => {
          this.setState({ displayedToasters: [] });
          this.props.dispatch(hideToaster(toastToDisplay.params.id));

          // Pause before the next queued toast is allowed to begin its entrance.
          window.setTimeout(() => {
            this.isBusy = false;
            this.tryShowNextToast();
          }, TOAST_PAUSE_DURATION_MILLIS);
        }, TOAST_EXIT_DURATION_MILLIS);
      }, TOAST_EXIT_DURATION_MILLIS);
    }, durationMillis);
  }
}

// While the two notification widgets occupy the same HUD position (as they do by default), level
// toasts flow into the quest widget's stack so simultaneous toasts stack instead of overlapping.
// Dragging either widget elsewhere in the HUD Editor splits them into independent stacks.
function areNotificationWidgetsColocated(state: RootState): boolean {
  const quest = state.hud.widgets[WIDGET_ID_QUEST_NOTIFICATIONS]?.state;
  const level = state.hud.widgets[WIDGET_ID_LEVEL_NOTIFICATIONS]?.state;
  return (
    !!quest &&
    !!level &&
    quest.xAnchor === level.xAnchor &&
    quest.yAnchor === level.yAnchor &&
    quest.xOffset === level.xOffset &&
    quest.yOffset === level.yOffset
  );
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const isLevelVariant = ownProps.variant === 'level';
  const isColocated = areNotificationWidgetsColocated(state);

  let queuedToasters: ToasterParams[];
  if (isLevelVariant) {
    queuedToasters = isColocated ? [] : state.toasters.levelToasters;
  } else {
    queuedToasters = isColocated
      ? [...state.toasters.questToasters, ...state.toasters.levelToasters]
      : state.toasters.questToasters;
  }

  const widgetID = isLevelVariant ? WIDGET_ID_LEVEL_NOTIFICATIONS : WIDGET_ID_QUEST_NOTIFICATIONS;
  return {
    ...ownProps,
    queuedToasters,
    uiFactionID: state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable,
    isSelectedWidget: state.hud.editor.selectedWidgetID === widgetID,
    toastDurationSeconds: state.hud.widgets[widgetID]?.state?.toastDurationSeconds
  };
}

const NotificationToasts = connect(mapStateToProps)(ANotificationToasts);

export const WIDGET_ID_QUEST_NOTIFICATIONS = 'Quest Notifications';
export const questNotificationsRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_QUEST_NOTIFICATIONS,
  nameStringID: 'HUDEditorWidgetNameQuestNotifications',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 0,
    yOffset: 9,
    scale: 1.25
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  layerOffset: 1,
  render: (isDragCopy: boolean) => {
    return <NotificationToasts isDragCopy={isDragCopy} variant='quest' />;
  }
};

export const WIDGET_ID_LEVEL_NOTIFICATIONS = 'Level Notifications';
export const levelNotificationsRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_LEVEL_NOTIFICATIONS,
  nameStringID: 'HUDEditorWidgetNameLevelNotifications',
  defaults: {
    // Same default position as Quest Notifications; players can separate them in the HUD Editor.
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 0,
    yOffset: 9,
    scale: 1.25
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  layerOffset: 1,
  render: (isDragCopy: boolean) => {
    return <NotificationToasts isDragCopy={isDragCopy} variant='level' />;
  }
};
