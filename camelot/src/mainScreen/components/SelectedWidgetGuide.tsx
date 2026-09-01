/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { SimpleRect } from '../redux/dragAndDropSlice';

const Line = 'HUD-WidgetGuide-Line';
const LineVertical = 'vertical';
const LineHorizontal = 'horizontal';

interface InjectedProps {
  isEditingHUD: boolean;
  guidesEnabled: boolean;
  selectedWidgetID: string | null;
  bounds: SimpleRect | null;
  dragDelta: [number, number];
  currentDraggableID: string | null;
}

// Vertical + horizontal guide lines through the center of the selected widget, shown while editing.
// While that widget is being dragged we offset by the (snapped) drag delta so the lines track it.
class ASelectedWidgetGuide extends React.Component<InjectedProps> {
  render(): React.ReactNode {
    const { isEditingHUD, guidesEnabled, selectedWidgetID, bounds } = this.props;
    if (!isEditingHUD || !guidesEnabled || !selectedWidgetID || !bounds) {
      return null;
    }
    const isDragging = this.props.currentDraggableID === selectedWidgetID;
    const dx = isDragging ? this.props.dragDelta[0] : 0;
    const dy = isDragging ? this.props.dragDelta[1] : 0;
    const centerX = bounds.x + bounds.width / 2 + dx;
    const centerY = bounds.y + bounds.height / 2 + dy;

    return (
      <>
        <div className={`${Line} ${LineVertical}`} style={{ left: centerX }} />
        <div className={`${Line} ${LineHorizontal}`} style={{ top: centerY }} />
      </>
    );
  }
}

function mapStateToProps(state: RootState): InjectedProps {
  return {
    isEditingHUD: state.hud.isEditingHUD,
    guidesEnabled: state.hud.editor.guidesEnabled,
    selectedWidgetID: state.hud.editor.selectedWidgetID,
    bounds: state.hud.editor.selectedWidgetBounds,
    dragDelta: state.dragAndDrop.dragDelta,
    currentDraggableID: state.dragAndDrop.currentDraggableID
  };
}

export const SelectedWidgetGuide = connect(mapStateToProps)(ASelectedWidgetGuide);
