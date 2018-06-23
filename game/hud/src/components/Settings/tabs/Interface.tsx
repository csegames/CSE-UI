/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { DialogTab, DialogButton } from '../components/TabbedDialog/index';
import { SideMenu, MenuOption } from '../components/SideMenu';
import { ComingSoon } from '../panels/ComingSoon';
import * as BUTTON from './buttons';
import * as OPTION from './options';

const options: MenuOption[] = [OPTION.SKILLS, OPTION.CHAT];
const buttons: DialogButton[] = [BUTTON.APPLY, BUTTON.CANCEL];

interface InterfaceSettingsProps {
  onCancel: () => void;
}

/* tslint:disable:function-name */
export function InterfaceSettings(props: InterfaceSettingsProps) {
  return (
    <DialogTab buttons={buttons}>
      <SideMenu persist='interface' options={options}>{
        (option: MenuOption) => {
          return <ComingSoon/>;
        }
      }</SideMenu>
    </DialogTab>
  );
}

export default InterfaceSettings;
