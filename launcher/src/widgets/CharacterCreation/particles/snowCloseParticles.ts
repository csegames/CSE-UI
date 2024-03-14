/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// tslint:disable

const snowCloseParticles = {
  particles: {
    number: {
      value: 15,
      density: {
        enable: false,
        value_area: 1000
      }
    },
    color: {
      value: '#fff'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      },
      polygon: {
        nb_sides: 3
      },
      image: {
        width: 50,
        height: 50
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 2,
        opacity_min: 0.2,
        sync: false
      }
    },
    size: {
      value: 12,
      random: true,
      anim: {
        enable: false,
        speed: 300,
        size_min: 100,
        sync: true
      }
    },
    line_linked: {
      enable: false,
      distance: 157.82952832645452,
      color: '#ffffff',
      opacity: 0.4,
      width: 0.31565905665290905
    },
    move: {
      enable: true,
      speed: 40,
      direction: 'bottom-right',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 1104.8066982851817,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: false,
        mode: 'bubble'
      },
      onclick: {
        enable: false,
        mode: 'repulse'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 0.5
        }
      },
      bubble: {
        distance: 400,
        size: 4,
        duration: 0.3,
        opacity: 1,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: false
};

export default snowCloseParticles;
