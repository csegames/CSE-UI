/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export function printWithSeparator(n: number, separator: string) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

// Converts a large number to a string, abbreviating it as needed.
// examples:
//    largeIntegerToFriendlyString(50) == '50'
//    largeIntegerToFriendlyString(999) == '999'
//    largeIntegerToFriendlyString(1234) == '1.2K'
//    largeIntegerToFriendlyString(-5678) == '-5.7K'
//    largeIntegerToFriendlyString(51233) == '51K'
//    largeIntegerToFriendlyString(23_000_123) == '23M'
//    largeIntegerToFriendlyString(32_000_000_000) == '32B'
//    largeIntegerToFriendlyString(64_000_000_000_000) == '64T'
export function largeIntegerToFriendlyString(value: number): string {
  if (isNaN(value) || value === undefined) {
    // since this function is intended for displaying a value to a player, we want a sane fallback that actually looks like a number
    return '0';
  }

  // do all the math with positive numbers
  const isNegative: boolean = value < 0;
  const numberToString = (num: number, decimalPlaces: number) => (isNegative ? '-' : '') + num.toFixed(decimalPlaces);
  value = Math.abs(value);

  // 3 digits or less, just return the number
  if (value < 1000) {
    return numberToString(value, 0);
  }

  const suffixes: string[] = ['', 'K', 'M', 'B', 'T'];
  const suffixIdx = clamp(Math.floor(Math.log10(value) / 3.0), 0, suffixes.length - 1);
  const numDecimalPlaces = value < 10000 ? 1 : 0;
  return numberToString(value / Math.pow(10, 3 * suffixIdx), numDecimalPlaces) + suffixes[suffixIdx];
}

// Clamps a value between a minimum and a maximum
export function clamp(val: number, min: number, max: number): number {
  return val < min ? min : val > max ? max : val;
}

// Linear interpolation function
// Returns a value between a and b based on the alpha.
// If alpha == 0.0 this returns a, and if alpha == 1.0, this returns b.
// If alpha == 0.5, this returns a value halfway between a and b.
export function lerp(a: number, b: number, alpha: number): number {
  return a * (1.0 - alpha) + b * alpha;
}

// Clamped linear interpolation - same as lerp, but clamps outputs so they will never be
// less than a or greater than b
export function lerpClamped(a: number, b: number, alpha: number): number {
  return clamp(lerp(a, b, alpha), a, b);
}

// internal helper for initializing an empty tuple of a fixed size
function makeNumericTuple(length: number): number[] {
  let arr: number[] = [];
  for (let i = 0; i < length; i++) {
    arr.push(0);
  }
  return arr;
}

// Linear interpolation function
// Returns a value between a and b based on the alpha.
// If alpha == 0.0 this returns a, and if alpha == 1.0, this returns b.
// If alpha == 0.5, this returns a value halfway between a and b.
export function lerpTuple(a: number[], b: number[], alpha: number) {
  if (a.length == b.length) {
    let result: number[] = makeNumericTuple(a.length);
    for (let i = 0; i < a.length; i++) {
      result[i] = lerp(a[i], b[i], alpha);
    }
    return result;
  }

  return null;
}

// Clamped linear interpolation - same as lerp, but clamps outputs so they will never be
// less than a or greater than b
export function lerpTupleClamped(a: number[], b: number[], alpha: number): number[] {
  if (a.length == b.length) {
    let result: number[] = makeNumericTuple(a.length);
    for (let i = 0; i < a.length; i++) {
      result[i] = lerpClamped(a[i], b[i], alpha);
    }
    return result;
  }

  return null;
}

// converts a value from one numeric range to another.
// examples:
//    mapValueRange(5, 0, 10, 0, 1) == 0.5
//    mapValueRange(-2.5, 0, 10, 0, 4) == -1.0
//    mapValueRange(-2.5, 0, 10, 0, 4) == -1.0
//    mapValueRange(10, 5, 15, -1, 1) == 0.0
//    mapValueRange(11, 2, 12, -2, 2) == 1.6
export function mapValueRange(
  value: number,
  inputRangeA: number,
  inputRangeB: number,
  outputRangeA: number,
  outputRangeB: number
) {
  return outputRangeA + ((outputRangeB - outputRangeA) / (inputRangeB - inputRangeA)) * (value - inputRangeA);
}

// same as mapValueRange except the result is clamped to the output range
export function mapValueRangeClamped(
  value: number,
  inputRangeA: number,
  inputRangeB: number,
  outputRangeA: number,
  outputRangeB: number
) {
  const result = mapValueRange(value, inputRangeA, inputRangeB, outputRangeA, outputRangeB);
  return outputRangeA < outputRangeB
    ? clamp(result, outputRangeA, outputRangeB)
    : clamp(result, outputRangeB, outputRangeA);
}

// a single blendstop in a linear gradient
export interface BlendStop {
  value: number[];
  pos: number;
}

