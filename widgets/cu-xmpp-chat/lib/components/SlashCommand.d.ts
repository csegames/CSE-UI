import ChatSession from './ChatSession';
declare class SlashCommand {
    name: string;
    args: string;
    argv: string[];
    constructor(command: string);
    exec(session: ChatSession): boolean;
}
export default SlashCommand;
