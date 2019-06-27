/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useLayoutEffect, useRef } from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: relative;
`;

export interface Props {
  children: JSX.Element | JSX.Element[];
  className?: string;
  shouldAnimate?: boolean;
}

// tslint:disable-next-line:function-name
export function AnimatedContainer(props: Props) {
  let startTime = 0;
  const element = useRef(null);

  useLayoutEffect(() => {
    const currentTime = new Date().getTime();
    startTime = currentTime;
    if (typeof props.shouldAnimate === 'undefined' || props.shouldAnimate) {
      requestAnimationFrame(() => animateChild(element.current, 4000));
    }
  }, []);

  function animateChild(el: HTMLDivElement, duration: number) {
    if (!el) return;
    const current = new Date().getTime();
    const runtime = current - startTime;
    const progress = Math.min(runtime / duration, 1);

    el.style.top = (progress * 100).toFixed(2) + '%';
    if (runtime < duration) {
      requestAnimationFrame(() => animateChild(el, duration));
    }
  }

  return (
    <Container className={props.className} ref={element}>
      {props.children}
    </Container>
  );
}
