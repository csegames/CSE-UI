import * as React from 'react';
import { ChatMessage } from './ChatMessage';
export interface ChatLineState {
}
export interface ChatLineProps {
    message: ChatMessage;
    key: number;
}
declare class ChatLine extends React.Component<ChatLineProps, ChatLineState> {
    constructor(props: ChatLineProps);
    timestamp(message: ChatMessage): string;
    buildMessage(timestamp: JSX.Element, text: string, classes?: string): JSX.Element;
    render(): JSX.Element;
    PM(): void;
}
export default ChatLine;
