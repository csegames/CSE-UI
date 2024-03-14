/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDHorizontalAnchor, HUDVerticalAnchor, HUDWidget } from '../redux/hudSlice';
import { RootState } from '../redux/store';

interface ReactProps {}

interface InjectedProps {
  currentDraggableBounds: DOMRect;
  selectedWidgetID: string;
  widgets: Dictionary<HUDWidget>;
  dragDelta: [number, number];
  hudWidth: number;
  hudHeight: number;
}

type Props = ReactProps & InjectedProps;

class HUDAnchorChain extends React.Component<Props> {
  render(): React.ReactNode {
    if (this.props.selectedWidgetID && this.props.currentDraggableBounds) {
      const widget = this.props.widgets[this.props.selectedWidgetID];
      const left = this.props.currentDraggableBounds.left + this.props.dragDelta[0];
      const right = this.props.currentDraggableBounds.right + this.props.dragDelta[0];
      const top = this.props.currentDraggableBounds.top + this.props.dragDelta[1];
      const bottom = this.props.currentDraggableBounds.bottom + this.props.dragDelta[1];
      const halfWidgetWidth = this.props.currentDraggableBounds.width / 2;
      const halfWidgetHeight = this.props.currentDraggableBounds.height / 2;

      let x1: number = 0;
      let y1: number = 0;
      let x2: number = 100;
      let y2: number = 100;

      const t = widget.state.yAnchor === HUDVerticalAnchor.Top;
      const m = widget.state.yAnchor === HUDVerticalAnchor.Center;
      const b = widget.state.yAnchor === HUDVerticalAnchor.Bottom;
      const l = widget.state.xAnchor === HUDHorizontalAnchor.Left;
      const c = widget.state.xAnchor === HUDHorizontalAnchor.Center;
      const r = widget.state.xAnchor === HUDHorizontalAnchor.Right;
      if (t && l) {
        x1 = 0;
        y1 = 0;
        x2 = left;
        y2 = top;
      } else if (t && c) {
        x1 = this.props.hudWidth / 2;
        y1 = 0;
        x2 = left + halfWidgetWidth;
        y2 = top;
      } else if (t && r) {
        x1 = this.props.hudWidth;
        y1 = 0;
        x2 = right;
        y2 = top;
      } else if (m && l) {
        x1 = 0;
        y1 = this.props.hudHeight / 2;
        x2 = left;
        y2 = top + halfWidgetHeight;
      } else if (m && c) {
        x1 = this.props.hudWidth / 2;
        y1 = this.props.hudHeight / 2;
        x2 = left + halfWidgetWidth;
        y2 = top + halfWidgetHeight;
      } else if (m && r) {
        x1 = this.props.hudWidth;
        y1 = this.props.hudHeight / 2;
        x2 = right;
        y2 = top + halfWidgetHeight;
      } else if (b && l) {
        x1 = 0;
        y1 = this.props.hudHeight;
        x2 = left;
        y2 = bottom;
      } else if (b && c) {
        x1 = this.props.hudWidth / 2;
        y1 = this.props.hudHeight;
        x2 = left + halfWidgetWidth;
        y2 = bottom;
      } else if (b && r) {
        x1 = this.props.hudWidth;
        y1 = this.props.hudHeight;
        x2 = right;
        y2 = bottom;
      }

      return (
        <svg
          style={{
            // This SVG is technically a child of the overlay in BaseHUDWidget.renderOverlay(), but it has to match
            // the full HUD size so we can easily calculate line coordinates.
            position: 'absolute',
            top: -top,
            left: -left,
            width: this.props.hudWidth,
            height: this.props.hudHeight
          }}
        >
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={'orangered'} strokeWidth={'3px'} strokeDasharray={'6 3'} />
        </svg>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { widgets, hudWidth, hudHeight } = state.hud;
  const { selectedWidgetId: selectedWidgetID } = state.hud.editor;
  const { currentDraggableBounds, dragDelta } = state.dragAndDrop;
  return {
    ...ownProps,
    currentDraggableBounds,
    selectedWidgetID,
    widgets,
    dragDelta,
    hudWidth,
    hudHeight
  };
}

export default connect(mapStateToProps)(HUDAnchorChain);
