import 'isomorphic-fetch';
import { race, gender } from 'camelot-unchained';
import ResponseError from '../../lib/ResponseError';
export interface AttributeOffsetInfo {
    race: race;
    gender: gender;
    attributeOffsets: any;
}
export declare function requestAttributeOffsets(): {
    type: string;
};
export declare function fetchAttributeOffsetsSuccess(offsets: Array<AttributeOffsetInfo>): {
    type: string;
    offsets: AttributeOffsetInfo[];
    receivedAt: number;
};
export declare function fetchAttributeOffsetsFailed(error: ResponseError): {
    type: string;
    error: string;
};
export declare function fetchAttributeOffsets(apiUrl?: string, shard?: number, apiVersion?: number): (dispatch: (action: any) => any) => any;
export interface AttributeOffsetsState {
    isFetching?: boolean;
    lastUpdated?: Date;
    offsets?: Array<AttributeOffsetInfo>;
    error?: string;
}
export default function reducer(state?: AttributeOffsetsState, action?: any): AttributeOffsetsState;
