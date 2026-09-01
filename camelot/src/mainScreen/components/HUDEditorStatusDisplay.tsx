/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AbilityEditStatus } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import * as React from 'react';
import { connect } from 'react-redux';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { RootState } from '../redux/store';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import EditChanging from '../../images/hudeditor/edit-changing.png';

// Styles
const Root = 'HUDEditorStatus-Root';
const Icon = 'HUDEditorStatus-Icon';
const Frame = 'HUDEditorStatus-Frame';
const InnerFrame = 'HUDEditorStatus-InnerFrame';
const CornerTL = 'HUDEditorStatus-CornerTL';
const CornerTR = 'HUDEditorStatus-CornerTR';
const CornerBL = 'HUDEditorStatus-CornerBL';
const CornerBR = 'HUDEditorStatus-CornerBR';
const FrameEdgeTop = 'HUDEditorStatus-FrameEdgeTop';
const FrameEdgeBottom = 'HUDEditorStatus-FrameEdgeBottom';
const FrameEdgeLeft = 'HUDEditorStatus-FrameEdgeLeft';
const FrameEdgeRight = 'HUDEditorStatus-FrameEdgeRight';
const FrameLine = 'HUDEditorStatus-FrameLine';
const FrameLabel = 'HUDEditorStatus-FrameLabel';

// String IDs
const StringIDHUDEditorTitle = 'HUDEditorTitle';

interface ReactProps {}

interface InjectedProps {
  editStatus: AbilityEditStatus;
  stringTable: Record<string, StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AHUDEditorStatusDisplay extends React.Component<Props> {
  public render(): React.ReactNode {
    const { canEdit, requestedCanEdit } = this.props.editStatus;

    // Render nothing if we're not in (or requesting to be in) edit mode.
    if (!canEdit && !requestedCanEdit) {
      return null;
    }

    return (
      <div className={Root}>
        {canEdit !== requestedCanEdit ? <img className={Icon} src={EditChanging} /> : null}
        {canEdit && requestedCanEdit ? this.renderEditFrame() : null}
      </div>
    );
  }

  private renderEditFrame(): React.ReactNode {
    const label = getStringTableValue(StringIDHUDEditorTitle, this.props.stringTable);
    return (
      <div className={Frame}>
        <div className={FrameEdgeTop}>
          <div className={FrameLine} />
          <div className={FrameLabel}>{label}</div>
          <div className={FrameLine} />
        </div>
        <div className={FrameEdgeRight}>
          <div className={FrameLine} />
          <div className={FrameLabel}>{label}</div>
          <div className={FrameLine} />
        </div>
        <div className={FrameEdgeBottom}>
          <div className={FrameLine} />
          <div className={FrameLabel}>{label}</div>
          <div className={FrameLine} />
        </div>
        <div className={FrameEdgeLeft}>
          <div className={FrameLine} />
          <div className={FrameLabel}>{label}</div>
          <div className={FrameLine} />
        </div>
        <div className={InnerFrame} />
        <div className={CornerTL} />
        <div className={CornerTR} />
        <div className={CornerBL} />
        <div className={CornerBR} />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { editStatus } = state.abilities;
  return {
    ...ownProps,
    editStatus,
    stringTable: state.stringTable.stringTable
  };
}

export const HUDEditorStatusDisplay = connect(mapStateToProps)(AHUDEditorStatusDisplay);
