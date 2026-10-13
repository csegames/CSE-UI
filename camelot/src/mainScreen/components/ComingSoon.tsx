/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { getStringTableValue, StringIDGeneralComingSoon } from '../helpers/stringTableHelpers';

const Root = 'HUD-ComingSoon-Root';
const Label = 'HUD-ComingSoon-Label';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  fontSizeOverride?: string;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AComingSoon extends React.Component<Props> {
  render(): React.ReactNode {
    const labelStyle: React.CSSProperties = this.props.fontSizeOverride
      ? { fontSize: this.props.fontSizeOverride }
      : {};

    return (
      <div className={Root}>
        <div className={Label} style={labelStyle}>
          {getStringTableValue(StringIDGeneralComingSoon, this.props.stringTable)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable
  };
};

export const ComingSoon = connect(mapStateToProps)(AComingSoon);
