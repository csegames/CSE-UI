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
import { SimpleRect } from '../redux/dragAndDropSlice';

// Styles
const ForceScalerClass = 'HUD-BaseWidget-ForceScaler';

interface ReactProps {
  widgetID: string;
}

interface InjectedProps {
  currentDraggableBounds: SimpleRect;
  widgets: Dictionary<HUDWidget>;
  uiScale: number;
}

type Props = ReactProps & InjectedProps;

/**
 * Only used when rendering a BaseHUDWidget in the middle of a drag.  Manually resizes the contents to match
 * the scaling of the source widget.
 */
class ForceScaler extends React.Component<Props> {
  render(): JSX.Element {
    const widget = this.props.widgets[this.props.widgetID];
    if (!widget) {
      return null;
    }

    // Match the source widget's on-screen size, which includes both its own scale and the global UI
    // scale. Omitting uiScale here makes the drag copy a different size than the widget being dragged.
    const effectiveScale = (widget.state.scale ?? 1) * this.props.uiScale;
    const originalWidth = this.props.currentDraggableBounds.width / effectiveScale;
    const originalHeight = this.props.currentDraggableBounds.height / effectiveScale;

    return (
      <div
        className={ForceScalerClass}
        style={{
          width: `${originalWidth}px`,
          height: `${originalHeight}px`,
          transform: `scale(${effectiveScale})`,
          marginLeft: `${(originalWidth * (effectiveScale - 1)) / 2}px`,
          marginTop: `${(originalHeight * (effectiveScale - 1)) / 2}px`
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { widgets, uiScale } = state.hud;
  const { currentDraggableBounds } = state.dragAndDrop;
  return {
    ...ownProps,
    currentDraggableBounds,
    widgets,
    uiScale
  };
}

export default connect(mapStateToProps)(ForceScaler);
