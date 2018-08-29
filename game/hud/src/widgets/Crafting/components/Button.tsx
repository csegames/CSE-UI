/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import * as React from 'react';
import { client, soundEvents } from '@csegames/camelot-unchained';
import { StyleSheet, cssAphrodite, merge, button, ButtonStyles } from '../styles';

interface ButtonProps {
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: Partial<ButtonStyles>;
  children?: any;
  disableSound?: boolean;
}

export const Button = (props: ButtonProps) => {
  const ss = StyleSheet.create(merge({}, button, props.style));
  return (
    <button
      disabled={props.disabled}
      className={cssAphrodite(ss.button, props.disabled && ss.disabled)}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (!props.disableSound) {
          client.PlaySoundEvent(soundEvents.PLAY_UI_VOX_GENERICBUTTON);
        }
        props.onClick(e);
      }}
    >
      {props.children}
    </button>
  );
};

export default Button;
