/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CSS from 'lib/css-helper';
import { Binding } from '@csegames/camelot-unchained';
import { Modal } from 'UI/Modal';
import { Key } from '../../components/Key';
import { spacify } from '../../components/KeyBind';
import {
  ModalContainer,
  ModalButtonContainer,
  ModalButton,
  MODAL_ACCENT,
  MODAL_HIGHLIGHT_STRONG,
  MODAL_HIGHLIGHT_WEAK,
} from './styles';

const Bind = styled('span')`
  background-color: rgba(128,128,128,0.1);
  border: 1px solid rgba(128,128,128,0.1);
  margin: 2px 0 2px 3px;
  padding: 0 3px;
`;

const Clashed = styled('div')`
  width: 400px;
  height: 250px;
  padding: 20px;
  text-align: center;
`;

const ClashContent = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.DONT_GROW}
  ${CSS.HORIZONTALLY_CENTERED}
  min-height: 26px;
  margin-right: 5px;
  line-height: 26px;
  .clash-key {
    align-self: center;
    pointer-events: none;
  }
`;

export interface ClashKey extends Binding {
  name: string;
}

export interface Clash extends Binding {
  sameAs: ClashKey[];
  name: string;
}

export interface Props {
  clash: Clash;
  onResolveClash: (clash: Clash, resolved: boolean) => void;
}

class ClashModal extends React.Component<Props> {
  public render() {
    const { clash } = this.props;
    return (
      <ModalContainer>
        <Modal
          accentColor={MODAL_ACCENT}
          highlightColorStrong={MODAL_HIGHLIGHT_STRONG}
          highlightColorWeak={MODAL_HIGHLIGHT_WEAK}>
          <Clashed>
            <ClashContent>
              <Key className='clash-key'>{clash.boundKeyName}</Key> is already bound to
              <div>
                {clash.sameAs.map((item: ClashKey, index: number) => (
                  <span key={index}>
                    <Bind>{spacify(item.name)}</Bind>
                    {index !== clash.sameAs.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
              <i>Do you still want to rebind?</i>
            </ClashContent>
            <ModalButtonContainer>
              <ModalButton onClick={() => this.props.onResolveClash(clash, true)}>Yes</ModalButton>
              <ModalButton onClick={() => this.props.onResolveClash(clash, false)}>No</ModalButton>
            </ModalButtonContainer>
          </Clashed>
        </Modal>
      </ModalContainer>
    );
  }
}

export default ClashModal;
