/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { AbilityInfo } from './AbilityInfo';
import { LeftOptions } from './LeftOptions';
import { RightOptions } from './RightOptions';
import { Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';

const Container = 'MenuModal-Container';
const LeftContainer = 'MenuModal-LeftContainer';
const RightContainer = 'MenuModal-RightContainer';
const LeftContentBackground = 'MenuModal-LeftContentBackground';
const RightContentBackground = 'MenuModal-RightContentBackground';

const ContentContainer = 'MenuModal-ContentContainer';

interface ReactProps {
  dispatch?: Dispatch;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class AMainMenuModal extends React.Component<Props> {
  public render() {
    return (
      <div className={Container}>
        <div id='MainMenu_LeftModalContainer' className={LeftContainer}>
          <div id='MainMenu_LeftModalContentBackground' className={LeftContentBackground}>
            <div id='MainMenu_LeftModalContentContainer' className={ContentContainer}>
              <LeftOptions />
            </div>
          </div>
        </div>
        <AbilityInfo />
        <div id='RightModalContainer' className={RightContainer}>
          <div id='RightModalContentBackground' className={RightContentBackground}>
            <div id='RightModalContentContainer' className={ContentContainer}>
              <RightOptions />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps
  };
}

export const MainMenuModal = connect(mapStateToProps)(AMainMenuModal);
