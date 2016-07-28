import 'isomorphic-fetch';
import { race, faction } from 'camelot-unchained';
import ResponseError from '../../lib/ResponseError';
export interface RaceInfo {
    name: string;
    description: string;
    faction: faction;
    id: race;
}
export declare function requestRaces(): {
    type: string;
};
export declare function fetchRacesSuccess(races: Array<RaceInfo>): {
    type: string;
    races: RaceInfo[];
    receivedAt: number;
};
export declare function fetchRacesFailed(error: ResponseError): {
    type: string;
    error: string;
};
export declare function selectRace(selected: RaceInfo): {
    type: string;
    selected: RaceInfo;
};
export declare function fetchRaces(apiUrl?: string, shard?: number, apiVersion?: number): (dispatch: (action: any) => any) => any;
export interface RacesState {
    isFetching?: boolean;
    lastUpdated?: Date;
    races?: Array<RaceInfo>;
    selected?: RaceInfo;
    error?: string;
}
export default function reducer(state?: RacesState, action?: any): RacesState;
