/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
export declare class TabsState {
}
export declare class TabsProps {
    current: string;
    select: (tab: string) => void;
}
declare class Tabs extends React.Component<TabsProps, TabsState> {
    constructor(props: TabsProps);
    render(): JSX.Element;
}
export default Tabs;
