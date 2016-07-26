/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
export interface AtUserListItemProps {
    user: string;
    selectUser: (user: string) => void;
    selected?: boolean;
}
export interface AtUserListItemState {
}
declare class AtUserListItem extends React.Component<AtUserListItemProps, AtUserListItemState> {
    selectUser: () => void;
    constructor(props: AtUserListItemProps);
    render(): JSX.Element;
}
export default AtUserListItem;
