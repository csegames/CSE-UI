/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
export interface BooleanOptionProps {
    key: string;
    optionKey: string;
    title: string;
    description: string;
    isChecked: boolean;
    onChecked: (key: string, value: any) => any;
}
export interface BooleanOptionState {
}
declare class BooleanOption extends React.Component<BooleanOptionProps, BooleanOptionState> {
    clicked: () => void;
    render(): JSX.Element;
}
export default BooleanOption;
