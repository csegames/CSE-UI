interface ChatTextParserToken {
    expr: RegExp;
    token: number;
}
declare class ChatTextParser {
    static TEXT: number;
    tokens: ChatTextParserToken[];
    constructor(tokens: ChatTextParserToken[]);
    parse(text: string, callback: (token: number, text: string, match: RegExpExecArray) => JSX.Element[], index?: number): JSX.Element[];
}
export { ChatTextParserToken, ChatTextParser };
export default ChatTextParser;
