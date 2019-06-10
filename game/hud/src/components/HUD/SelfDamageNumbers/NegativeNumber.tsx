/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import { has } from 'lodash';
import { css } from '@csegames/linaria';
import { DamageEvent, ResourceEvent, NegativeEventBlock, getResourceType } from '.';
import { DamageNumber } from './DamageNumber';
import { AnimatedContainer } from './AnimatedContainer';

const Container = css`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: flex-end;
  right: 0;

  &.absolute {
    position: absolute;
  }
`;

export interface Props {
  canPositionAbsolute: boolean;
  negativeEvent: DamageEvent | ResourceEvent | NegativeEventBlock;
  onLifeEnd: (id: string) => void;
}

// tslint:disable-next-line:function-name
export function NegativeNumber(props: Props) {
  const { onLifeEnd, negativeEvent, canPositionAbsolute } = props;
  const [positionAbsolute, setPositionAbsolute] = useState(false);

  useEffect(() => {
    const lifetimeTimeout = window.setTimeout(() => onLifeEnd(negativeEvent.id), 4100);
    const positionAbsoluteTimeout = window.setTimeout(updatePosition, 1000);

    return () => {
      window.clearTimeout(lifetimeTimeout);
      window.clearTimeout(positionAbsoluteTimeout);
    };
  }, []);

  // useEffect(() => {
  //   if (!canPositionAbsolute && positionAbsolute) {
  //     setPositionAbsolute(false);
  //   }
  // }, [canPositionAbsolute]);

  function updatePosition() {
    if (canPositionAbsolute) {
      setPositionAbsolute(true);
    }
  }

  function renderNumber(event: DamageEvent | ResourceEvent, shouldAnimate?: boolean) {
    const positionAbsoluteClass = shouldAnimate && canPositionAbsolute && positionAbsolute ? 'absolute' : '';

    if (event.eventType === 'damage') {
      return (
        <DamageNumber
          id={event.id}
          damageNumber={event.received}
          shouldAnimate={shouldAnimate}
          positionAbsoluteClass={positionAbsoluteClass}
          type={event.eventType}
        />
      );
    } else {
      return (
        <DamageNumber
          id={event.id}
          damageNumber={event.received}
          shouldAnimate={shouldAnimate}
          positionAbsoluteClass={positionAbsoluteClass}
          type={event.eventType}
          resourceType={getResourceType(event)}
        />
      );
    }
  }

  if (has(negativeEvent, 'eventBlock')) {
    const positionAbsoluteClass = positionAbsolute ? 'absolute' : '';
    return (
      <AnimatedContainer className={`${Container} ${positionAbsoluteClass}`}>
        {(negativeEvent as NegativeEventBlock).eventBlock.map(e => renderNumber(e))}
      </AnimatedContainer>
    );
  }

  return renderNumber(negativeEvent as DamageEvent, true);
}
