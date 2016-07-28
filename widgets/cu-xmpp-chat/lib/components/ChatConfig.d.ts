export declare class ChatConfig {
    SCROLLBACK_BUFFER_SIZE: number;
    SHOW_COLORS: boolean;
    SHOW_EMOTICONS: boolean;
    SHOW_MARKDOWN: boolean;
    EMBED_IMAGES: boolean;
    EMBED_VIDEOS: boolean;
    JOIN_PARTS: boolean;
    TIMESTAMPS: boolean;
    NICK: string;
    HIGHLIGHTS: string[];
    constructor();
    setNick: (nick: string) => void;
    getHighlights: () => string[];
    refresh: () => void;
}
export declare const chatConfig: ChatConfig;
