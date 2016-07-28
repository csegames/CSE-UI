/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
export declare class TabState {
}
export interface TabProps {
    key: string;
    id: string;
    select: (tab: string) => void;
    selected?: boolean;
}
declare class Tab extends React.Component<TabProps, TabState> {
    constructor(props: TabProps);
    render(): JSX.Element;
    select(): void;
}
export default Tab;
