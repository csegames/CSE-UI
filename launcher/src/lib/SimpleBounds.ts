/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// We use this instead of DOMRect internally, since a DOMRect can misbehave when passed through Redux.
export interface SimpleRect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export function simpleRectFromDOMRect(dom?: DOMRect): SimpleRect | undefined {
  if (dom === undefined) return undefined;
  const simple: SimpleRect = {
    x: (dom?.x ?? 0) + 0,
    y: (dom?.y ?? 0) + 0,
    width: dom?.width ?? 0,
    height: dom?.height ?? 0,
    top: dom?.y ?? 0,
    left: dom?.x ?? 0,
    right: (dom?.x ?? 0) + (dom?.width ?? 0),
    bottom: (dom?.y ?? 0) + (dom?.height ?? 0)
  };

  return simple;
}
