/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
export interface AtUserListProps {
    users: string[];
    selectedIndex: number;
    selectUser: (user: string) => void;
}
export interface AtUserListState {
}
declare class AtUserList extends React.Component<AtUserListProps, AtUserListState> {
    constructor(props: AtUserListProps);
    render(): JSX.Element;
}
export default AtUserList;
