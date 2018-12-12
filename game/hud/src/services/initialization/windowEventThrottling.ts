/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default function() {

  /**
   * Throttle method from MDN - https://developer.mozilla.org/en-US/docs/Web/Events/resize
   */
  const throttle = function(type: string, name: string) {
    let running = false;
    const func = function() {
      if (running) { return; }
      running = true;
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    window.addEventListener(type, func);
  };

  /* init - you can init any event */
  throttle('resize', 'optimizedResize');
}
