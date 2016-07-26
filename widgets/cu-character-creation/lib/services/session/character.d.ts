import 'isomorphic-fetch';
import { race, faction, gender, archetype } from 'camelot-unchained';
export interface CharacterCreationModel {
    name: string;
    race: race;
    gender: gender;
    faction: faction;
    archetype: archetype;
    shardID: number;
    attributes: {};
    banes?: {};
    boons?: {};
}
export declare function resetCharacter(): {
    type: string;
    state: CharacterState;
};
export declare function createCharacter(model: CharacterCreationModel, apiKey: string, apiUrl?: string, shard?: number, apiVersion?: number): (dispatch: (action: any) => any) => any;
export declare function createCharacterStarted(): {
    type: string;
};
export declare function createCharacterSuccess(model: CharacterCreationModel): {
    type: string;
    model: CharacterCreationModel;
};
export declare function createCharacterFailed(error: any): {
    type: string;
    error: any;
};
export interface CharacterState {
    isFetching?: boolean;
    success?: boolean;
    error?: string;
    created?: CharacterCreationModel;
}
export default function reducer(state?: CharacterState, action?: any): any;
