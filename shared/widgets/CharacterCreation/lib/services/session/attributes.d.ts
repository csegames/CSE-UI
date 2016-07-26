import 'isomorphic-fetch';
import ResponseError from '../../lib/ResponseError';
export declare enum attributeType {
    NONE = 0,
    PRIMARY = 1,
    SECONDARY = 2,
    DERIVED = 3,
}
export interface AttributeInfo {
    name: string;
    description: string;
    derivedFrom: string;
    baseValue: number;
    type: attributeType;
    maxOrMultipler: number;
    allocatedPoints: number;
    minValue: number;
    units: string;
}
export declare function resetAttributes(): {
    type: string;
    state: AttributesState;
};
export declare function allocateAttributePoint(name: string, value: number): {
    type: string;
    name: string;
    value: number;
};
export declare function requestAttributes(): {
    type: string;
};
export declare function fetchAttributesSuccess(attributes: Array<AttributeInfo>): {
    type: string;
    attributes: AttributeInfo[];
    receivedAt: number;
};
export declare function fetchAttributesFailed(error: ResponseError): {
    type: string;
    error: string;
};
export declare function fetchAttributes(apiUrl?: string, shard?: number, apiVersion?: number): (dispatch: (action: any) => any) => any;
export interface AttributesState {
    isFetching?: boolean;
    lastUpdated?: Date;
    attributes?: Array<AttributeInfo>;
    error?: string;
    allocations?: Array<{
        name: string;
        value: number;
    }>;
    pointsAllocated?: number;
    maxPoints?: number;
}
export default function reducer(state?: AttributesState, action?: any): any;
