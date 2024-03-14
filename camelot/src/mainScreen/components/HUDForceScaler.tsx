/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDWidget } from '../redux/hudSlice';
import { RootState } from '../redux/store';

// Styles
const ForceScalerClass = 'HUD-BaseWidget-ForceScaler';

interface ReactProps {}

interface InjectedProps {
  currentDraggableBounds: DOMRect;
  selectedWidgetID: string;
  widgets: Dictionary<HUDWidget>;
}

type Props = ReactProps & InjectedProps;

/**
 * Only used when rendering a BaseHUDWidget in the middle of a drag.  Manually resizes the contents to match
 * the scaling of the source widget.
 */
class ForceScaler extends React.Component<Props> {
  render(): JSX.Element {
    const widget = this.props.widgets[this.props.selectedWidgetID];
    const originalWidth = this.props.currentDraggableBounds.width / widget.state.scale;
    const originalHeight = this.props.currentDraggableBounds.height / widget.state.scale;
    return (
      <div
        className={ForceScalerClass}
        style={{ width: `${originalWidth}px`, height: `${originalHeight}px`, transform: `scale(${widget.state.scale})` }}
      >
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { widgets } = state.hud;
  const { selectedWidgetId: selectedWidgetID } = state.hud.editor;
  const { currentDraggableBounds } = state.dragAndDrop;
  return {
    ...ownProps,
    currentDraggableBounds,
    selectedWidgetID,
    widgets
  };
}

export default connect(mapStateToProps)(ForceScaler);
