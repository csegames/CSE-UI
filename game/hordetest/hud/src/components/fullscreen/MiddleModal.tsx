/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background-image: url(../images/fullscreen/settings/modal-middle.png);
  background-size: 100% 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

export interface Props {
}

export function MiddleModal(props: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState(null);

  useEffect(() => {
    const showHandle = game.on('show-middle-modal', showModal);
    const hideHandle = game.on('hide-middle-modal', hideModal);

    return () => {
      showHandle.clear();
      hideHandle.clear();
    };
  });

  function showModal(content: React.ReactChildren) {
    setIsVisible(true);
    setContent(content);
  }

  function hideModal() {
    setIsVisible(false);
    setContent(null);
  }

  function onClickOverlay() {
    hideModal();
  }

  const visibilityClassName = isVisible ? 'visible' : '';
  return (
    <>
      <Overlay className={visibilityClassName} onClick={onClickOverlay} />
      <Container className={visibilityClassName}>
        {content}
      </Container>
    </>
  );
}
