/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../shared/Button';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { game } from '@csegames/library/dist/_baseGame';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../helpers/stringTableHelpers';

const Container = 'Error-Container';
const BuildMismatchTitle = 'Error-BuildMismatchTitle';
const Message = 'Error-Message';

const ButtonStyle = 'Error-Button';

const StringIDBuildMismatchTitle = 'BuildMismatchTitle';
const StringIDBuildMismatchClientNewer = 'BuildMismatchClientNewer';
const StringIDBuildMismatchServerNewer = 'BuildMismatchServerNewer';
const StringIDBuildMismatchExit = 'BuildMismatchExit';

export interface ReactProps {
  serverIsNewer: boolean;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ABuildMismatchModal extends React.Component<Props> {
  private onClickOverlay() {
    // Unlike other modals, don't allow the user to close with an overlay click --
    // force the explicit exit button to ensure they understand they can't continue
    // and need to fix the mismatch problem.
  }

  private onExitClick() {
    game.quit();
  }

  public render() {
    const messageStringID = this.props.serverIsNewer ? StringIDBuildMismatchServerNewer : StringIDBuildMismatchClientNewer;
    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClickOverlay.bind(this)}>
        <div className={Container}>
          <div className={BuildMismatchTitle}>{getStringTableValue(StringIDBuildMismatchTitle, this.props.stringTable)}</div>
          <div className={Message}>{getStringTableValue(messageStringID, this.props.stringTable)}</div>
          <Button
            type='blue-outline'
            text={getStringTableValue(StringIDBuildMismatchExit, this.props.stringTable)}
            styles={ButtonStyle}
            onClick={this.onExitClick.bind(this)}
          />
        </div>
      </MiddleModalDisplay>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  return { ...ownProps, stringTable };
}

export const BuildMismatchModal = connect(mapStateToProps)(ABuildMismatchModal);
