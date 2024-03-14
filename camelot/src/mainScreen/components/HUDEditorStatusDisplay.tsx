/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AbilityEditStatus } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import EditUnlocked from '../../images/hudeditor/edit-unlocked.png';
import EditChanging from '../../images/hudeditor/edit-changing.png';

// Styles
const Root = 'HUDEditorStatus-Root';
const Icon = 'HUDEditorStatus-Icon';

interface ReactProps {}

interface InjectedProps {
  editStatus: AbilityEditStatus;
  dispatch?: Dispatch;
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
        {canEdit && requestedCanEdit ? <img className={Icon} src={EditUnlocked} /> : null}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { editStatus } = state.abilities;
  return {
    ...ownProps,
    editStatus
  };
}

export const HUDEditorStatusDisplay = connect(mapStateToProps)(AHUDEditorStatusDisplay);
