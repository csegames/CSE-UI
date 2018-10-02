/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import './constants';

import { GameInterface } from './GameInterface';
import { InternalGameInterfaceExt } from './InternalGameInterfaceExt';
import { Engine } from './coherent';
import initializeGame from './initializeGame';

// Exports Constants + GameInterface + All interfaces defined for client models
export * from './GameInterface';
export * from './coherent';

// Recursively makes an type readonly
// thanks to this Github issue post - https://github.com/Microsoft/TypeScript/issues/13923#issuecomment-402901005
export type Primitive = undefined | null | boolean | string | number | Function;

export type Immutable<T> =
  T extends Primitive ? T :
    T extends [infer U] ? ReadonlyArray<U> :
      T extends Map<infer K, infer V> ? ReadonlyMap<K, V> : Readonly<T>;

export type DeepImmutable<T> =
  T extends Primitive ? T :
    T extends [infer U] ? DeepImmutableArray<U> :
      T extends Map<infer K, infer V> ? DeepImmutableMap<K, V> : DeepImmutableObject<T>;

export interface DeepImmutableArray<T> extends ReadonlyArray<DeepImmutable<T>> {}
export interface DeepImmutableMap<K, V> extends ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>> {}
export type DeepImmutableObject<T> = {
  readonly [K in keyof T]: DeepImmutable<T[K]>
};


// Let anyone including this library know that game and __devGame are globally available.
declare global {
  const game: DeepImmutable<GameInterface>;
  const _devGame: InternalGameInterfaceExt;
  const engine: Engine;
}

export default initializeGame;
