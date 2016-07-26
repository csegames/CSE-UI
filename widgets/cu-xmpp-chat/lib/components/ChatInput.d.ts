/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
export interface ChatInputState {
    atUsers: string[];
    atUsersIndex: number;
    expanded: boolean;
}
export interface ChatInputProps {
    label: string;
    send: (text: string) => void;
    slashCommand: (command: string) => void;
    scroll: (extra?: number) => void;
}
declare class ChatInput extends React.Component<ChatInputProps, ChatInputState> {
    _privateMessageHandler: any;
    tabUserList: string[];
    tabUserIndex: number;
    sentMessages: string[];
    sentMessageIndex: number;
    constructor(props: ChatInputProps);
    initialState(): ChatInputState;
    componentWillUnmount(): void;
    componentDidMount(): void;
    selectAtUser: (user: string) => void;
    getInputNode(): HTMLInputElement;
    keyDown(e: React.KeyboardEvent): void;
    keyUp(e: React.KeyboardEvent): void;
    parseInput(e: React.KeyboardEvent): void;
    expand: (input: HTMLTextAreaElement) => void;
    collapse: () => void;
    send(): void;
    privateMessage(name: string): void;
    render(): JSX.Element;
}
export default ChatInput;
