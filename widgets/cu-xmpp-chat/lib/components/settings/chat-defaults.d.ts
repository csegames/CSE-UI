/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export declare const prefixes: {
    display: string;
    rooms: string;
};
export declare const display: {
    embedImages: {
        key: string;
        type: string;
        default: boolean;
        title: string;
        description: string;
    };
    embedVideos: {
        key: string;
        type: string;
        default: boolean;
        title: string;
        description: string;
    };
    showColors: {
        key: string;
        type: string;
        default: boolean;
        title: string;
        description: string;
    };
    showEmoticons: {
        key: string;
        type: string;
        default: boolean;
        title: string;
        description: string;
    };
    showMarkdown: {
        key: string;
        type: string;
        default: boolean;
        title: string;
        description: string;
    };
    timestamps: {
        key: string;
        type: string;
        default: boolean;
        title: string;
        description: string;
    };
    joinParts: {
        key: string;
        type: string;
        default: boolean;
        title: string;
        description: string;
    };
};
export declare const rooms: string[];
export declare function initLocalStorage(): void;
declare var _default: {
    'chat-display': {
        embedImages: {
            key: string;
            type: string;
            default: boolean;
            title: string;
            description: string;
        };
        embedVideos: {
            key: string;
            type: string;
            default: boolean;
            title: string;
            description: string;
        };
        showColors: {
            key: string;
            type: string;
            default: boolean;
            title: string;
            description: string;
        };
        showEmoticons: {
            key: string;
            type: string;
            default: boolean;
            title: string;
            description: string;
        };
        showMarkdown: {
            key: string;
            type: string;
            default: boolean;
            title: string;
            description: string;
        };
        timestamps: {
            key: string;
            type: string;
            default: boolean;
            title: string;
            description: string;
        };
        joinParts: {
            key: string;
            type: string;
            default: boolean;
            title: string;
            description: string;
        };
    };
};
export default _default;
