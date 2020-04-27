/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useState, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';

const Icon = styled.img`
`;

export interface Props {
  icon: string;

  id?: string;
  extraStyles?: string;
}

export function FallbackIcon(props: { icon: string, id?: string, extraStyles?: string }) {
  const [icon, setIcon] = useState(props.icon);

  useEffect(() => {
    setIcon(props.icon);
  }, [props.icon]);

  function onError() {
    setIcon('images/unknown-item.jpg');
  }

  return (
    <Icon id={props.id || ''} src={icon} className={props.extraStyles || ''} onError={onError} />
  );
}

