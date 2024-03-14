/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { addOrUpdateEscapable, removeEscapable } from '../redux/hudSlice';
import { RootState } from '../redux/store';

interface ReactProps {
  escapeID: string;
  onEscape: (dispatch: Dispatch) => void;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class Escapable extends React.Component<Props> {
  public render(): React.ReactNode {
    // Render something that technically exists instead of null so it persists in the view hierarchy.
    return <></>;
  }

  componentDidMount(): void {
    // Register with Redux.
    this.props.dispatch(
      addOrUpdateEscapable({ id: this.props.escapeID, onEscape: this.props.onEscape.bind(this, this.props.dispatch) })
    );
  }

  componentWillUnmount(): void {
    //  Unregister with Redux.
    this.props.dispatch(removeEscapable(this.props.escapeID));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps
  };
}

export default connect(mapStateToProps)(Escapable);
