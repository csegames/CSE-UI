/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference path="../tsd/tsd.d.ts" />

declare type ClassValue = string | number | ClassDictionary | ClassArray;

interface ClassDictionary {
	[id: string]: boolean;
}

interface ClassArray extends Array<ClassValue> { }

interface ClassNamesFn {
	(...classes: ClassValue[]): string;
}

declare var classNames: ClassNamesFn;

declare module "classnames" {
	export default classNames
}
