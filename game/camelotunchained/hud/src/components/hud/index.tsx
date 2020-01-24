/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { styled } from '@csegames/linaria/react';
import { ErrorBoundary } from 'cseshared/components/ErrorBoundary';
// import { hot, setConfig } from 'react-hot-loader';

import DragStore from 'utils/DragAndDrop/DragStore';
import {
  LayoutState,
  setPosition,
  initialize,
  setVisibility,
  Widget,
} from '../../services/session/layout';
import { InvitesState, initializeInvites } from '../../services/session/invites';
import { SessionState } from '../../services/session/reducer';
import HUDDrag, { HUDDragState, HUDDragOptions } from 'utils/HUDDrag';
import Watermark from 'hud/Watermark';
import { LoadingScreen } from 'fullscreen/LoadingScreen';
import { OfflineZoneSelect } from 'hud/OfflineZoneSelect';
import HUDFullScreen from '../fullscreen';
import AbilityBar from 'hud/AbilityBar';
import ScenarioPopup from 'hud/ScenarioPopup';
import ScenarioResults from 'hud/ScenarioResults';
import { Settings } from 'cseshared/components/Settings';
import HUDEditor from 'hud/HUDEditor';

// import TestButtons from '../BattleGroups/components/TestButtons'

import { ZoneName } from 'hud/ZoneName';

// TEMP -- Disable this being movable/editable
import HUDNav from '../../services/session/layoutItems/HUDNav';
import Console from 'hud/Console';
import { InteractiveAlertView } from 'hud/InteractiveAlert';
import { ContextMenuView } from '../shared/ContextMenu';
import { TooltipView } from '../shared/Tooltip';
import { PopupView } from '../shared/Popup';
import PassiveAlert from 'hud/PassiveAlert';
import { ActionAlert } from 'hud/ActionAlert';
import { Chat } from 'hud/Chat';
import { ImagePreloader } from './ImagePreloader';
import { MiniScenarioScoreboard } from 'hud/LiveScenarioScoreboard/MiniScenarioScoreboard';
import { FullScenarioScoreboard } from 'hud/LiveScenarioScoreboard/FullScenarioScoreboard';
import { uiContextFromGame } from 'services/session/UIContext';
import { DevUI } from '../shared/DevUI';
import HUDZOrder from 'services/session/HUDZOrder';

// import { ActionBars } from '../ActionBar/BarsView';
import { DragAndDropV2Renderer } from 'utils/DragAndDropV2';
import { WarbandNotificationProvider } from 'hud/WarbandDisplay/WarbandNotificationProvider';
import { BattleGroupNotificationProvider } from 'hud/BattleGroups/BattleGroupNotificationProvider';

import { DynamicModal } from 'utils/DynamicModal';

const HUDNavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 900px;
  height: 200px;
  pointer-events: none;
  z-index: 999;
`;

const ZoneNameContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 0;
`;

const AbilityBarContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 10px;
  margin: 0 auto;
  pointer-events: none;
`;

const MiniScenarioScoreboardContainer = styled.div`
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  z-index: ${HUDZOrder.MiniScenarioScoreboard};
`;

const FullScenarioScoreboardContainer = styled.div`
  position: fixed;
  top: 200px;
  left: 0;
  right: 0;
  margin: 0 auto;
  pointer-events: none;
  display: flex;
  justify-content: center;
  z-index: ${HUDZOrder.FullScenarioScoreboard};
