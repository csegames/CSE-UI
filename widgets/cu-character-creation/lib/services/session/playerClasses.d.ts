import 'isomorphic-fetch';
import ResponseError from '../../lib/ResponseError';
import { archetype, faction } from 'camelot-unchained';
export interface PlayerClassInfo {
    name: string;
    description: string;
    faction: faction;
    id: archetype;
}
export declare function requestPlayerClasses(): {
    type: string;
};
export declare function fetchPlayerClassesSuccess(playerClasses: Array<PlayerClassInfo>): {
    type: string;
    playerClasses: PlayerClassInfo[];
    receivedAt: number;
};
export declare function fetchPlayerClassesFailed(error: ResponseError): {
    type: string;
    error: string;
};
export declare function selectPlayerClass(selected: PlayerClassInfo): {
    type: string;
    selected: PlayerClassInfo;
};
export declare function fetchPlayerClasses(apiUrl?: string, shard?: number, apiVersion?: number): (dispatch: (action: any) => any) => any;
export interface PlayerClassesState {
    isFetching?: boolean;
    lastUpdated?: Date;
    playerClasses?: Array<PlayerClassInfo>;
    selected?: PlayerClassInfo;
    error?: string;
}
export default function reducer(state?: PlayerClassesState, action?: any): PlayerClassesState;
