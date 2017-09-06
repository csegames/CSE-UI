/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-09-07 12:29:02
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-09-07 12:30:02
 */

export interface Anim {
  enable: boolean;
  speed: number;
  opacity_min: number;
  sync: boolean;
}

export interface Anim1 {
  enable: boolean;
  speed: number;
  size_min: number;
  sync: boolean;
}

export interface Attract {
  enable: boolean;
  rotateX: number;
  rotateY: number;
}

export interface Color {
  value: string;
}

export interface Density {
  enable: boolean;
  value_area: number;
}

export interface Events {
  onhover: LineLinked;
  onclick: LineLinked;
  resize: boolean;
}

export interface Image {
  src: string;
  width: number;
  height: number;
}

export interface Interactivity {
  detect_on: string;
  events: Events;
}

export interface LineLinked {
  enable: boolean;
}

export interface Move {
  enable: boolean;
  speed: number;
  direction: string;
  random: boolean;
  straight: boolean;
  out_mode: string;
  bounce: boolean;
  attract: Attract;
}

export interface Number {
  value: number;
  density: Density;
}

export interface Opacity {
  value: number;
  random: boolean;
  anim: Anim1;
}

export interface Particles {
  number: Number;
  color: Color;
  shape: Shape;
  opacity: Opacity;
  size: Opacity;
  line_linked: LineLinked;
  move: Move;
}

export interface RootInterface {
  particles: Particles;
  interactivity: Interactivity;
  retina_detect: boolean;
}

export interface Shape {
  type: string;
  stroke: Stroke;
  image: Image;
}

export interface Stroke {
  width: number;
  color: string;
}
