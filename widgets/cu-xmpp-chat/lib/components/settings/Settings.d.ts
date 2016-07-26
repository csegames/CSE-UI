/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
export interface SettingsProps {
    key: string;
}
export interface SettingsState {
    section: any;
    sectionName: string;
    checked: boolean;
}
declare class Settings extends React.Component<SettingsProps, SettingsState> {
    constructor(props: SettingsProps);
    generateSection: (sectionName: string) => JSX.Element;
    navigate: (sectionName: string) => void;
    onChecked: (id: string) => void;
    render(): JSX.Element;
}
export default Settings;
