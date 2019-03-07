/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import styled from 'react-emotion';

import { Modal } from 'shared/Modal';

const Container = styled('div')`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(50, 50, 50, 0.1);
  z-index: 9999;
`;

const EVT_SHOW_MODAL = 'cse_evt_show-modal';
export interface ShowModalOpts {
  render: (props: {
    onClose: (result: any) => any;
  }) => React.ReactNode;
  onClose: (result: any) => any;
}

export function showModal(options: ShowModalOpts) {
  game.trigger(EVT_SHOW_MODAL, options);
}

// tslint:disable-next-line:function-name
export function DynamicModal() {

  const [state, setState] = useState({
    visible: false,
    render: null,
    onClose: null,
  });

  useEffect(() => {

    const handle = game.on(EVT_SHOW_MODAL, (options: ShowModalOpts) => {
      setState({
        visible: true,
        render: options.render,
        onClose: options.onClose,
      });
    });

    return () => {
      handle.clear();
    };
  }, []);

  return state.visible ? (
    <Container>
      <Modal
        accentColor='#ffe6ba'
        highlightColorStrong='#ffe6ba'
        highlightColorWeak='#ffe6ba'
      >
        <state.render onClose={(result: any) => {
          state.onClose(result);
          setState({
            visible: false,
            render: null,
            onClose: null,
          });
        }} />
      </Modal>
    </Container>
  ) : null;
}
