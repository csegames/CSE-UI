import 'isomorphic-fetch';
import ResponseError from '../../lib/ResponseError';
export interface FactionInfo {
    id: number;
    name: string;
    description: string;
    shortName: string;
}
export declare function requestFactions(): {
    type: string;
};
export declare function fetchFactionsSuccess(factions: Array<FactionInfo>): {
    type: string;
    factions: FactionInfo[];
    receivedAt: number;
};
export declare function fetchFactionsFailed(error: ResponseError): {
    type: string;
    error: string;
};
export declare function selectFaction(selected: FactionInfo): {
    type: string;
    selected: FactionInfo;
};
export declare function fetchFactions(apiUrl?: string, shard?: number, apiVersion?: number): (dispatch: (action: any) => any) => any;
export interface FactionsState {
    isFetching?: boolean;
    lastUpdated?: Date;
    factions?: Array<FactionInfo>;
    selected?: FactionInfo;
    error?: string;
}
export default function reducer(state?: FactionsState, action?: any): FactionsState;
