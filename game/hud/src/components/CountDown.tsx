/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.span`
`;

export interface CountdownProps extends Timing {
  hideWhenZero?: boolean;
}

// tslint:disable-next-line:function-name
export function CountDown(props: CountdownProps) {

  const [current, setCurrent] = useState(props.duration - (Date.now() - props.start));

  React.useEffect(() => {
    if (current > 0) {
      const timeout = Math.min(current, 100);
      const handle = setTimeout(() => setCurrent(current - timeout), timeout);
      return () => {
        clearTimeout(handle);
      };
    }
  });

  if (current <= 0 && props.hideWhenZero) return null;
  const seconds = current / 1000;
  return (
    <Container>{seconds >= 10 ? seconds.toFixed(0) : seconds.toFixed(1)}</Container>
  );
}
