/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference path="../tsd/tsd.d.ts" />
/// <reference path="./../tsd/react/react.d.ts" />

// classnames
declare namespace __ClassNames {
	type ClassValue = string | number | ClassDictionary | ClassArray;
	interface ClassDictionary {
		[id: string]: boolean;
	}
	interface ClassArray extends Array<ClassValue> { }
	interface ClassNamesFn {
		(...classes: ClassValue[]): string;
	}
	var classNames: ClassNamesFn;
}
declare module "classnames" {
	export default __ClassNames.classNames
}

// rc-tooltip
declare namespace __RcTooltip {
	class RcTooltip extends __React.Component<RcTooltipProps, any> {
		constructor(props: RcTooltipProps);
	}
	interface RcTooltipProps {
		key?: any;
		overlayClassName?: string;
		trigger?: string[];
		mouseEnterDelay?: number;
		mouseLeaveDelay?: number;
		overlayStyle?: any;
		prefixCls?: string;
		transitionName?: string;
		onVisibleChange?: any;
		visible?: boolean;
		defaultVisible?: boolean;
		placement?: any;
		align?: any;
		overlay?: any;
		arrowContent?: any;
		getTooltipContainer?: any;
		destroyTooltipOnHide?: boolean;
	}
}
declare module "rc-tooltip" {
	export default __RcTooltip.RcTooltip;
}