`;

// This is a hack to fix a Coherent bug where if there are svg-blur elements in the DOM that get taken out,
// the UI starts to have rendering issues. This just makes sure there is always a svg-blur element in the DOM.
const SVGBlurHack = styled.div`
  position: fixed;
  pointer-events: none;
  filter: url(#svg-blur);
`;


interface HUDWidget<T = any> {
  widget: Widget<T>;
  name: string;
}

export interface HUDProps {
  dispatch: (action: any) => void;
  layout: LayoutState;
  invites: InvitesState;
  data?: any;
}

export interface HUDState {
  selectedWidget: HUDWidget | null;
  uiContext: UIContext;
}

class HUDViewInternal extends React.Component<HUDProps, HUDState> {
  constructor(props: HUDProps) {
    super(props);
    this.state = {
      selectedWidget: null,
      uiContext: uiContextFromGame(),
    };
  }

  public render() {
    const widgets = this.props.layout.widgets.map((widget, name) => ({ widget, name })).toArray();
    const locked = this.props.layout.locked;
    const renderWidgets = widgets
                    .sort((a, b) => a.widget.position.zOrder - b.widget.position.zOrder)
                    .map((w, idx) =>
                      this.draggable(w.name, w.widget, w.widget.component, w.widget.dragOptions, w.widget.props));
    return (
      <UIContext.Provider value={this.state.uiContext}>
        <div className='HUD' style={locked ? {} : { backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          <SVGBlurHack />
          {renderWidgets}
          <ImagePreloader />
          <ZoneNameContainer>
            <ZoneName />
          </ZoneNameContainer>
          <Console />

          <HUDNavContainer id='hudnav'>
            <HUDNav.component {...HUDNav.props} />
          </HUDNavContainer>

          <DevUI />
          <InteractiveAlertView />
          <ScenarioPopup />

          <ScenarioResults />

          <HUDFullScreen />
          <AbilityBarContainer id='abilitybar-old'>
            <AbilityBar />
          </AbilityBarContainer>
          <ContextMenuView />

          <MiniScenarioScoreboardContainer id='miniscenarioscoreboard'>
            <MiniScenarioScoreboard />
          </MiniScenarioScoreboardContainer>
          <FullScenarioScoreboardContainer id='scenarioscoreboard'>
            <FullScenarioScoreboard />
          </FullScenarioScoreboardContainer>

          <Chat />
          <PopupView />
          <TooltipView />
          <ActionAlert />
          <PassiveAlert />
          { locked ? null :
            <HUDEditor
              widgets={widgets}
              selectedWidget={ this.state.selectedWidget ? this.state.selectedWidget : null }
              dispatch={this.props.dispatch}
              setSelectedWidget={this.setSelectedWidget}
            />
          }

          {/* <ActionBars /> */}

          <Settings />

          <DynamicModal />

          {/* END HUD */}

          <Watermark />
          <OfflineZoneSelect />

          <LoadingScreen />
          <DragStore />
          <DragAndDropV2Renderer />

          {/* GraphQL Subscription providers */}
          <WarbandNotificationProvider />
          <BattleGroupNotificationProvider />

        </div>
      </UIContext.Provider>
    );
  }

  public componentDidMount() {
    // Always load MOTD
    this.setVisibility('motd', true);

    this.props.dispatch(initialize());
    this.props.dispatch(initializeInvites());

    window.addEventListener('optimizedResize', this.onWindowResize);
  }

  public componentWillUnmount() {
    window.removeEventListener('optimizedResize', this.onWindowResize);
  }

  public componentWillReceiveProps(props: HUDProps) {
    if (!this.props.data && !props.data) return;
    if (!this.props.data ||
        (props.data && props.data.myOrder && props.data.myOrder.name !==
        (this.props.data && this.props.data.myOrder && this.props.data.myOrder.name))) {

      if (this.props.data && this.props.data.myOrder) game.trigger('chat-leave-room', this.props.data.myOrder.name);

      // we either are just loading up, or we've changed order.
      if (props.data.myOrder && props.data.myOrder.id) {
        // we left our order, leave chat room
        game.trigger('chat-show-room', props.data.myOrder.name);
      }
    }
  }

  private onWindowResize = () => {
    // update UIContext resolution on resize.
    this.setState((state) => {
      return {
        ...state,
        uiContext: {
          ...state.uiContext,
          resolution: {
            width: window.innerWidth,
            height: window.innerWidth,
          },
        },
      };
    });
  }

  private setSelectedWidget = (selectedWidget: HUDWidget) => {
    this.setState({ selectedWidget });
  }

  private setVisibility = (widgetName: string, vis: boolean) => {
    this.props.dispatch(setVisibility({ name: widgetName, visibility: vis }));
  }

  private draggable = (type: string, widget: Widget<any>, Widget: any, options?: HUDDragOptions, widgetProps?: any) => {
    let props = widgetProps;
    if (typeof props === 'function') {
      props = props();
    }
    const isUHD = this.state.uiContext.isUHD();
    const size = isUHD && widget.position.sizeUHD ? widget.position.sizeUHD : widget.position.size;
    const posX = isUHD && widget.position.xUHD ? widget.position.xUHD : widget.position.x;
    const posY = isUHD && widget.position.yUHD ? widget.position.yUHD : widget.position.y;

    return (
      <ErrorBoundary key={`${widget.position.zOrder}-${type}`}>
        <HUDDrag
          name={type}
          defaultHeight={size.height}
          defaultWidth={size.width}
          defaultScale={widget.position.scale}
          defaultX={posX.offset}
          defaultY={posY.offset}
          defaultXAnchor={posX.anchor}
          defaultYAnchor={posY.anchor}
          defaultOpacity={widget.position.opacity}
          defaultMode={widget.position.layoutMode}
          defaultVisible={widget.position.visibility}
          zOrder={widget.position.zOrder}
          gridDivisions={10}
          locked={this.props.layout.locked}
          selected={this.state.selectedWidget && this.state.selectedWidget.name === type}
          save={(s: HUDDragState) => {
            this.props.dispatch(setPosition({
              name: type,
              widget,
              position: this.getStatePosition(s, widget),
            }));
          }}
          render={() => {
            if (this.props.layout.locked && !widget.position.visibility) return null;
            return <Widget
              setVisibility={(vis: boolean) => this.props.dispatch(setVisibility({ name: type, visibility: vis }))}
              {...props}
            />;
          }}
          {...options}
        />
      </ErrorBoundary>
    );
  }

  private getStatePosition = (s: HUDDragState, widget: Widget<any>) => {
    const isUHD = this.state.uiContext.isUHD();

    const pos = widget.position;
    if (isUHD && pos.sizeUHD && pos.xUHD && pos.yUHD) {
      return {
        x: { anchor: s.xAnchor, offset: s.x },
        y: { anchor: s.yAnchor, offset: s.y },
        xUHD: { anchor: s.xAnchor, offset: s.x },
        yUHD: { anchor: s.yAnchor, offset: s.y },
        sizeUHD: pos.sizeUHD,
        size: pos.size,
        scale: s.scale,
        opacity: s.opacity,
        visibility: s.visible,
        zOrder: widget.position.zOrder,
        layoutMode: widget.position.layoutMode,
      };
    }

    // Once we move a widget that's not UHD, we don't need to save the xUHD and yUHD positions since
    // they're only used for the default position of the widget.
    return {
      x: { anchor: s.xAnchor, offset: s.x },
      y: { anchor: s.yAnchor, offset: s.y },
      size: { width: s.width, height: s.height },
      sizeUHD: pos.sizeUHD,
      scale: s.scale,
      opacity: s.opacity,
      visibility: s.visible,
      zOrder: widget.position.zOrder,
      layoutMode: widget.position.layoutMode,
    };
  }

}

function select(state: SessionState) {
  return {
    layout: state.layout,
    invites: state.invites,
  };
}

// setConfig({ pureSFC: true });
// export default hot(module)(connect(select)(HUD));
export const HUDView = connect(select)(HUDViewInternal);
