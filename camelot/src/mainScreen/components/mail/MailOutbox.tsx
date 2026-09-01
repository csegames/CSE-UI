/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from '../../helpers/stringTableHelpers';

// CSS classes
const PageContainer = 'HUD-Mail-PageContainer';

// String IDs
const StringIDMenuComingSoon = 'MenuComingSoon';

interface ReactProps {}

interface InjectedProps {
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AMailOutbox extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={PageContainer}>
        <div
          style={{
            color: 'white',
            fontSize: '5rem',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {getStringTableValue(StringIDMenuComingSoon, this.props.stringTable)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable
  };
};

export const MailOutbox = connect(mapStateToProps)(AMailOutbox);
