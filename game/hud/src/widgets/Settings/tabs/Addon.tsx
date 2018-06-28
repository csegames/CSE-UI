/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { DialogTab, DialogButton } from 'UI/TabbedDialog';
import { SideMenu, MenuOption } from 'UI/SideMenu';
import { ComingSoon } from '../panels/ComingSoon';
import * as BUTTON from './buttons';

const options: MenuOption[] = [];
const buttons: DialogButton[] = [BUTTON.APPLY, BUTTON.CANCEL];

interface AddonsSettingsProps {
  onCancel: () => void;
}

/* tslint:disable:function-name */
export function AddonSettings(props: AddonsSettingsProps) {
  return (
    <DialogTab buttons={buttons}>
      <SideMenu name='settings' id='addons' options={options}>{
        (option: MenuOption) => {
          return <ComingSoon/>;
        }
      }</SideMenu>
    </DialogTab>
  );
}

export default AddonSettings;
