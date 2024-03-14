/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { KeybindsState, KeybindIDs, getActiveBindForKey } from '../../../../redux/keybindsSlice';
import { Binding } from '@csegames/library/dist/_baseGame/types/Keybind';
import { getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

const KeybindIconClass = 'Announcements-Utils-KeybindIcon';
const KeybindTextClass = 'Announcements-Utils-KeybindText';

const StringIDAnnoucementUnknownToken = 'AnnoucementUnknownToken';

const TOKEN: string = '`';

export function parseAnnouncementText(
  message: string,
  usingGamepad: boolean,
  keybinds: KeybindsState,
  stringTable: Dictionary<StringTableEntryDef>
): JSX.Element[] {
  let parsedMessage: JSX.Element[] = [];

  if (message == null || message.search(TOKEN) == -1) {
    parsedMessage.push(<>{message}</>);
  } else {
    var inCurrentToken = false;
    var currentToken = '';

    for (var i = 0; i < message.length; ++i) {
      if (!inCurrentToken && message[i] == TOKEN) {
        inCurrentToken = true;
      } else if (inCurrentToken && message[i] == TOKEN) {
        parsedMessage.push(parseToken(currentToken, usingGamepad, keybinds, stringTable));
        inCurrentToken = false;
        currentToken = '';
      } else if (inCurrentToken) {
        if (message[i] != ' ') {
          currentToken += message[i];
        }
      } else {
        parsedMessage.push(<>{message[i]}</>);
      }
    }

    if (inCurrentToken) {
      console.error(`Failed to parse announcment text ${message}`);
      parsedMessage.push(<>{currentToken}</>);
    }
  }

  return parsedMessage;
}

function parseToken(
  token: string,
  usingGamepad: boolean,
  keybinds: KeybindsState,
  stringTable: Dictionary<StringTableEntryDef>
): JSX.Element {
  for (const keybindID in KeybindIDs) {
    if (keybindID == token) {
      const keybind: Binding = getActiveBindForKey(usingGamepad, keybinds[keybindID]);
      if (keybind) {
        if (keybind.iconClass) {
          return <span className={`${KeybindIconClass} ${keybind.iconClass}`} />;
        }

        return (
          <span className={KeybindTextClass}>
            &nbsp;
            {keybind.name}
            &nbsp;
          </span>
        );
      }

      return;
    }
  }

  return <>{getTokenizedStringTableValue(StringIDAnnoucementUnknownToken, stringTable, { TOKEN: token })}</>;
}
