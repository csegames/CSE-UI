// Typescript conversion based on https://codepen.io/chriscoyier/pen/EatIr
// which is under the MIT license as per public codepen license found at
// https://blog.codepen.io/legal/licensing/. A copy of the MIT license is below.
//
// The MIT License (MIT)
//
// Copyright (c) 2013 - Chris Coyier - https://codepen.io/chriscoyier/pen/EatIr
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// tslint:disable

const lightenDarkenColor = (color: string, amount: number) => {
  let usePound = false;
  if (color[0] == '#') {
    color = color.slice(1);
    usePound = true;
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  if (r > 255) {
    r = 255;
  } else if (r < 0) {
    r = 0;
  }
  let b = ((num >> 8) & 0x00FF) + amount;
  if (b > 255) {
    b = 255;
  } else if (b < 0) {
    b = 0;
  }
  let g = (num & 0x0000FF) + amount;
  if (g > 255) {
    g = 255;
  } else if (g < 0) {
    g = 0;
  }
  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
};

export const hex2rgba = (color: string, alpha: number) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const a = alpha;
  return `rgba(${r},${g},${b},${a})`;
}

// Used to darken a color by a percentage amount. darkenColor(#ffffff, 20) will darken the hex 20%.
export const darkenColor = (color: string, amount: number) => {
  return lightenDarkenColor(color, amount * -1);
};

// Used to lighten a color by a percentage amount. lightenColor(#000000, 20) will lighten the hex 20%.
export const lightenColor = (color: string, amount: number) => {
  return lightenDarkenColor(color, amount);
};
