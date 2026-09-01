/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { RootState } from '../redux/store';
import { connect } from 'react-redux';

import UCELogin from '../images/uce/login-uce.jpg';

const Root = 'ToolsHero-Root';
const Content = 'ToolsHero-Content';
const Logo = 'ToolsHero-Logo';

interface ReactProps {}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class AToolsHero extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <div className={Root}>
        <div className={Content}>
          <img className={Logo} src={UCELogin} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const ToolsHero = connect(mapStateToProps)(AToolsHero);
