declare class ChatLineParser {
    _key: number;
    static LINK: number;
    static EMOJI: number;
    static MARKDOWN: number;
    static COLOR: number;
    static ROOM: number;
    static HIGHLIGHT: number;
    static NICK: number;
    _parseText(text: string): JSX.Element[];
    parseAction(text: string): JSX.Element[];
    isAction(text: string): boolean;
    parse(text: string): JSX.Element[];
}
export default ChatLineParser;
