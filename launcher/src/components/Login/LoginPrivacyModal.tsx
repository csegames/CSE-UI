/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { GenericButton } from '../GenericButton';
import { LoginLink } from './LoginLink';
import { PatcherModal } from '../PatcherModal';

const Container = 'Controller-Login-LoginPrivacyModal-Container';
const Modal = 'Controller-Login-LoginPrivacyModal-Modal';
const ModalHeader = 'Controller-Login-LoginPrivacyModal-ModalHeader';
const ModalText = 'Controller-Login-LoginPrivacyModal-ModalText';
const Section = 'Controller-Login-LoginPrivacyModal-Section';

interface ReactProps {
  onClick: () => void;
}

export class LoginPrivacyModal extends React.Component<ReactProps> {
  render() {
    return (
      <div className={Container}>
        <PatcherModal>
          <div className={Modal}>
            <div className={ModalHeader}>{'Login Failed: Privacy Policy'}</div>
            <div className={ModalText}>
              <div className={Section}>
                {
                  'Our privacy policy has changed. In order to access the game, you must accept these changes on the CSE account webpage'
                }
                <LoginLink underline href='https://api.citystateentertainment.com/Account'>
                  {'https://api.citystateentertainment.com/Account.'}
                </LoginLink>
              </div>

              <div className={Section}>
                {'Please, go to the account webpage and accept the changes before attempting to log in again.'}
              </div>

              <div className={Section}>
                {
                  "If you would like to edit your privacy settings, go to the account page. Under the Privacy Policy section, there is a 'Privacy Settings' link. Click on it and follow the directions."
                }
              </div>

              <div className={Section}>
                {
                  "You can also edit your privacy settings by clicking 'Edit Account Details'. Then click 'Privacy Settings'."
                }
              </div>
            </div>
            <GenericButton text={'OK'} onClick={this.props.onClick} />
          </div>
        </PatcherModal>
      </div>
    );
  }
}
