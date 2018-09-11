/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

import GenericButton from '../../../../GenericButton';
import LoginLink from './LoginLink';
import PatcherModal from '../../../../PatcherModal';

const Container = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const Modal = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const ModalHeader = styled('div')`
  font-family: Caudex;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 24px;
  color: #ffd9d4;
  margin: 0 15px 15px 15px;
`;

const ModalText = styled('div')`
  font-family: Titillium;
  color: #ffd9d4;
  font-size: 16px;
  text-align: left;
  margin: 0 15px 10px 15px;
`;

const Section = styled('div')`
  margin-bottom: 10px;
`;

export interface LoginPrivacyModalProps {
  onClick: () => void;
}

class LoginPrivacyModal extends React.Component<LoginPrivacyModalProps> {
  public render() {
    return (
      <Container>
        <PatcherModal
          accentColor='rgb(255,95,76)'
          highlightColorStrong='rgba(255, 95, 76, 0.7)'
          highlightColorWeak='rgba(255, 95, 76, 0.1)'
        >
          <Modal>
            <ModalHeader>Login Failed: Privacy Policy</ModalHeader>
            <ModalText>
              <Section>
                Our privacy policy has changed. In order to access the game, you must accept these changes on the
                CSE account webpage
                <LoginLink underline href='https://api.citystateentertainment.com/Account'>
                  https://api.citystateentertainment.com/Account.
                </LoginLink>
              </Section>

              <Section>
                Please, go to the account webpage and accept the changes before attempting to log in again.
              </Section>

              <Section>
                If you would like to edit your privacy settings, go to the account page.
                Under the Privacy Policy section, there is a 'Privacy Settings' link. Click on it and follow the directions.
              </Section>

              <Section>
                You can also edit your privacy settings by clicking 'Edit Account Details'. Then click 'Privacy Settings'.
              </Section>
            </ModalText>
            <GenericButton text='OK' onClick={this.props.onClick} />
          </Modal>
        </PatcherModal>
      </Container>
    );
  }
}

export default LoginPrivacyModal;