// Simple gradient blending function intended for numeric values
// Note that all blendstop values _must_ be the same length
export function linearBlend(stops: BlendStop[], alpha: number): number[] {
  if (stops.length < 2) {
    return null;
  }

  // all blend stops are expected to have the same length
  const blendStopLength = stops[0].value.length;
  for (let i = 1; i < stops.length; i++) {
    if (!stops[i] || !stops[i].value || stops[i].value.length != blendStopLength) {
      return null;
    }
  }

  // find the pair of BlendStops that alpha is between
  let blendStopA: BlendStop = null;
  let blendStopB: BlendStop = null;
  for (let i = 0; i < stops.length - 1; i++) {
    if (alpha >= stops[i].pos && alpha <= stops[i + 1].pos) {
      blendStopA = stops[i];
      blendStopB = stops[i + 1];
      break;
    }
  }

  if (blendStopA == null || blendStopB == null) {
    return null;
  }

  if (alpha >= 0.0 && alpha <= 1.0) {
    const spanSize: number = blendStopB.pos - blendStopA.pos;
    if (spanSize > 0) {
      const localAlpha: number = (alpha - blendStopA.pos) / spanSize;
      return lerpTuple(blendStopA.value, blendStopB.value, localAlpha);
    } else {
      return blendStopA.value;
    }
  } else if (alpha < 0.0) {
    return stops[0].value;
  } else if (alpha > 1.0) {
    return stops[stops.length - 1].value;
  }

  return null;
}

//
// Converts an html hex color to the rgba() syntax.
// Primarily intended for specifying a color once at the top of a file, and using it in several places with
// different alpha values (eg. transitions, box-shadow, text-shadow, etc.)
// Accepts either a 6-digit html hex color (eg. "#7a82ff") or the 3-digit shorthand syntax (eg. '#888').
// The '#' prefix is optional.
//
// Examples:
//   hexColorToRGBA("#aaa") == "rgba(170, 170, 170, 1.0000)"
//   hexColorToRGBA("#8a9f22", 0.25) == "rgba(138, 159, 34, 0.2500)"
//   hexColorToRGBA("98f", 1/3) == "rgba(153, 136, 255, 0.3333)"
//   hexColorToRGBA("00aabb", 0.85) == "rgba(0, 170, 187, 0.8500)"
//   hexColorToRGBA("#0ab") == "rgba(0, 170, 187, 1.0000)"
//
// Values default to 255 on invalid input, and the alpha value is clamped to 0..1
// Examples of INVALID INPUT:
//   hexColorToRGBA("#05z", -4) == "rgba(0, 85, 255, 0.0000)"
//   hexColorToRGBA("#33yy08", 2.5) == "rgba(51, 255, 8, 1.0000)"
//   hexColorToRGBA("") == "rgba(255, 255, 255, 1.0000)"
//
export function hexColorToRGBA(hexColor: string, alpha: number = 1.0) {
  // strip the optional "#" prefix if one was there
  if (hexColor.startsWith('#')) {
    hexColor = hexColor.substr(1);
  }

  let r = 255;
  let g = 255;
  let b = 255;

  if (hexColor.length == 3) {
    // allow a length-3 string using CSS shorthand syntax which doubles up each hex character (eg. "7D8" => "77DD88")
    r = parseInt(hexColor[0] + hexColor[0], 16);
    g = parseInt(hexColor[1] + hexColor[1], 16);
    b = parseInt(hexColor[2] + hexColor[2], 16);
  } else if (hexColor.length == 6) {
    // standard html color (eg. "ab6df7"), where each pair of two characters is just an 8-bit hex value
    r = parseInt(hexColor.substr(0, 2), 16);
    g = parseInt(hexColor.substr(2, 2), 16);
    b = parseInt(hexColor.substr(4, 2), 16);
  }
  // no need for an else block here - if hexColor.length is not 3 or 6, just leave the defaults (eg. just return white)

  // parseInt returns NaN if given an invalid hex string like "z5"
  if (isNaN(r)) {
    r = 255;
  }
  if (isNaN(g)) {
    g = 255;
  }
  if (isNaN(b)) {
    b = 255;
  }

  // clamp alpha
  if (alpha < 0.0) {
    alpha = 0.0;
  } else if (alpha > 1.0) {
    alpha = 1.0;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(4)})`;
}

// Arc logic
export const PIo180 = Math.PI / 180;

export function getRadius(d: number) {
  return d * PIo180;
}

export function p2c(x: number, y: number, radius: number, angle: number) {
  const radians = getRadius(angle - 90);
  return {
    x: x + radius * Math.cos(radians),
    y: y + radius * Math.sin(radians)
  };
}

export function currentMax2circleDegrees(current: number, max: number) {
  return (current / max) * 360;
}

export function arc2path(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  endAngle -= 0.0001;
  const end = p2c(x, y, radius, startAngle);
  const start = p2c(x, y, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return ['M', start.x, start.y, 'A', radius, radius, 0, large, 0, end.x, end.y].join(' ');
}
